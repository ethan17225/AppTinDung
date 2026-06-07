import bcrypt from "bcryptjs";
import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { taoToken } from "@/lib/auth";
import { ok, xuLy, ApiError } from "@/lib/api";

export const runtime = "nodejs";

// Đăng ký tài khoản mới (chỉ dành cho khách hàng)
export async function POST(req: Request) {
  return xuLy(async () => {
    const { hoTen, email, sdt, diaChi, cccd, matKhau } = await req.json();

    const daCo = await prisma.taiKhoan.findFirst({
      where: { tenDangNhap: email },
    });
    if (daCo) throw new ApiError(400, "Email đã được đăng ký");

    const kh = await prisma.khachHang.create({
      data: {
        hoTen: hoTen ?? "",
        email: email ?? "",
        sdt: sdt ?? "",
        diaChi: diaChi ?? "",
        cccd: cccd ?? "",
        diemCIC: 650,
        lichSuCICs: {
          create: {
            diemCu: 650,
            diemMoi: 650,
            lyDo: "Khởi tạo điểm CIC cho khách hàng mới",
          },
        },
      },
    });

    const tk = await prisma.taiKhoan.create({
      data: {
        tenDangNhap: email,
        email: email ?? "",
        matKhauHash: bcrypt.hashSync(matKhau ?? "", 10),
        vaiTro: VaiTro.KhachHang,
        khachHangId: kh.id,
      },
    });

    const token = await taoToken({
      taiKhoanId: tk.id,
      tenDangNhap: tk.tenDangNhap,
      vaiTro: tk.vaiTro,
      khachHangId: kh.id,
    });

    return ok({
      token,
      taiKhoanId: tk.id,
      tenDangNhap: tk.tenDangNhap,
      vaiTro: tk.vaiTro,
      khachHangId: kh.id,
      hoTen: kh.hoTen,
    });
  });
}
