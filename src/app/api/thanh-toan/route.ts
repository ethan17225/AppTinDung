import { VaiTro, TrangThaiHopDong, LoaiGiaoDich } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError } from "@/lib/api";
import { toNum } from "@/lib/serialize";

export const runtime = "nodejs";

// Định dạng tiền giống .NET ToString("N0") cho ghi chú biên lai
function dinhDangN0(x: number): string {
  return Math.round(x).toLocaleString("en-US");
}

// Thanh toán một kỳ (giả lập cổng thanh toán). Khách hàng hoặc nhân viên.
export async function POST(req: Request) {
  return xuLy(async () => {
    const claims = await yeuCau(req);
    const { lichTraId } = await req.json();

    const lich = await prisma.lichTra.findUnique({
      where: { id: Number(lichTraId) },
      include: { hopDong: { include: { khachHang: true } } },
    });

    if (!lich) throw new ApiError(404, "Không tìm thấy kỳ thanh toán");
    if (lich.daThanhToan) throw new ApiError(400, "Kỳ này đã thanh toán");

    const hd = lich.hopDong;
    const kh = hd.khachHang;

    // Kiểm tra quyền: khách hàng chỉ trả hợp đồng của mình
    if (
      claims.vaiTro === VaiTro.KhachHang &&
      hd.khachHangId !== claims.khachHangId
    ) {
      throw new ApiError(403, "Không có quyền truy cập");
    }

    const now = new Date();
    const soTienGoc = toNum(lich.soTienGoc);
    const soTienLai = toNum(lich.soTienLai);
    const soTien = soTienGoc + soTienLai;

    // Giảm dư nợ gốc
    let duNoConLai = toNum(hd.duNoConLai) - soTienGoc;
    if (duNoConLai < 0) duNoConLai = 0;

    // Cập nhật trạng thái hợp đồng
    let trangThai = hd.trangThai;
    if (duNoConLai <= 0) trangThai = TrangThaiHopDong.TatToan;
    else if (hd.trangThai === TrangThaiHopDong.DaGiaiNgan)
      trangThai = TrangThaiHopDong.DangVay;

    // Cập nhật điểm CIC: trả đúng hạn -> +5
    const denHan = new Date(lich.ngayDenHan);
    const traDungHan =
      new Date(now.toDateString()) <= new Date(denHan.toDateString());
    const diemCu = kh.diemCIC;
    const diemMoi = traDungHan ? Math.min(700, kh.diemCIC + 5) : kh.diemCIC;

    await prisma.$transaction(async (tx) => {
      await tx.lichTra.update({
        where: { id: lich.id },
        data: { daThanhToan: true, ngayThanhToan: now },
      });

      await tx.giaoDich.create({
        data: {
          hopDongId: hd.id,
          soTien,
          loaiGiaoDich: LoaiGiaoDich.ThuNo,
          ghiChu: `Thanh toán kỳ ${lich.kyThu} (gốc ${dinhDangN0(
            soTienGoc
          )} + lãi ${dinhDangN0(soTienLai)})`,
        },
      });

      await tx.hopDong.update({
        where: { id: hd.id },
        data: { duNoConLai, trangThai },
      });

      if (traDungHan) {
        await tx.khachHang.update({
          where: { id: kh.id },
          data: { diemCIC: diemMoi },
        });
        await tx.lichSuCIC.create({
          data: {
            khachHangId: kh.id,
            diemCu,
            diemMoi,
            lyDo: `Thanh toán đúng hạn kỳ ${lich.kyThu} (+5)`,
          },
        });
      }
    });

    return ok({
      thongBao: "Thanh toán thành công",
      bienLai: {
        maGiaoDich: `BL${now
          .toISOString()
          .replace(/[-:T.Z]/g, "")
          .slice(0, 14)}`,
        kyThu: lich.kyThu,
        soTien,
        thoiGian: now,
        hopDongId: hd.id,
        tenKhachHang: kh.hoTen,
        duNoConLai,
      },
    });
  });
}
