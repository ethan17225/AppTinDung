import { PrismaClient, VaiTro } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Khởi tạo dữ liệu mặc định: tài khoản ADMIN / 12345
async function main() {
  const daCo = await prisma.taiKhoan.findUnique({
    where: { tenDangNhap: "ADMIN" },
  });

  if (!daCo) {
    await prisma.taiKhoan.create({
      data: {
        tenDangNhap: "ADMIN",
        email: "admin@tindung.vn",
        matKhauHash: bcrypt.hashSync("12345", 10),
        vaiTro: VaiTro.Admin,
        dangHoatDong: true,
      },
    });
    console.log("Đã tạo tài khoản ADMIN mặc định (mật khẩu: 12345).");
  } else {
    console.log("Tài khoản ADMIN đã tồn tại, bỏ qua seed.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
