import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ghiLog } from "@/lib/api";

export const runtime = "nodejs";

function dauNgay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// Chạy batch: quét các kỳ quá hạn, trừ điểm CIC (mỗi 5 ngày trễ -50)
export async function POST(req: Request) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);

    const homNay = new Date();
    const homNayTs = dauNgay(homNay);

    const quaHan = await prisma.lichTra.findMany({
      where: { daThanhToan: false, ngayDenHan: { lt: homNay } },
      include: { hopDong: { include: { khachHang: true } } },
    });

    let soLanTru = 0;

    await prisma.$transaction(async (tx) => {
      for (const l of quaHan) {
        const soNgayTre = Math.floor(
          (homNayTs - dauNgay(new Date(l.ngayDenHan))) / 86400000
        );
        const moc = Math.floor(soNgayTre / 5); // mỗi 5 ngày = 1 mốc

        if (moc > l.soLanTruDiem) {
          const truMoi = moc - l.soLanTruDiem;
          const kh = l.hopDong.khachHang;
          const diemCu = kh.diemCIC;
          const diemMoi = Math.max(300, kh.diemCIC - truMoi * 50);

          await tx.khachHang.update({
            where: { id: kh.id },
            data: { diemCIC: diemMoi },
          });
          await tx.lichTra.update({
            where: { id: l.id },
            data: { soLanTruDiem: moc },
          });
          await tx.lichSuCIC.create({
            data: {
              khachHangId: kh.id,
              diemCu,
              diemMoi,
              lyDo: `Quá hạn kỳ ${l.kyThu} HĐ #${l.hopDongId}: trễ ${soNgayTre} ngày (-${truMoi * 50})`,
            },
          });
          // Cập nhật điểm trong bộ nhớ để các kỳ cùng khách hàng dùng giá trị mới
          kh.diemCIC = diemMoi;
          soLanTru += truMoi;
        }
      }
    });

    await ghiLog(
      claims,
      "Chạy batch thu hồi nợ",
      "Hệ thống",
      `Quét ${quaHan.length} kỳ quá hạn, trừ điểm ${soLanTru} lần`
    );

    return ok({
      thongBao: "Chạy batch hoàn tất",
      soKyQuaHan: quaHan.length,
      soLanTruDiem: soLanTru,
    });
  });
}
