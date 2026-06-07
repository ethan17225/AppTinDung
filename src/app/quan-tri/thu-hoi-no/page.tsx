"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api-client";
import { tien, ngay, nhanNhomNo } from "@/lib/format";
import type { CanhBaoNo, NhomNoThongKe } from "@/lib/types";

export default function CollectionsPage() {
  const [canhBao, setCanhBao] = useState<CanhBaoNo[]>([]);
  const [nhomNo, setNhomNo] = useState<NhomNoThongKe[]>([]);
  const [dangChay, setDangChay] = useState(false);
  const [ketQuaBatch, setKetQuaBatch] = useState("");

  const tai = useCallback(() => {
    api.canhBaoNo().then(setCanhBao).catch(() => {});
    api.phanLoaiNhomNo().then(setNhomNo).catch(() => {});
  }, []);

  useEffect(() => {
    tai();
  }, [tai]);

  async function chayBatch() {
    setDangChay(true);
    try {
      const kq = await api.chayBatch();
      setKetQuaBatch(
        `${kq.thongBao}: quét ${kq.soKyQuaHan} kỳ quá hạn, trừ điểm ${kq.soLanTruDiem} lần.`
      );
      tai();
    } finally {
      setDangChay(false);
    }
  }

  return (
    <>
      <div className="section-head">
        <div>
          <h1 className="page-title">Thu hồi nợ</h1>
          <p className="muted" style={{ margin: 0 }}>
            Cảnh báo nợ đến hạn, phân loại nhóm nợ và cập nhật điểm CIC.
          </p>
        </div>
        <button className="btn btn-primary" onClick={chayBatch} disabled={dangChay}>
          {dangChay ? "Đang chạy..." : "▶ Chạy batch cập nhật nợ"}
        </button>
      </div>

      {ketQuaBatch && <div className="alert alert-info">{ketQuaBatch}</div>}

      <div className="stat-grid" style={{ marginBottom: 22 }}>
        {nhomNo.map((n) => (
          <div className="stat" key={n.nhom}>
            <div className="label">{nhanNhomNo(n.nhom).text}</div>
            <div className="value">{n.soLuong}</div>
            <div className="foot">khách hàng</div>
          </div>
        ))}
      </div>

      <div className="card card-pad">
        <h3 style={{ fontSize: 16, marginBottom: 14 }}>
          Khoản nợ sắp đến hạn / quá hạn
        </h3>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Khách hàng</th>
                <th>Hồ sơ</th>
                <th>Kỳ</th>
                <th>Đến hạn</th>
                <th>Số tiền</th>
                <th>Số ngày trễ</th>
                <th>Điểm CIC</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {canhBao.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty">Không có khoản nợ cần cảnh báo.</div>
                  </td>
                </tr>
              ) : (
                canhBao.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>{c.tenKhachHang}</td>
                    <td>
                      <Link href={`/quan-tri/ho-so-vay/${c.hopDongId}`}>
                        #{c.hopDongId}
                      </Link>
                    </td>
                    <td>Kỳ {c.kyThu}</td>
                    <td>{ngay(c.ngayDenHan)}</td>
                    <td className="mono-num">{tien(c.soTien)}</td>
                    <td className="mono-num">{c.soNgayTre}</td>
                    <td className="mono-num">{c.diemCIC}</td>
                    <td>
                      {c.quaHan ? (
                        <span className="badge badge-danger">Quá hạn</span>
                      ) : (
                        <span className="badge badge-warn">Sắp đến hạn</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
