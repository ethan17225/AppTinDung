import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau } from "@/lib/api";
import { nhomNo } from "@/lib/nghiepvu";
import { toNum } from "@/lib/serialize";

export const runtime = "nodejs";

function dauNgay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

// Danh sách các kỳ sắp đến hạn / quá hạn chưa thanh toán
export async function GET(req: Request) {
  return xuLy(async () => {
    await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);

    const homNay = new Date();
    const gioiHan = new Date();
    gioiHan.setDate(gioiHan.getDate() + 7);

    const ds = await prisma.lichTra.findMany({
      where: { daThanhToan: false, ngayDenHan: { lte: gioiHan } },
      orderBy: { ngayDenHan: "asc" },
      include: { hopDong: { include: { khachHang: true } } },
    });

    const ketQua = ds.map((l) => {
      const soNgayTre = Math.floor(
        (dauNgay(homNay) - dauNgay(new Date(l.ngayDenHan))) / 86400000
      );
      const kh = l.hopDong.khachHang;
      return {
        id: l.id,
        hopDongId: l.hopDongId,
        tenKhachHang: kh.hoTen,
        kyThu: l.kyThu,
        ngayDenHan: l.ngayDenHan,
        soTien: toNum(l.soTienGoc) + toNum(l.soTienLai),
        soNgayTre: soNgayTre > 0 ? soNgayTre : 0,
        quaHan: soNgayTre > 0,
        diemCIC: kh.diemCIC,
        nhomNo: nhomNo(kh.diemCIC),
      };
    });

    return ok(ketQua);
  });
}
