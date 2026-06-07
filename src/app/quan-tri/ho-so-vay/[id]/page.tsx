"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { tien, ngay, ngayGio, nhanTrangThai } from "@/lib/format";
import type { HopDongChiTiet } from "@/lib/types";

const cacBuoc = [
  { key: "ChoDuyet", label: "Chờ duyệt" },
  { key: "DaGiaiNgan", label: "Đã giải ngân" },
  { key: "DangVay", label: "Đang vay" },
  { key: "TatToan", label: "Tất toán" },
];

export default function AdminLoanDetailPage() {
  const router = useRouter();
  const id = Number(useParams().id);
  const [hd, setHd] = useState<HopDongChiTiet | null>(null);
  const [thongBao, setThongBao] = useState("");

  const tai = useCallback(() => {
    api.chiTietHopDong(id).then(setHd).catch(() => {});
  }, [id]);

  useEffect(() => {
    tai();
  }, [tai]);

  const trangThaiBuoc = (key: string): boolean => {
    const tt = hd?.trangThai;
    const thuTu: Record<string, number> = {
      ChoDuyet: 0,
      DaGiaiNgan: 1,
      DangVay: 2,
      TatToan: 3,
    };
    if (!tt || tt === "TuChoi") return false;
    return thuTu[tt] >= thuTu[key];
  };

  async function duyet() {
    await api.duyetHopDong(id);
    setThongBao("Đã duyệt và giải ngân hồ sơ");
    tai();
  }
  async function tuChoi() {
    await api.tuChoiHopDong(id);
    setThongBao("Đã từ chối hồ sơ");
    tai();
  }
  async function thuNo(lichTraId: number) {
    await api.thanhToan(lichTraId);
    setThongBao("Đã ghi nhận khoản thu");
    tai();
  }

  return (
    <>
      <span
        className="link-back"
        onClick={() => router.push("/quan-tri/ho-so-vay")}
      >
        ← Danh sách hồ sơ vay
      </span>

      {hd && (
        <>
          <div className="section-head">
            <div>
              <h1 className="page-title">Hồ sơ vay #{hd.id}</h1>
              <p className="muted" style={{ margin: 0 }}>
                Khách hàng: <b>{hd.tenKhachHang}</b>
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

          <div className="card card-pad" style={{ marginBottom: 16 }}>
            <div className="flex between items-center wrap gap-12">
              <div className="flex gap-8 items-center wrap">
                {cacBuoc.map((b, i) => (
                  <div className="flex items-center gap-8" key={b.key}>
                    <span
                      className={`badge ${
                        trangThaiBuoc(b.key) ? "badge-ok" : "badge-neutral"
                      }`}
                    >
                      {trangThaiBuoc(b.key) ? "✓" : i + 1} {b.label}
                    </span>
                    {i < cacBuoc.length - 1 && <span className="faint">→</span>}
                  </div>
                ))}
              </div>
              {hd.trangThai === "ChoDuyet" && (
                <div className="flex gap-8">
                  <button className="btn btn-ok btn-sm" onClick={duyet}>
                    Duyệt & giải ngân
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={tuChoi}>
                    Từ chối
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="row-2">
            <div className="card card-pad">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>
                Thông tin hợp đồng
              </h3>
              <div className="kv">
                <span className="k">Hạn mức giải ngân</span>
                <span className="v mono-num">{tien(hd.hanMuc)}</span>
              </div>
              <div className="kv">
                <span className="k">Kỳ hạn</span>
                <span className="v">{hd.kyHanThang} tháng</span>
              </div>
              <div className="kv">
                <span className="k">Lãi suất</span>
                <span className="v">{hd.laiSuat}% / năm</span>
              </div>
              <div className="kv">
                <span className="k">Mục đích</span>
                <span className="v">{hd.mucDich || "—"}</span>
              </div>
              <div className="kv">
                <span className="k">Dư nợ còn lại</span>
                <span className="v mono-num">{tien(hd.duNoConLai)}</span>
              </div>
              <div className="kv">
                <span className="k">Ngày tạo</span>
                <span className="v">{ngay(hd.ngayTao)}</span>
              </div>
              <div className="kv">
                <span className="k">Ngày giải ngân</span>
                <span className="v">
                  {hd.ngayGiaiNgan ? ngay(hd.ngayGiaiNgan) : "—"}
                </span>
              </div>
            </div>

            <div className="card card-pad">
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>
                Dòng tiền giao dịch
              </h3>
              {hd.giaoDich.length === 0 && (
                <div className="empty">Chưa có giao dịch.</div>
              )}
              {hd.giaoDich.map((g) => (
                <div className="kv" key={g.id}>
                  <span className="k">
                    {g.loaiGiaoDich === "GiaiNgan" ? "Giải ngân" : "Thu nợ"}
                    <br />
                    <span className="faint" style={{ fontSize: 12 }}>
                      {ngayGio(g.thoiGian)}
                    </span>
                  </span>
                  <span
                    className="v mono-num"
                    style={{
                      color:
                        g.loaiGiaoDich === "GiaiNgan"
                          ? "var(--danger)"
                          : "var(--ok)",
                    }}
                  >
                    {g.loaiGiaoDich === "GiaiNgan" ? "−" : "+"}
                    {tien(g.soTien)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {hd.lichTra.length > 0 && (
            <div className="card card-pad" style={{ marginTop: 16 }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>Lịch trả nợ</h3>
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
                            <span className="badge badge-ok">Đã thu</span>
                          ) : (
                            <span className="badge badge-neutral">Chưa thu</span>
                          )}
                        </td>
                        <td>
                          {!l.daThanhToan &&
                            hd.trangThai !== "ChoDuyet" &&
                            hd.trangThai !== "TuChoi" && (
                              <button
                                className="btn btn-ok btn-sm"
                                onClick={() => thuNo(l.id)}
                              >
                                Ghi nhận thu
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
    </>
  );
}
