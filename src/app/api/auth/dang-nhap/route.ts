import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { taoToken } from "@/lib/auth";
import { ok, xuLy, ApiError } from "@/lib/api";

export const runtime = "nodejs";

// Đăng nhập
export async function POST(req: Request) {
  return xuLy(async () => {
    const { tenDangNhap, matKhau } = await req.json();

    const tk = await prisma.taiKhoan.findFirst({
      where: { tenDangNhap },
      include: { khachHang: true },
    });

    if (!tk || !bcrypt.compareSync(matKhau ?? "", tk.matKhauHash)) {
      throw new ApiError(400, "Tài khoản hoặc mật khẩu không đúng");
    }
    if (!tk.dangHoatDong) {
      throw new ApiError(400, "Tài khoản đã bị khóa");
    }

    const token = await taoToken({
      taiKhoanId: tk.id,
      tenDangNhap: tk.tenDangNhap,
      vaiTro: tk.vaiTro,
      khachHangId: tk.khachHangId,
    });

    return ok({
      token,
      taiKhoanId: tk.id,
      tenDangNhap: tk.tenDangNhap,
      vaiTro: tk.vaiTro,
      khachHangId: tk.khachHangId,
      hoTen: tk.khachHang?.hoTen ?? tk.tenDangNhap,
    });
  });
}
