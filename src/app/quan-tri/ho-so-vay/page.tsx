"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { tien, ngay, nhanTrangThai } from "@/lib/format";
import type { HopDong } from "@/lib/types";

const boLoc = [
  { value: "all", label: "Tất cả" },
  { value: "ChoDuyet", label: "Chờ duyệt" },
  { value: "DangVay", label: "Đang vay" },
  { value: "DaGiaiNgan", label: "Đã giải ngân" },
  { value: "TatToan", label: "Tất toán" },
  { value: "TuChoi", label: "Từ chối" },
];

export default function LoansPage() {
  const router = useRouter();
  const [ds, setDs] = useState<HopDong[]>([]);
  const [locHienTai, setLocHienTai] = useState("all");

  useEffect(() => {
    api.dsHopDong().then(setDs).catch(() => {});
  }, []);

  const locDanhSach =
    locHienTai === "all" ? ds : ds.filter((h) => h.trangThai === locHienTai);

  return (
    <>
      <h1 className="page-title">Hồ sơ vay</h1>
      <p className="page-sub">
        Khởi tạo, xét duyệt và theo dõi quy trình hồ sơ vay.
      </p>

      <div className="flex gap-8 wrap" style={{ marginBottom: 16 }}>
        {boLoc.map((f) => (
          <button
            key={f.value}
            className={`btn btn-sm ${
              locHienTai === f.value ? "btn-primary" : "btn-ghost"
            }`}
            onClick={() => setLocHienTai(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="card table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Khách hàng</th>
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
            {locDanhSach.length === 0 ? (
              <tr>
                <td colSpan={9}>
                  <div className="empty">Không có hồ sơ nào.</div>
                </td>
              </tr>
            ) : (
              locDanhSach.map((h) => (
                <tr
                  key={h.id}
                  className="clickable"
                  onClick={() => router.push(`/quan-tri/ho-so-vay/${h.id}`)}
                >
                  <td>#{h.id}</td>
                  <td style={{ fontWeight: 600 }}>{h.tenKhachHang}</td>
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
                      href={`/quan-tri/ho-so-vay/${h.id}`}
                      style={{ fontSize: 13 }}
                      onClick={(e) => e.stopPropagation()}
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
    </>
  );
}
