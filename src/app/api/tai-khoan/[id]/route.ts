import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError, ghiLog } from "@/lib/api";

export const runtime = "nodejs";

// Xóa tài khoản (Admin)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin]);
    const id = Number((await params).id);

    const tk = await prisma.taiKhoan.findUnique({ where: { id } });
    if (!tk) throw new ApiError(404, "Không tìm thấy tài khoản");
    if (tk.tenDangNhap === "ADMIN") {
      throw new ApiError(400, "Không thể xóa tài khoản ADMIN gốc");
    }

    await prisma.taiKhoan.delete({ where: { id } });
    await ghiLog(claims, "Xóa tài khoản", `Tài khoản #${id}`, tk.tenDangNhap);

    return ok({ thongBao: "Đã xóa tài khoản" });
  });
}
