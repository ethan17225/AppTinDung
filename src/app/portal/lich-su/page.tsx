"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api-client";
import { tien, ngayGio } from "@/lib/format";
import type { GiaoDich } from "@/lib/types";

export default function HistoryPage() {
  const [ds, setDs] = useState<GiaoDich[]>([]);

  useEffect(() => {
    api.lichSuGiaoDich().then(setDs).catch(() => {});
  }, []);

  return (
    <>
      <h1 className="page-title">Lịch sử giao dịch</h1>
      <p className="page-sub">
        Toàn bộ biến động thanh toán và giải ngân của bạn.
      </p>

      <div className="card table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Hợp đồng</th>
              <th>Loại</th>
              <th>Nội dung</th>
              <th style={{ textAlign: "right" }}>Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty">Chưa có giao dịch nào.</div>
                </td>
              </tr>
            ) : (
              ds.map((g) => (
                <tr key={g.id}>
                  <td className="faint" style={{ whiteSpace: "nowrap" }}>
                    {ngayGio(g.thoiGian)}
                  </td>
                  <td>#{g.hopDongId}</td>
                  <td>
                    {g.loaiGiaoDich === "GiaiNgan" ? (
                      <span className="badge badge-info">Giải ngân</span>
                    ) : (
                      <span className="badge badge-ok">Thu nợ</span>
                    )}
                  </td>
                  <td className="muted">{g.ghiChu}</td>
                  <td
                    className="mono-num"
                    style={{
                      textAlign: "right",
                      fontWeight: 600,
                      color:
                        g.loaiGiaoDich === "GiaiNgan"
                          ? "var(--danger)"
                          : "var(--ok)",
                    }}
                  >
                    {g.loaiGiaoDich === "GiaiNgan" ? "−" : "+"}
                    {tien(g.soTien)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
