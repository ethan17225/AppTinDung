"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import BrandPanel from "@/components/BrandPanel";
import { api, ApiClientError } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

export default function RegisterPage() {
  const { luu } = useAuth();
  const router = useRouter();
  const [data, setData] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    diaChi: "",
    cccd: "",
    matKhau: "",
  });
  const [loi, setLoi] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);

  const set = (k: keyof typeof data) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setData((d) => ({ ...d, [k]: e.target.value }));

  async function dangKy(e: React.FormEvent) {
    e.preventDefault();
    setLoi("");
    setDangXuLy(true);
    try {
      const kq = await api.dangKy(data);
      luu(kq);
      router.push("/portal");
    } catch (err) {
      setLoi(err instanceof ApiClientError ? err.thongBao : "Đăng ký thất bại");
      setDangXuLy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <BrandPanel />

      <div className="auth-panel">
        <div className="auth-card" style={{ maxWidth: 440 }}>
          <h2>Tạo tài khoản</h2>
          <p className="lead">
            Dành cho khách hàng mới. Vui lòng điền phiếu đăng ký.
          </p>

          {loi && <div className="alert alert-error">{loi}</div>}

          <form onSubmit={dangKy}>
            <div className="field">
              <label>Họ và tên</label>
              <input className="input" value={data.hoTen} onChange={set("hoTen")} required />
            </div>
            <div className="flex gap-12">
              <div className="field grow">
                <label>Số điện thoại</label>
                <input className="input" value={data.sdt} onChange={set("sdt")} required />
              </div>
              <div className="field grow">
                <label>CCCD</label>
                <input className="input" value={data.cccd} onChange={set("cccd")} required />
              </div>
            </div>
            <div className="field">
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={data.email}
                onChange={set("email")}
                required
              />
            </div>
            <div className="field">
              <label>Địa chỉ</label>
              <input className="input" value={data.diaChi} onChange={set("diaChi")} required />
            </div>
            <div className="field">
              <label>Mật khẩu</label>
              <input
                className="input"
                type="password"
                value={data.matKhau}
                onChange={set("matKhau")}
                required
              />
            </div>
            <button
              className="btn btn-primary btn-block"
              type="submit"
              disabled={dangXuLy}
            >
              {dangXuLy ? "Đang tạo..." : "Đăng ký"}
            </button>
          </form>

          <p className="auth-foot">
            Đã có tài khoản? <Link href="/dang-nhap">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
