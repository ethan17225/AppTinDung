import { VaiTro, TrangThaiHopDong, LoaiGiaoDich } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError } from "@/lib/api";
import { taoLichTra } from "@/lib/nghiepvu";
import { toNum } from "@/lib/serialize";

export const runtime = "nodejs";

// Duyệt & giải ngân hồ sơ (Admin/NhanVien): ChoDuyet -> DaGiaiNgan
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);
    const id = Number((await params).id);

    const hd = await prisma.hopDong.findUnique({ where: { id } });
    if (!hd) throw new ApiError(404, "Không tìm thấy hợp đồng");
    if (hd.trangThai !== TrangThaiHopDong.ChoDuyet) {
      throw new ApiError(400, "Hồ sơ không ở trạng thái chờ duyệt");
    }

    const ngayGiaiNgan = new Date();
    const hanMuc = toNum(hd.hanMuc);
    const lich = taoLichTra(
      hanMuc,
      hd.kyHanThang,
      toNum(hd.laiSuat),
      ngayGiaiNgan
    );

    await prisma.$transaction([
      prisma.hopDong.update({
        where: { id },
        data: {
          trangThai: TrangThaiHopDong.DaGiaiNgan,
          ngayGiaiNgan,
          duNoConLai: hanMuc,
          nhanVienId: hd.nhanVienId ?? claims.taiKhoanId,
          lichTras: {
            create: lich.map((l) => ({
              kyThu: l.kyThu,
              ngayDenHan: l.ngayDenHan,
              soTienGoc: l.soTienGoc,
              soTienLai: l.soTienLai,
              daThanhToan: l.daThanhToan,
            })),
          },
          giaoDichs: {
            create: {
              soTien: hanMuc,
              loaiGiaoDich: LoaiGiaoDich.GiaiNgan,
              ghiChu: "Giải ngân hợp đồng vay",
            },
          },
        },
      }),
      prisma.auditLog.create({
        data: {
          taiKhoanId: claims.taiKhoanId,
          nguoiThucHien: claims.tenDangNhap,
          hanhDong: "Duyệt & giải ngân",
          doiTuong: `Hợp đồng #${id}`,
          chiTiet: `Giải ngân ${hanMuc} cho KH #${hd.khachHangId}`,
        },
      }),
    ]);

    return ok({ thongBao: "Duyệt và giải ngân thành công" });
  });
}
