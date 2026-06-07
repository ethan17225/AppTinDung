"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { nhanNhomNo } from "@/lib/format";
import type { KhachHang } from "@/lib/types";

export default function CustomersPage() {
  const router = useRouter();
  const [ds, setDs] = useState<KhachHang[]>([]);
  const [tuKhoa, setTuKhoa] = useState("");

  useEffect(() => {
    api.dsKhachHang().then(setDs).catch(() => {});
  }, []);

  const locDanhSach = useMemo(() => {
    const t = tuKhoa.trim().toLowerCase();
    if (!t) return ds;
    return ds.filter(
      (k) =>
        k.hoTen.toLowerCase().includes(t) ||
        k.sdt.includes(t) ||
        k.cccd.includes(t) ||
        k.email.toLowerCase().includes(t)
    );
  }, [ds, tuKhoa]);

  return (
    <>
      <h1 className="page-title">Khách hàng</h1>
      <p className="page-sub">
        Quản lý thông tin định danh (KYC) và điểm tín dụng CIC.
      </p>

      <div className="card">
        <div className="card-pad" style={{ paddingBottom: 14 }}>
          <input
            className="input"
            style={{ maxWidth: 320 }}
            placeholder="Tìm theo tên, SĐT, CCCD..."
            value={tuKhoa}
            onChange={(e) => setTuKhoa(e.target.value)}
          />
        </div>
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>SĐT</th>
                <th>CCCD</th>
                <th>Điểm CIC</th>
                <th>Nhóm nợ</th>
                <th>Số HĐ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {locDanhSach.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="empty">Chưa có khách hàng nào.</div>
                  </td>
                </tr>
              ) : (
                locDanhSach.map((k) => (
                  <tr
                    key={k.id}
                    className="clickable"
                    onClick={() => router.push(`/quan-tri/khach-hang/${k.id}`)}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{k.hoTen}</div>
                      <div className="faint" style={{ fontSize: 12.5 }}>
                        {k.email}
                      </div>
                    </td>
                    <td>{k.sdt}</td>
                    <td>{k.cccd}</td>
                    <td className="mono-num" style={{ fontWeight: 600 }}>
                      {k.diemCIC}
                    </td>
                    <td>
                      <span className={`badge ${nhanNhomNo(k.nhomNo!).cls}`}>
                        Nhóm {k.nhomNo}
                      </span>
                    </td>
                    <td>{k.soHopDong}</td>
                    <td>
                      <Link
                        href={`/quan-tri/khach-hang/${k.id}`}
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
      </div>
    </>
  );
}
