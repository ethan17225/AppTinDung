"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, type BienLai } from "@/lib/api-client";
import { tien, ngay, ngayGio, nhanTrangThai } from "@/lib/format";
import type { HopDongChiTiet } from "@/lib/types";

export default function CustomerLoanDetailPage() {
  const router = useRouter();
  const id = Number(useParams().id);
  const [hd, setHd] = useState<HopDongChiTiet | null>(null);
  const [bienLai, setBienLai] = useState<BienLai | null>(null);
  const [thongBao, setThongBao] = useState("");
  const [dangTra, setDangTra] = useState(false);

  const tai = useCallback(() => {
    api.chiTietHopDong(id).then(setHd).catch(() => {});
  }, [id]);

  useEffect(() => {
    tai();
  }, [tai]);

  async function thanhToan(lichTraId: number) {
    setDangTra(true);
    try {
      const kq = await api.thanhToan(lichTraId);
      setBienLai(kq.bienLai);
      setThongBao("Thanh toán thành công!");
      tai();
    } finally {
      setDangTra(false);
    }
  }

  return (
    <>
      <span
        className="link-back"
        onClick={() => router.push("/portal/khoan-vay")}
      >
        ← Khoản vay của tôi
      </span>

      {hd && (
        <>
          <div className="section-head">
            <div>
              <h1 className="page-title">Khoản vay #{hd.id}</h1>
              <p className="muted" style={{ margin: 0 }}>
                {hd.mucDich || "Khoản vay tín dụng"}
              </p>
            </div>
            <span
              className={`badge ${nhanTrangThai(hd.trangThai).cls}`}
              style={{ fontSize: 13, padding: "6px 14px" }}
            >
              {nhanTrangThai(hd.trangThai).text}
            </span>
          </div>

          {thongBao && <div className="alert alert-ok">{thongBao}</div>}

          <div className="stat-grid" style={{ marginBottom: 18 }}>
            <div className="stat">
              <div className="label">Hạn mức</div>
              <div className="value sm mono-num">{tien(hd.hanMuc)}</div>
            </div>
            <div className="stat">
              <div className="label">Dư nợ còn lại</div>
              <div className="value sm mono-num">{tien(hd.duNoConLai)}</div>
            </div>
            <div className="stat">
              <div className="label">Lãi suất</div>
              <div className="value">{hd.laiSuat}%</div>
              <div className="foot">mỗi năm</div>
            </div>
            <div className="stat">
              <div className="label">Kỳ hạn</div>
              <div className="value">{hd.kyHanThang}</div>
              <div className="foot">tháng</div>
            </div>
          </div>

          {hd.trangThai === "ChoDuyet" && (
            <div className="alert alert-info">
              Hồ sơ của bạn đang chờ nhân viên tín dụng xét duyệt.
            </div>
          )}

          {hd.lichTra.length > 0 && (
            <div className="card card-pad">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Lịch thanh toán</h3>
              <div className="table-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Kỳ</th>
                      <th>Đến hạn</th>
                      <th>Gốc</th>
                      <th>Lãi</th>
                      <th>Tổng kỳ</th>
                      <th>Trạng thái</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {hd.lichTra.map((l) => (
                      <tr key={l.id}>
                        <td>Kỳ {l.kyThu}</td>
                        <td>{ngay(l.ngayDenHan)}</td>
                        <td className="mono-num">{tien(l.soTienGoc)}</td>
                        <td className="mono-num">{tien(l.soTienLai)}</td>
                        <td className="mono-num" style={{ fontWeight: 600 }}>
                          {tien(l.tongKy)}
                        </td>
                        <td>
                          {l.daThanhToan ? (
                            <span className="badge badge-ok">Đã thanh toán</span>
                          ) : (
                            <span className="badge badge-neutral">
                              Chưa thanh toán
                            </span>
                          )}
                        </td>
                        <td>
                          {!l.daThanhToan && (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => thanhToan(l.id)}
                              disabled={dangTra}
                            >
                              Thanh toán
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {bienLai && (
        <div className="overlay" onClick={() => setBienLai(null)}>
          <div className="receipt" onClick={(e) => e.stopPropagation()}>
            <div className="receipt-head">
              <div className="brand-logo">
                <span className="dot">T</span> App Tín Dụng
              </div>
              <span className="badge badge-ok">Thành công</span>
            </div>
            <h3 style={{ textAlign: "center", margin: "8px 0 4px" }}>
              Biên lai điện tử
            </h3>
            <p
              className="faint"
              style={{ textAlign: "center", fontSize: 12.5, margin: "0 0 16px" }}
            >
              {bienLai.maGiaoDich}
            </p>
            <div className="kv">
              <span className="k">Khách hàng</span>
              <span className="v">{bienLai.tenKhachHang}</span>
            </div>
            <div className="kv">
              <span className="k">Hợp đồng</span>
              <span className="v">
                #{bienLai.hopDongId} · Kỳ {bienLai.kyThu}
              </span>
            </div>
            <div className="kv">
              <span className="k">Thời gian</span>
              <span className="v">{ngayGio(bienLai.thoiGian)}</span>
            </div>
            <div className="kv">
              <span className="k">Dư nợ còn lại</span>
              <span className="v mono-num">{tien(bienLai.duNoConLai)}</span>
            </div>
            <div className="kv" style={{ fontSize: 17 }}>
              <span className="k">Số tiền</span>
              <span className="v mono-num" style={{ color: "var(--brand)" }}>
                {tien(bienLai.soTien)}
              </span>
            </div>
            <button
              className="btn btn-primary btn-block"
              style={{ marginTop: 16 }}
              onClick={() => setBienLai(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}
