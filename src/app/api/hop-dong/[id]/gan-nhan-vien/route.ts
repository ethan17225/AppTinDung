import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError, ghiLog } from "@/lib/api";

export const runtime = "nodejs";

// Gán nhân viên phụ trách (Admin)
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin]);
    const id = Number((await params).id);

    const hd = await prisma.hopDong.findUnique({ where: { id } });
    if (!hd) throw new ApiError(404, "Không tìm thấy hợp đồng");

    const { nhanVienId } = await req.json();
    await prisma.hopDong.update({
      where: { id },
      data: { nhanVienId: Number(nhanVienId) },
    });
    await ghiLog(
      claims,
      "Gán nhân viên",
      `Hợp đồng #${id}`,
      `Gán nhân viên #${nhanVienId}`
    );

    return ok({ thongBao: "Gán nhân viên thành công" });
  });
}
