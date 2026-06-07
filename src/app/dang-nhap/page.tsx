"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandPanel from "@/components/BrandPanel";
import { api, ApiClientError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { luu } = useAuth();
  const router = useRouter();
  const [tenDangNhap, setTenDangNhap] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [loi, setLoi] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);

  async function dangNhap(e: React.FormEvent) {
    e.preventDefault();
    setLoi("");
    setDangXuLy(true);
    try {
      const kq = await api.dangNhap(tenDangNhap, matKhau);
      luu(kq);
      router.push(kq.vaiTro === "KhachHang" ? "/portal" : "/quan-tri");
    } catch (err) {
      setLoi(
        err instanceof ApiClientError ? err.thongBao : "Đăng nhập thất bại"
      );
      setDangXuLy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <BrandPanel />

      <div className="auth-panel">
        <div className="auth-card">
          <h2>Đăng nhập</h2>
          <p className="lead">
            Chào mừng trở lại. Vui lòng đăng nhập để tiếp tục.
          </p>

          {loi && <div className="alert alert-error">{loi}</div>}

          <form onSubmit={dangNhap}>
            <div className="field">
              <label>Tài khoản</label>
              <input
                className="input"
                value={tenDangNhap}
                onChange={(e) => setTenDangNhap(e.target.value)}
                placeholder="Tên đăng nhập hoặc email"
                required
              />
            </div>
            <div className="field">
              <label>Mật khẩu</label>
              <input
                className="input"
                type="password"
                value={matKhau}
                onChange={(e) => setMatKhau(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
            <div
              className="flex between items-center"
              style={{ marginBottom: 18 }}
            >
              <Link href="/quen-mat-khau">Quên mật khẩu?</Link>
            </div>
            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={dangXuLy}
            >
              {dangXuLy ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>

          <div className="hint">
            Tài khoản quản trị mặc định: <b>ADMIN</b> / <b>12345</b>
          </div>

          <p className="auth-foot">
            Chưa có tài khoản?{" "}
            <Link href="/dang-ky">Tạo tài khoản khách hàng</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
