import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError, ghiLog } from "@/lib/api";

export const runtime = "nodejs";

// Khóa / mở khóa tài khoản (Admin)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin]);
    const id = Number((await params).id);

    const tk = await prisma.taiKhoan.findUnique({ where: { id } });
    if (!tk) throw new ApiError(404, "Không tìm thấy tài khoản");

    const capNhat = await prisma.taiKhoan.update({
      where: { id },
      data: { dangHoatDong: !tk.dangHoatDong },
    });

    await ghiLog(
      claims,
      "Đổi trạng thái tài khoản",
      `Tài khoản #${id}`,
      capNhat.dangHoatDong ? "Mở khóa" : "Khóa"
    );

    return ok({
      thongBao: "Cập nhật trạng thái thành công",
      dangHoatDong: capNhat.dangHoatDong,
    });
  });
}
