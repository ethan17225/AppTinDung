import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError, ghiLog } from "@/lib/api";
import { nhomNo, tenNhomNo } from "@/lib/nghiepvu";
import type { TokenClaims } from "@/lib/auth";

export const runtime = "nodejs";

function coQuyenXem(claims: TokenClaims, khachHangId: number): boolean {
  if (claims.vaiTro === VaiTro.Admin || claims.vaiTro === VaiTro.NhanVien)
    return true;
  return claims.khachHangId === khachHangId;
}

// Chi tiết một khách hàng (Admin/NhanVien hoặc chính khách hàng đó)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req);
    const id = Number((await params).id);
    if (!coQuyenXem(claims, id)) throw new ApiError(403, "Không có quyền truy cập");

    const k = await prisma.khachHang.findUnique({ where: { id } });
    if (!k) throw new ApiError(404, "Không tìm thấy khách hàng");

    const nhom = nhomNo(k.diemCIC);
    return ok({
      id: k.id,
      hoTen: k.hoTen,
      email: k.email,
      sdt: k.sdt,
      diaChi: k.diaChi,
      cccd: k.cccd,
      diemCIC: k.diemCIC,
      ngayTao: k.ngayTao,
      nhomNo: nhom,
      tenNhomNo: tenNhomNo(nhom),
    });
  });
}

// Cập nhật thông tin KYC (Admin/NhanVien)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);
    const id = Number((await params).id);

    const k = await prisma.khachHang.findUnique({ where: { id } });
    if (!k) throw new ApiError(404, "Không tìm thấy khách hàng");

    const dto = await req.json();
    const capNhat = await prisma.khachHang.update({
      where: { id },
      data: {
        hoTen: dto.hoTen ?? "",
        email: dto.email ?? "",
        sdt: dto.sdt ?? "",
        diaChi: dto.diaChi ?? "",
        cccd: dto.cccd ?? "",
      },
    });

    await ghiLog(
      claims,
      "Cập nhật KYC",
      `Khách hàng #${id}`,
      `Cập nhật thông tin khách hàng ${capNhat.hoTen}`
    );

    return ok({ thongBao: "Cập nhật thành công" });
  });
}
