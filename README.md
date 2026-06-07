# App Tín Dụng - Hệ thống Quản lý Tín dụng, Cho vay & Thu hồi nợ

Nền tảng Core-Credit gồm cổng khách hàng tự phục vụ và phân hệ quản trị/vận hành cho nhân viên tín dụng & quản trị viên. Toàn bộ ứng dụng (giao diện + API + cơ sở dữ liệu) được gói trong **một dự án Next.js duy nhất**, sẵn sàng triển khai lên **Vercel**.

## Thành viên thực hiện
- **Nguyễn Phú Thái** - Database
- **Dương Đức Pháp** - Backend
- **Trần Nhật Anh** - Frontend

## Công nghệ sử dụng
- **Framework:** Next.js 15 (App Router, React 19, TypeScript)
- **Giao diện:** React client components + CSS thuần (giữ nguyên thiết kế fintech ban đầu)
- **API:** Next.js Route Handlers (`src/app/api/**`)
- **Cơ sở dữ liệu:** PostgreSQL qua Prisma ORM
- **Xác thực:** JWT (thư viện `jose`) + mật khẩu băm bằng `bcryptjs`

> Phiên bản trước dùng Angular + ASP.NET Core + MySQL. Bản này đã được port hoàn toàn sang Next.js để chạy trên hạ tầng serverless của Vercel.

## Cấu trúc thư mục
```
.
├── prisma/
│   ├── schema.prisma     # Lược đồ CSDL (7 bảng + enum)
│   └── seed.ts           # Tạo tài khoản ADMIN mặc định
└── src/
    ├── app/
    │   ├── api/          # Toàn bộ API (auth, khach-hang, hop-dong, ...)
    │   ├── dang-nhap/    # Trang đăng nhập
    │   ├── dang-ky/      # Trang đăng ký
    │   ├── quen-mat-khau/
    │   ├── quan-tri/     # Khu vực Admin / Nhân viên
    │   ├── portal/       # Cổng Khách hàng
    │   ├── globals.css   # Hệ thống thiết kế
    │   └── layout.tsx
    ├── components/       # BrandPanel dùng chung
    └── lib/              # prisma, auth (JWT), nghiệp vụ, api client, định dạng
```

## Cài đặt & chạy cục bộ

### 1. Cài dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Sao chép `.env.example` thành `.env` và điền:
```
DATABASE_URL="postgresql://user:password@host:5432/app_tindung?schema=public"
JWT_SECRET="chuoi_bi_mat_du_dai"
JWT_EXPIRE_HOURS=8
```
Có thể dùng Postgres cục bộ hoặc một dịch vụ serverless (Neon, Supabase, Vercel Postgres).

### 3. Tạo bảng & seed dữ liệu
```bash
npm run db:push     # tạo bảng theo prisma/schema.prisma
npm run db:seed     # tạo tài khoản ADMIN / 12345
```

### 4. Chạy ứng dụng
```bash
npm run dev
```
Mở `http://localhost:3000`.

## Triển khai lên Vercel
1. Đẩy mã nguồn lên GitHub.
2. Vào Vercel → **Add New Project** → import repo.
3. Tạo một Postgres database (Vercel Postgres, Neon, hoặc Supabase) và lấy chuỗi kết nối.
4. Thêm Environment Variables trên Vercel: `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRE_HOURS`.
5. Deploy. Lệnh build mặc định `prisma generate && next build` đã được cấu hình sẵn.
6. Sau lần deploy đầu, chạy migrate + seed một lần (từ máy bạn, trỏ `DATABASE_URL` tới DB production):
   ```bash
   npm run db:push
   npm run db:seed
   ```

## Tài khoản mặc định
| Vai trò | Tài khoản | Mật khẩu |
|---------|-----------|----------|
| Quản trị viên (Admin) | `ADMIN` | `12345` |

Khách hàng tự đăng ký tài khoản mới qua màn hình **Tạo tài khoản**.

## Phân quyền
- **Admin:** toàn quyền + quản lý tài khoản, xem nhật ký hệ thống (Audit Log).
- **Nhân viên tín dụng:** quản lý khách hàng (KYC), hồ sơ vay, thu hồi nợ, báo cáo.
- **Khách hàng:** xem thông tin cá nhân & điểm CIC, chi tiết khoản vay, thanh toán trực tuyến, đăng ký vay mới.

## Nghiệp vụ chính
- **Quy trình hồ sơ vay:** Chờ duyệt → Đã giải ngân → Đang vay → Tất toán.
- **Điểm tín dụng CIC:** khách mới 650 điểm; thanh toán đúng hạn +5; mỗi 5 ngày quá hạn -50 (qua chức năng *Chạy batch cập nhật nợ*).
- **Phân loại nhóm nợ theo CIC:** Nhóm 1 (690-700), Nhóm 2 (670-689), Nhóm 3 (650-669), Nhóm 4 (600-649), Nhóm 5 (<600 - nợ xấu).
- **Thanh toán trực tuyến:** mô phỏng cổng thanh toán, sinh biên lai điện tử.
- **Lịch trả nợ:** tính theo phương pháp dư nợ giảm dần.

## Ghi chú
- Chức năng "Quên mật khẩu" mô phỏng việc gửi email: mã xác nhận được hiển thị trực tiếp trên màn hình để tiện kiểm thử.
- Cổng thanh toán hiện ở chế độ mô phỏng (mock).
