import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau } from "@/lib/api";
import { toNum } from "@/lib/serialize";

export const runtime = "nodejs";

// Lịch sử giao dịch của khách hàng đang đăng nhập
export async function GET(req: Request) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.KhachHang]);

    const ds = await prisma.giaoDich.findMany({
      where: { hopDong: { khachHangId: claims.khachHangId ?? -1 } },
      orderBy: { thoiGian: "desc" },
    });

    return ok(
      ds.map((g) => ({
        id: g.id,
        hopDongId: g.hopDongId,
        soTien: toNum(g.soTien),
        thoiGian: g.thoiGian,
        loaiGiaoDich: g.loaiGiaoDich,
        ghiChu: g.ghiChu,
      }))
    );
  });
}
