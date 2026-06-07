"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { ngayGio } from "@/lib/format";
import { useAuth } from "@/lib/auth-context";
import type { AuditLog } from "@/lib/types";

export default function AuditLogPage() {
  const router = useRouter();
  const { dangTai, laAdmin } = useAuth();
  const [ds, setDs] = useState<AuditLog[]>([]);

  useEffect(() => {
    if (!dangTai && !laAdmin) router.replace("/quan-tri");
  }, [dangTai, laAdmin, router]);

  useEffect(() => {
    if (laAdmin) api.auditLog().then(setDs).catch(() => {});
  }, [laAdmin]);

  if (dangTai || !laAdmin) return null;

  return (
    <>
      <h1 className="page-title">Nhật ký hệ thống</h1>
      <p className="page-sub">
        Lưu vết các thao tác để phục vụ kiểm toán (Audit Log).
      </p>

      <div className="card table-wrap">
        <table className="tbl">
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Người thực hiện</th>
              <th>Hành động</th>
              <th>Đối tượng</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            {ds.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="empty">Chưa có nhật ký.</div>
                </td>
              </tr>
            ) : (
              ds.map((a) => (
                <tr key={a.id}>
                  <td className="faint" style={{ whiteSpace: "nowrap" }}>
                    {ngayGio(a.thoiGian)}
                  </td>
                  <td style={{ fontWeight: 600 }}>{a.nguoiThucHien}</td>
                  <td>{a.hanhDong}</td>
                  <td>{a.doiTuong}</td>
                  <td className="muted">{a.chiTiet}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
