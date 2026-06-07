# App Tín Dụng - Hệ thống Quản lý Tín dụng, Cho vay & Thu hồi nợ

Đồ án xây dựng nền tảng Core-Credit gồm cổng khách hàng tự phục vụ và phân hệ quản trị/vận hành cho nhân viên tín dụng & quản trị viên.

## Thành viên thực hiện
- **Nguyễn Phú Thái** - Database
- **Dương Đức Pháp** - Backend
- **Trần Nhật Anh** - Frontend

## Công nghệ sử dụng
- **Frontend:** Angular (standalone components, SCSS)
- **Backend:** C# ASP.NET Core 8 Web API (Entity Framework Core, JWT)
- **Database:** MySQL Server (localhost:3306)

## Cấu trúc thư mục
```
App Tín Dụng/
├── backend/    # ASP.NET Core Web API
└── frontend/   # Angular
```

## Yêu cầu cài đặt
- .NET SDK 8.0
- Node.js 20+ và Angular CLI (`npm i -g @angular/cli`)
- MySQL Server đang chạy tại `localhost:3306`

## Cấu hình Database
Chuỗi kết nối nằm trong [backend/appsettings.json](backend/appsettings.json):
```
server=localhost;port=3306;database=app_tindung;user=root;password=123456789;
```
Khi chạy backend lần đầu, hệ thống **tự động tạo database `app_tindung`** cùng toàn bộ bảng và tài khoản quản trị mặc định.

## Chạy ứng dụng

### 1. Backend (API)
```bash
cd backend
dotnet run --urls http://localhost:5285
```
- API: `http://localhost:5285`
- Swagger UI: `http://localhost:5285/swagger`

### 2. Frontend (Angular)
```bash
cd frontend
npm install        # lần đầu
ng serve
```
- Giao diện: `http://localhost:4200`
- Đã cấu hình proxy: mọi request `/api` được chuyển tới backend `http://localhost:5285`.

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
- **Điểm tín dụng CIC:** khách mới 650 điểm; thanh toán đúng hạn +5; mỗi 5 ngày quá hạn -50 (chạy qua chức năng *Chạy batch cập nhật nợ*).
- **Phân loại nhóm nợ theo CIC:** Nhóm 1 (690-700), Nhóm 2 (670-689), Nhóm 3 (650-669), Nhóm 4 (600-649), Nhóm 5 (<600 - nợ xấu).
- **Thanh toán trực tuyến:** mô phỏng cổng thanh toán, sinh biên lai điện tử (có thể tích hợp MoMo sandbox sau).
- **Lịch trả nợ:** tính theo phương pháp dư nợ giảm dần.

## Ghi chú
- Chức năng "Quên mật khẩu" mô phỏng việc gửi email: mã xác nhận được hiển thị trực tiếp trên màn hình để tiện kiểm thử.
- Cổng thanh toán hiện ở chế độ mô phỏng (mock).
