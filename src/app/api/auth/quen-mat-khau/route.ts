import { prisma } from "@/lib/prisma";
import { ok, xuLy, ApiError } from "@/lib/api";

export const runtime = "nodejs";

// Quên mật khẩu: giả lập gửi mã xác nhận (trả về trực tiếp để demo)
export async function POST(req: Request) {
  return xuLy(async () => {
    const { email } = await req.json();

    const tk = await prisma.taiKhoan.findFirst({ where: { email } });
    if (!tk) throw new ApiError(400, "Không tìm thấy tài khoản với email này");

    const ma = String(Math.floor(100000 + Math.random() * 900000));
    await prisma.taiKhoan.update({
      where: { id: tk.id },
      data: { maXacNhan: ma },
    });

    // Giả lập email: trả mã về cho client (demo). Thực tế sẽ gửi qua SMTP.
    return ok({
      thongBao:
        "Mã xác nhận đã được gửi (giả lập). Vui lòng dùng mã bên dưới để đặt lại mật khẩu.",
      maXacNhan: ma,
    });
  });
}
