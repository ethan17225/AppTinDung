import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau } from "@/lib/api";

export const runtime = "nodejs";

// Nhật ký hệ thống (Admin)
export async function GET(req: Request) {
  return xuLy(async () => {
    await yeuCau(req, [VaiTro.Admin]);

    const ds = await prisma.auditLog.findMany({
      orderBy: { thoiGian: "desc" },
      take: 200,
      select: {
        id: true,
        nguoiThucHien: true,
        hanhDong: true,
        doiTuong: true,
        chiTiet: true,
        thoiGian: true,
      },
    });

    return ok(ds);
  });
}
