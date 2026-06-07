import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError } from "@/lib/api";

export const runtime = "nodejs";

// Lịch sử biến động điểm CIC (Admin/NhanVien hoặc chính khách hàng đó)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req);
    const id = Number((await params).id);

    const coQuyen =
      claims.vaiTro === VaiTro.Admin ||
      claims.vaiTro === VaiTro.NhanVien ||
      claims.khachHangId === id;
    if (!coQuyen) throw new ApiError(403, "Không có quyền truy cập");

    const ds = await prisma.lichSuCIC.findMany({
      where: { khachHangId: id },
      orderBy: { thoiGian: "desc" },
      select: { id: true, diemCu: true, diemMoi: true, lyDo: true, thoiGian: true },
    });

    return ok(ds);
  });
}
