import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError } from "@/lib/api";
import { toNum } from "@/lib/serialize";

export const runtime = "nodejs";

// Chi tiết hợp đồng kèm lịch trả và giao dịch
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req);
    const id = Number((await params).id);

    const h = await prisma.hopDong.findUnique({
      where: { id },
      include: {
        khachHang: { select: { hoTen: true } },
        lichTras: { orderBy: { kyThu: "asc" } },
        giaoDichs: { orderBy: { thoiGian: "desc" } },
      },
    });
    if (!h) throw new ApiError(404, "Không tìm thấy hợp đồng");

    if (
      claims.vaiTro === VaiTro.KhachHang &&
      h.khachHangId !== claims.khachHangId
    ) {
      throw new ApiError(403, "Không có quyền truy cập");
    }

    return ok({
      id: h.id,
      khachHangId: h.khachHangId,
      tenKhachHang: h.khachHang.hoTen,
      hanMuc: toNum(h.hanMuc),
      kyHanThang: h.kyHanThang,
      laiSuat: toNum(h.laiSuat),
      mucDich: h.mucDich,
      trangThai: h.trangThai,
      duNoConLai: toNum(h.duNoConLai),
      ngayTao: h.ngayTao,
      ngayGiaiNgan: h.ngayGiaiNgan,
      nhanVienId: h.nhanVienId,
      lichTra: h.lichTras.map((l) => ({
        id: l.id,
        kyThu: l.kyThu,
        ngayDenHan: l.ngayDenHan,
        soTienGoc: toNum(l.soTienGoc),
        soTienLai: toNum(l.soTienLai),
        tongKy: toNum(l.soTienGoc) + toNum(l.soTienLai),
        daThanhToan: l.daThanhToan,
        ngayThanhToan: l.ngayThanhToan,
      })),
      giaoDich: h.giaoDichs.map((g) => ({
        id: g.id,
        soTien: toNum(g.soTien),
        thoiGian: g.thoiGian,
        loaiGiaoDich: g.loaiGiaoDich,
        ghiChu: g.ghiChu,
      })),
    });
  });
}
