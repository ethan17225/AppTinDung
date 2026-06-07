"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { tien, ngay, nhanTrangThai } from "@/lib/format";
import type { HopDong } from "@/lib/types";

export default function MyLoansPage() {
  const router = useRouter();
  const [ds, setDs] = useState<HopDong[]>([]);

  useEffect(() => {
    api.dsHopDong().then(setDs).catch(() => {});
  }, []);

  return (
    <>
      <div className="section-head">
        <div>
          <h1 className="page-title">Khoản vay của tôi</h1>
          <p className="muted" style={{ margin: 0 }}>
            Theo dõi dư nợ, lãi suất và lịch thanh toán.
          </p>
        </div>
        <Link className="btn btn-primary" href="/portal/dang-ky-vay">
          ＋ Đăng ký vay mới
        </Link>
      </div>

      <div className="card table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Hạn mức</th>
              <th>Kỳ hạn</th>
              <th>Lãi suất</th>
              <th>Dư nợ</th>
              <th>Ngày tạo</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className="empty">Bạn chưa có khoản vay nào.</div>
                </td>
              </tr>
            ) : (
              ds.map((h) => (
                <tr
                  key={h.id}
                  className="clickable"
                  onClick={() => router.push(`/portal/khoan-vay/${h.id}`)}
                >
                  <td>#{h.id}</td>
                  <td className="mono-num">{tien(h.hanMuc)}</td>
                  <td>{h.kyHanThang} tháng</td>
                  <td>{h.laiSuat}%</td>
                  <td className="mono-num">{tien(h.duNoConLai)}</td>
                  <td>{ngay(h.ngayTao)}</td>
                  <td>
                    <span className={`badge ${nhanTrangThai(h.trangThai).cls}`}>
                      {nhanTrangThai(h.trangThai).text}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/portal/khoan-vay/${h.id}`}
                      style={{ fontSize: 13 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      Chi tiết →
                    </Link>
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
