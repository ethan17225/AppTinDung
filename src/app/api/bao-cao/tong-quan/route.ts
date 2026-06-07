import { VaiTro, TrangThaiHopDong } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau } from "@/lib/api";
import { nhomNo } from "@/lib/nghiepvu";
import { toNum } from "@/lib/serialize";

export const runtime = "nodejs";

// Bảng điều khiển tổng quan
export async function GET(req: Request) {
  return xuLy(async () => {
    await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);

    const hopDongs = await prisma.hopDong.findMany({
      include: { khachHang: { select: { diemCIC: true } } },
    });
    const now = new Date();
    const dauThang = new Date(now.getFullYear(), now.getMonth(), 1);

    const tongDuNo = hopDongs.reduce((s, h) => s + toNum(h.duNoConLai), 0);
    const duNoXau = hopDongs
      .filter((h) => nhomNo(h.khachHang.diemCIC) >= 5)
      .reduce((s, h) => s + toNum(h.duNoConLai), 0);
    const tyLeNoXau =
      tongDuNo > 0 ? Math.round((duNoXau / tongDuNo) * 100 * 100) / 100 : 0;

    const soKhachHang = await prisma.khachHang.count();

    return ok({
      tongDuNo,
      tyLeNoXau,
      soHopDongMoiThangNay: hopDongs.filter((h) => h.ngayTao >= dauThang).length,
      tongSoHopDong: hopDongs.length,
      soHopDongDangVay: hopDongs.filter(
        (h) =>
          h.trangThai === TrangThaiHopDong.DangVay ||
          h.trangThai === TrangThaiHopDong.DaGiaiNgan
      ).length,
      soHopDongChoDuyet: hopDongs.filter(
        (h) => h.trangThai === TrangThaiHopDong.ChoDuyet
      ).length,
      soKhachHang,
    });
  });
}
