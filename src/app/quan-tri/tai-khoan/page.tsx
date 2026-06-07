"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api-client";
import { ngay, nhanVaiTro } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import type { TaiKhoan } from "@/lib/types";

export default function AccountsPage() {
  const router = useRouter();
  const { dangTai, laAdmin } = useAuth();
  const [ds, setDs] = useState<TaiKhoan[]>([]);
  const [moTao, setMoTao] = useState(false);
  const [thongBao, setThongBao] = useState("");
  const [loi, setLoi] = useState("");
  const [form, setForm] = useState({
    tenDangNhap: "",
    email: "",
    matKhau: "",
    vaiTro: "NhanVien",
  });

  useEffect(() => {
    if (!dangTai && !laAdmin) router.replace("/quan-tri");
  }, [dangTai, laAdmin, router]);

  const tai = useCallback(() => {
    api.dsTaiKhoan().then(setDs).catch(() => {});
  }, []);

  useEffect(() => {
    if (laAdmin) tai();
  }, [laAdmin, tai]);

  async function tao() {
    setLoi("");
    setThongBao("");
    try {
      await api.taoTaiKhoan(form);
      setThongBao("Đã tạo tài khoản");
      setMoTao(false);
      setForm({ tenDangNhap: "", email: "", matKhau: "", vaiTro: "NhanVien" });
      tai();
    } catch (err) {
      setLoi(
        err instanceof ApiClientError ? err.thongBao : "Tạo tài khoản thất bại"
      );
    }
  }

  async function doiTrangThai(id: number) {
    await api.doiTrangThaiTaiKhoan(id);
    tai();
  }

  async function xoa(id: number) {
    setLoi("");
    try {
      await api.xoaTaiKhoan(id);
      setThongBao("Đã xóa tài khoản");
      tai();
    } catch (err) {
      setLoi(err instanceof ApiClientError ? err.thongBao : "Không xóa được");
    }
  }

  if (dangTai || !laAdmin) return null;

  return (
    <>
      <div className="section-head">
        <div>
          <h1 className="page-title">Quản lý tài khoản</h1>
          <p className="muted" style={{ margin: 0 }}>
            Tạo, khóa và xóa tài khoản người dùng hệ thống.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setMoTao(!moTao)}>
          ＋ Tạo tài khoản
        </button>
      </div>

      {thongBao && <div className="alert alert-ok">{thongBao}</div>}
      {loi && <div className="alert alert-error">{loi}</div>}

      {moTao && (
        <div className="card card-pad" style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Tài khoản mới</h3>
          <div className="flex gap-12 wrap">
            <div className="field grow">
              <label>Tên đăng nhập</label>
              <input
                className="input"
                value={form.tenDangNhap}
                onChange={(e) =>
                  setForm({ ...form, tenDangNhap: e.target.value })
                }
              />
            </div>
            <div className="field grow">
              <label>Email</label>
              <input
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-12 wrap">
            <div className="field grow">
              <label>Mật khẩu</label>
              <input
                className="input"
                type="password"
                value={form.matKhau}
                onChange={(e) => setForm({ ...form, matKhau: e.target.value })}
              />
            </div>
            <div className="field grow">
              <label>Vai trò</label>
              <select
                className="select"
                value={form.vaiTro}
                onChange={(e) => setForm({ ...form, vaiTro: e.target.value })}
              >
                <option value="NhanVien">Nhân viên tín dụng</option>
                <option value="Admin">Quản trị viên</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={tao}>
            Lưu
          </button>
        </div>
      )}

      <div className="card table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Email</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ds.map((t) => (
              <tr key={t.id}>
                <td>#{t.id}</td>
                <td style={{ fontWeight: 600 }}>{t.tenDangNhap}</td>
                <td>{t.email}</td>
                <td>
                  <span className="badge badge-neutral">
                    {nhanVaiTro(t.vaiTro)}
                  </span>
                </td>
                <td>
                  {t.dangHoatDong ? (
                    <span className="badge badge-ok">Hoạt động</span>
                  ) : (
                    <span className="badge badge-danger">Đã khóa</span>
                  )}
                </td>
                <td>{ngay(t.ngayTao)}</td>
                <td className="flex gap-8">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => doiTrangThai(t.id)}
                  >
                    {t.dangHoatDong ? "Khóa" : "Mở"}
                  </button>
                  {t.tenDangNhap !== "ADMIN" && (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => xoa(t.id)}
                    >
                      Xóa
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
