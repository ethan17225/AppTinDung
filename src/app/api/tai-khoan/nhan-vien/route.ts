import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau } from "@/lib/api";

export const runtime = "nodejs";

// Danh sách nhân viên tín dụng (để gán hồ sơ)
export async function GET(req: Request) {
  return xuLy(async () => {
    await yeuCau(req, [VaiTro.Admin]);

    const ds = await prisma.taiKhoan.findMany({
      where: { vaiTro: { in: [VaiTro.NhanVien, VaiTro.Admin] } },
      select: { id: true, tenDangNhap: true, vaiTro: true },
    });

    return ok(ds);
  });
}
