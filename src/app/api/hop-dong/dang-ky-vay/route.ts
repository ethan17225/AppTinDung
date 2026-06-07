import { VaiTro, TrangThaiHopDong } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError } from "@/lib/api";

export const runtime = "nodejs";

// Khách hàng gửi yêu cầu vay mới
export async function POST(req: Request) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.KhachHang]);
    if (claims.khachHangId == null)
      throw new ApiError(400, "Không xác định được khách hàng");

    const dto = await req.json();
    const hd = await prisma.hopDong.create({
      data: {
        khachHangId: claims.khachHangId,
        hanMuc: dto.hanMuc,
        kyHanThang: Number(dto.kyHanThang),
        laiSuat: 12, // lãi suất mặc định 12%/năm, nhân viên có thể điều chỉnh khi duyệt
        mucDich: dto.mucDich ?? "",
        trangThai: TrangThaiHopDong.ChoDuyet,
      },
    });

    return ok({
      id: hd.id,
      thongBao: "Gửi yêu cầu vay thành công, vui lòng chờ duyệt",
    });
  });
}
