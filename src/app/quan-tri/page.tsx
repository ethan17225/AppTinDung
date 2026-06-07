"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { tien, nhanNhomNo } from "@/lib/format";
import type { TongQuan, NhomNoThongKe, CanhBaoNo } from "@/lib/types";

export default function DashboardPage() {
  const [tq, setTq] = useState<TongQuan | null>(null);
  const [nhomNo, setNhomNo] = useState<NhomNoThongKe[]>([]);
  const [canhBao, setCanhBao] = useState<CanhBaoNo[]>([]);

  useEffect(() => {
    api.tongQuan().then(setTq).catch(() => {});
    api.phanLoaiNhomNo().then(setNhomNo).catch(() => {});
    api.canhBaoNo().then(setCanhBao).catch(() => {});
  }, []);

  const tongNhom = nhomNo.reduce((s, n) => s + n.soLuong, 0);
  const tyLe = (soLuong: number) =>
    tongNhom > 0 ? Math.round((soLuong / tongNhom) * 100) : 0;
  const mauNhom = (nhom: number) =>
    nhom <= 2 ? "var(--ok)" : nhom <= 4 ? "var(--warn)" : "var(--danger)";

  return (
    <>
      <h1 className="page-title">Tổng quan</h1>
      <p className="page-sub">Bảng điều khiển hoạt động tín dụng của hệ thống.</p>

      {tq ? (
        <>
          <div className="stat-grid">
            <div className="stat">
              <div className="label">Tổng dư nợ</div>
              <div className="value sm mono-num">{tien(tq.tongDuNo)}</div>
              <div className="foot">{tq.soHopDongDangVay} hợp đồng đang vay</div>
            </div>
            <div className="stat">
              <div className="label">Tỷ lệ nợ xấu</div>
              <div
                className="value"
                style={{ color: tq.tyLeNoXau > 5 ? "var(--danger)" : "var(--ok)" }}
              >
                {tq.tyLeNoXau}%
              </div>
              <div className="foot">Nhóm 5 - nợ có khả năng mất vốn</div>
            </div>
            <div className="stat">
              <div className="label">Hợp đồng mới (tháng này)</div>
              <div className="value">{tq.soHopDongMoiThangNay}</div>
              <div className="foot">Tổng {tq.tongSoHopDong} hợp đồng</div>
            </div>
            <div className="stat">
              <div className="label">Khách hàng</div>
              <div className="value">{tq.soKhachHang}</div>
              <div className="foot">{tq.soHopDongChoDuyet} hồ sơ chờ duyệt</div>
            </div>
          </div>

          <div className="row-2" style={{ marginTop: 22 }}>
            <div className="card card-pad">
              <div className="section-head">
                <h3 style={{ fontSize: 17 }}>Phân loại nhóm nợ</h3>
              </div>
              {nhomNo.map((n) => (
                <div key={n.nhom} style={{ marginBottom: 14 }}>
                  <div
                    className="flex between"
                    style={{ fontSize: 13.5, marginBottom: 5 }}
                  >
                    <span>{nhanNhomNo(n.nhom).text}</span>
                    <span className="muted">{n.soLuong} KH</span>
                  </div>
                  <div className="bar">
                    <span
                      style={{
                        width: `${tyLe(n.soLuong)}%`,
                        background: mauNhom(n.nhom),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="card card-pad">
              <div className="section-head">
                <h3 style={{ fontSize: 17 }}>Cảnh báo thu hồi nợ</h3>
                <Link href="/quan-tri/thu-hoi-no" style={{ fontSize: 13 }}>
                  Xem tất cả →
                </Link>
              </div>
              {canhBao.length === 0 ? (
                <div className="empty">Không có khoản nợ nào sắp/quá hạn.</div>
              ) : (
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Khách hàng</th>
                      <th>Kỳ</th>
                      <th>Số tiền</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {canhBao.slice(0, 6).map((c) => (
                      <tr key={c.id}>
                        <td>{c.tenKhachHang}</td>
                        <td>Kỳ {c.kyThu}</td>
                        <td className="mono-num">{tien(c.soTien)}</td>
                        <td>
                          {c.quaHan ? (
                            <span className="badge badge-danger">
                              Quá hạn {c.soNgayTre} ngày
                            </span>
                          ) : (
                            <span className="badge badge-warn">Sắp đến hạn</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="empty">Đang tải dữ liệu...</div>
      )}
    </>
  );
}
