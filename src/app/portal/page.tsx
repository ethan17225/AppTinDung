"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";
import { tien, ngayGio, nhanNhomNo, nhanTrangThai } from "@/lib/format";
import type { KhachHang, LichSuCIC, HopDong } from "@/lib/types";

export default function ProfilePage() {
  const { user } = useAuth();
  const [kh, setKh] = useState<KhachHang | null>(null);
  const [lichSu, setLichSu] = useState<LichSuCIC[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDong[]>([]);

  useEffect(() => {
    const id = user?.khachHangId;
    if (id) {
      api.chiTietKhachHang(id).then(setKh).catch(() => {});
      api.lichSuCic(id).then(setLichSu).catch(() => {});
    }
    api.dsHopDong().then(setHopDongs).catch(() => {});
  }, [user?.khachHangId]);

  const phanTramCic = (d: number) => Math.round(((d - 300) / 400) * 100);
  const mauCic = (d: number) =>
    d >= 670 ? "var(--ok)" : d >= 600 ? "var(--warn)" : "var(--danger)";

  return (
    <>
      <h1 className="page-title">Xin chào, {user?.hoTen}</h1>
      <p className="page-sub">Thông tin cá nhân và tình trạng tín dụng của bạn.</p>

      {kh && (
        <>
          <div className="row-2">
            <div className="card card-pad flex gap-16 items-center">
              <div
                className="cic-ring"
                style={
                  {
                    "--val": phanTramCic(kh.diemCIC),
                    "--col": mauCic(kh.diemCIC),
                  } as React.CSSProperties
                }
              >
                <div className="inner">
                  <div className="num">{kh.diemCIC}</div>
                  <div className="cap">điểm CIC</div>
                </div>
              </div>
              <div>
                <div className="muted" style={{ fontSize: 13, marginBottom: 6 }}>
                  Xếp loại tín dụng
                </div>
                <span className={`badge ${nhanNhomNo(kh.nhomNo!).cls}`}>
                  {kh.tenNhomNo}
                </span>
                <p
                  className="faint"
                  style={{ fontSize: 12.5, marginTop: 10, maxWidth: 240 }}
                >
                  Thanh toán đúng hạn để tăng điểm tín dụng và được hưởng ưu đãi
                  tốt hơn.
                </p>
              </div>
            </div>

            <div className="card card-pad">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>
                Thông tin định danh
              </h3>
              <div className="kv">
                <span className="k">Họ tên</span>
                <span className="v">{kh.hoTen}</span>
              </div>
              <div className="kv">
                <span className="k">Email</span>
                <span className="v">{kh.email}</span>
              </div>
              <div className="kv">
                <span className="k">Số điện thoại</span>
                <span className="v">{kh.sdt}</span>
              </div>
              <div className="kv">
                <span className="k">CCCD</span>
                <span className="v">{kh.cccd}</span>
              </div>
              <div className="kv">
                <span className="k">Địa chỉ</span>
                <span className="v">{kh.diaChi}</span>
              </div>
            </div>
          </div>

          <div className="card card-pad" style={{ marginTop: 16 }}>
            <div className="section-head">
              <h3 style={{ fontSize: 16 }}>Khoản vay gần đây</h3>
              <Link href="/portal/khoan-vay" style={{ fontSize: 13 }}>
                Xem tất cả →
              </Link>
            </div>
            <table className="tbl">
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Hạn mức</th>
                  <th>Dư nợ</th>
                  <th>Trạng thái</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {hopDongs.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty">Bạn chưa có khoản vay nào.</div>
                    </td>
                  </tr>
                ) : (
                  hopDongs.slice(0, 5).map((h) => (
                    <tr key={h.id}>
                      <td>#{h.id}</td>
                      <td className="mono-num">{tien(h.hanMuc)}</td>
                      <td className="mono-num">{tien(h.duNoConLai)}</td>
                      <td>
                        <span
                          className={`badge ${nhanTrangThai(h.trangThai).cls}`}
                        >
                          {nhanTrangThai(h.trangThai).text}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/portal/khoan-vay/${h.id}`}
                          style={{ fontSize: 13 }}
                        >
                          Xem →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="card card-pad" style={{ marginTop: 16 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Lịch sử điểm CIC</h3>
            {lichSu.length === 0 ? (
              <div className="empty">Chưa có biến động.</div>
            ) : (
              lichSu.map((l) => (
                <div className="kv" key={l.id}>
                  <span className="k">
                    {l.lyDo}
                    <br />
                    <span className="faint" style={{ fontSize: 12 }}>
                      {ngayGio(l.thoiGian)}
                    </span>
                  </span>
                  <span
                    className="v"
                    style={{
                      color:
                        l.diemMoi >= l.diemCu ? "var(--ok)" : "var(--danger)",
                    }}
                  >
                    {l.diemCu} → {l.diemMoi}
                  </span>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </>
  );
}
