import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau } from "@/lib/api";
import { nhomNo } from "@/lib/nghiepvu";

export const runtime = "nodejs";

// Danh sách khách hàng (Admin/NhanVien)
export async function GET(req: Request) {
  return xuLy(async () => {
    await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);

    const ds = await prisma.khachHang.findMany({
      orderBy: { id: "desc" },
      include: { _count: { select: { hopDongs: true } } },
    });

    return ok(
      ds.map((k) => ({
        id: k.id,
        hoTen: k.hoTen,
        email: k.email,
        sdt: k.sdt,
        diaChi: k.diaChi,
        cccd: k.cccd,
        diemCIC: k.diemCIC,
        ngayTao: k.ngayTao,
        nhomNo: nhomNo(k.diemCIC),
        soHopDong: k._count.hopDongs,
      }))
    );
  });
}
