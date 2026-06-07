import { VaiTro, TrangThaiHopDong } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError, ghiLog } from "@/lib/api";

export const runtime = "nodejs";

// Từ chối hồ sơ
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin, VaiTro.NhanVien]);
    const id = Number((await params).id);

    const hd = await prisma.hopDong.findUnique({ where: { id } });
    if (!hd) throw new ApiError(404, "Không tìm thấy hợp đồng");
    if (hd.trangThai !== TrangThaiHopDong.ChoDuyet) {
      throw new ApiError(400, "Chỉ từ chối được hồ sơ chờ duyệt");
    }

    await prisma.hopDong.update({
      where: { id },
      data: { trangThai: TrangThaiHopDong.TuChoi },
    });
    await ghiLog(claims, "Từ chối hồ sơ", `Hợp đồng #${id}`, "Từ chối hồ sơ vay");

    return ok({ thongBao: "Đã từ chối hồ sơ" });
  });
}
