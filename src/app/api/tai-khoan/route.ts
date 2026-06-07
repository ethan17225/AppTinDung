import bcrypt from "bcryptjs";
import { VaiTro } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, yeuCau, ApiError, ghiLog } from "@/lib/api";

export const runtime = "nodejs";

// Danh sách tài khoản (Admin)
export async function GET(req: Request) {
  return xuLy(async () => {
    await yeuCau(req, [VaiTro.Admin]);

    const ds = await prisma.taiKhoan.findMany({
      orderBy: { id: "asc" },
      select: {
        id: true,
        tenDangNhap: true,
        email: true,
        vaiTro: true,
        dangHoatDong: true,
        ngayTao: true,
        khachHangId: true,
      },
    });

    return ok(ds);
  });
}

// Tạo tài khoản mới (Admin)
export async function POST(req: Request) {
  return xuLy(async () => {
    const claims = await yeuCau(req, [VaiTro.Admin]);
    const dto = await req.json();

    const daCo = await prisma.taiKhoan.findUnique({
      where: { tenDangNhap: dto.tenDangNhap },
    });
    if (daCo) throw new ApiError(400, "Tên đăng nhập đã tồn tại");

    if (!Object.values(VaiTro).includes(dto.vaiTro)) {
      throw new ApiError(400, "Vai trò không hợp lệ");
    }

    const tk = await prisma.taiKhoan.create({
      data: {
        tenDangNhap: dto.tenDangNhap,
        email: dto.email ?? "",
        matKhauHash: bcrypt.hashSync(dto.matKhau ?? "", 10),
        vaiTro: dto.vaiTro as VaiTro,
        dangHoatDong: true,
      },
    });

    await ghiLog(
      claims,
      "Tạo tài khoản",
      `Tài khoản ${dto.tenDangNhap}`,
      `Vai trò ${dto.vaiTro}`
    );

    return ok({ id: tk.id, thongBao: "Tạo tài khoản thành công" });
  });
}
