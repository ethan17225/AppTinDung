"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandPanel from "@/components/BrandPanel";
import { api, ApiClientError } from "@/lib/api-client";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [maXacNhan, setMaXacNhan] = useState("");
  const [matKhauMoi, setMatKhauMoi] = useState("");
  const [buoc, setBuoc] = useState(1);
  const [loi, setLoi] = useState("");
  const [thanhCong, setThanhCong] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);

  async function guiMa(e: React.FormEvent) {
    e.preventDefault();
    setLoi("");
    setThanhCong("");
    setDangXuLy(true);
    try {
      const kq = await api.quenMatKhau(email);
      setBuoc(2);
      setThanhCong(`${kq.thongBao} Mã của bạn: ${kq.maXacNhan}`);
    } catch (err) {
      setLoi(err instanceof ApiClientError ? err.thongBao : "Không gửi được mã");
    } finally {
      setDangXuLy(false);
    }
  }

  async function datLai(e: React.FormEvent) {
    e.preventDefault();
    setLoi("");
    setThanhCong("");
    setDangXuLy(true);
    try {
      await api.datLaiMatKhau(email, maXacNhan, matKhauMoi);
      setThanhCong(
        "Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập..."
      );
      setTimeout(() => router.push("/dang-nhap"), 1500);
    } catch (err) {
      setLoi(
        err instanceof ApiClientError ? err.thongBao : "Đổi mật khẩu thất bại"
      );
    } finally {
      setDangXuLy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <BrandPanel />

      <div className="auth-panel">
        <div className="auth-card">
          <h2>Quên mật khẩu</h2>
          <p className="lead">
            {buoc === 1
              ? "Nhập email đăng ký để nhận mã xác nhận."
              : "Nhập mã xác nhận và mật khẩu mới."}
          </p>

          {loi && <div className="alert alert-error">{loi}</div>}
          {thanhCong && <div className="alert alert-ok">{thanhCong}</div>}

          {buoc === 1 ? (
            <form onSubmit={guiMa}>
              <div className="field">
                <label>Email đăng ký</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={dangXuLy}
              >
                {dangXuLy ? "Đang gửi..." : "Gửi mã xác nhận"}
              </button>
            </form>
          ) : (
            <form onSubmit={datLai}>
              <div className="field">
                <label>Mã xác nhận</label>
                <input
                  className="input"
                  value={maXacNhan}
                  onChange={(e) => setMaXacNhan(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label>Mật khẩu mới</label>
                <input
                  className="input"
                  type="password"
                  value={matKhauMoi}
                  onChange={(e) => setMatKhauMoi(e.target.value)}
                  required
                />
              </div>
              <button
                className="btn btn-primary btn-block"
                type="submit"
                disabled={dangXuLy}
              >
                {dangXuLy ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </form>
          )}

          <p className="auth-foot">
            <Link href="/dang-nhap">Quay lại đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
