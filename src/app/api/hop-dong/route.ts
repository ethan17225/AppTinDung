import { Prisma, VaiTro, TrangThaiHopDong } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError, ghiLog } from "@/lib/api";
import { toNum } from "@/lib/serialize";

export const runtime = "nodejs";

// Danh sách hợp đồng (lọc theo vai trò)
export async function GET(req: Request) {
  return xuLy(async () => {
    const claims = await yeuCau(req);

    const where: Prisma.HopDongWhereInput = {};
    if (claims.vaiTro === VaiTro.KhachHang) {
      where.khachHangId = claims.khachHangId ?? -1;
    } else if (claims.vaiTro === VaiTro.NhanVien) {
      where.OR = [{ nhanVienId: null }, { nhanVienId: claims.taiKhoanId }];
    }

    const ds = await prisma.hopDong.findMany({
      where,
      orderBy: { id: "desc" },
      include: { khachHang: { select: { hoTen: true } } },
    });

    return ok(
      ds.map((h) => ({
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
      }))
    );
  });
}

// Nhân viên/Admin tạo hồ sơ vay cho khách hàng
export async function POST(req: Request) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);
    const dto = await req.json();

    const kh = await prisma.khachHang.findUnique({
      where: { id: Number(dto.khachHangId) },
    });
    if (!kh) throw new ApiError(400, "Không tìm thấy khách hàng");

    const hd = await prisma.hopDong.create({
      data: {
        khachHangId: Number(dto.khachHangId),
        hanMuc: dto.hanMuc,
        kyHanThang: Number(dto.kyHanThang),
        laiSuat: dto.laiSuat,
        mucDich: dto.mucDich ?? "",
        trangThai: TrangThaiHopDong.ChoDuyet,
        nhanVienId: claims.taiKhoanId,
      },
    });

    await ghiLog(
      claims,
      "Tạo hồ sơ vay",
      "Hợp đồng",
      `Tạo hồ sơ vay cho KH #${dto.khachHangId}, hạn mức ${dto.hanMuc}`
    );

    return ok({ id: hd.id, thongBao: "Tạo hồ sơ thành công" });
  });
}
