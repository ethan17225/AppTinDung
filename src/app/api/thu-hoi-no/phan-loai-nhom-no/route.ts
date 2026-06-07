import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau } from "@/lib/api";
import { nhomNo, tenNhomNo } from "@/lib/nghiepvu";

export const runtime = "nodejs";

// Thống kê phân loại nhóm nợ toàn hệ thống
export async function GET(req: Request) {
  return xuLy(async () => {
    await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);

    const khachHangs = await prisma.khachHang.findMany({
      select: { diemCIC: true },
    });

    const ketQua = [1, 2, 3, 4, 5].map((n) => ({
      nhom: n,
      ten: tenNhomNo(n),
      soLuong: khachHangs.filter((k) => nhomNo(k.diemCIC) === n).length,
    }));

    return ok(ketQua);
  });
}
