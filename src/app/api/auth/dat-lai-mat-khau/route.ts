import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { ok, xuLy, ApiError } from "@/lib/api";

export const runtime = "nodejs";

// Đặt lại mật khẩu bằng mã xác nhận
export async function POST(req: Request) {
  return xuLy(async () => {
    const { email, maXacNhan, matKhauMoi } = await req.json();

    const tk = await prisma.taiKhoan.findFirst({ where: { email } });
    if (!tk || !tk.maXacNhan || tk.maXacNhan !== maXacNhan) {
      throw new ApiError(400, "Mã xác nhận không đúng");
    }

    await prisma.taiKhoan.update({
      where: { id: tk.id },
      data: {
        matKhauHash: bcrypt.hashSync(matKhauMoi ?? "", 10),
        maXacNhan: null,
      },
    });

    return ok({ thongBao: "Đổi mật khẩu thành công" });
  });
}
