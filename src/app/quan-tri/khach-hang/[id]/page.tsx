"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { tien, ngayGio, nhanNhomNo, nhanTrangThai } from "@/lib/format";
import type { KhachHang, LichSuCIC, HopDong } from "@/lib/types";

export default function CustomerDetailPage() {
  const router = useRouter();
  const id = Number(useParams().id);

  const [kh, setKh] = useState<KhachHang | null>(null);
  const [lichSu, setLichSu] = useState<LichSuCIC[]>([]);
  const [hopDongs, setHopDongs] = useState<HopDong[]>([]);
  const [moTaoVay, setMoTaoVay] = useState(false);
  const [luuing, setLuuing] = useState(false);
  const [thongBao, setThongBao] = useState("");

  const [form, setForm] = useState({
    hoTen: "",
    email: "",
    sdt: "",
    diaChi: "",
    cccd: "",
  });
  const [vay, setVay] = useState({
    hanMuc: 10000000,
    kyHanThang: 12,
    laiSuat: 12,
    mucDich: "",
  });

  const taiDuLieu = useCallback(() => {
    api.chiTietKhachHang(id).then((k) => {
      setKh(k);
      setForm({
        hoTen: k.hoTen,
        email: k.email,
        sdt: k.sdt,
        diaChi: k.diaChi,
        cccd: k.cccd,
      });
    });
    api.lichSuCic(id).then(setLichSu).catch(() => {});
    api
      .dsHopDong()
      .then((d) => setHopDongs(d.filter((h) => h.khachHangId === id)))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    taiDuLieu();
  }, [taiDuLieu]);

  const phanTramCic = (d: number) => Math.round(((d - 300) / 400) * 100);
  const mauCic = (d: number) =>
    d >= 670 ? "var(--ok)" : d >= 600 ? "var(--warn)" : "var(--danger)";

  async function luuKyc() {
    await api.capNhatKhachHang(id, form);
    setThongBao("Đã cập nhật thông tin khách hàng");
    taiDuLieu();
  }

  async function taoVay() {
    setLuuing(true);
    try {
      await api.taoHopDong({ khachHangId: id, ...vay });
      setMoTaoVay(false);
      setThongBao("Đã tạo hồ sơ vay (chờ duyệt)");
      taiDuLieu();
    } finally {
      setLuuing(false);
    }
  }

  if (!kh) {
    return (
      <span className="link-back" onClick={() => router.push("/quan-tri/khach-hang")}>
        ← Danh sách khách hàng
      </span>
    );
  }

  return (
    <>
      <span
        className="link-back"
        onClick={() => router.push("/quan-tri/khach-hang")}
      >
        ← Danh sách khách hàng
      </span>

      <div className="section-head">
        <div>
          <h1 className="page-title">{kh.hoTen}</h1>
          <p className="muted" style={{ margin: 0 }}>
            {kh.email} · {kh.sdt}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setMoTaoVay(!moTaoVay)}>
          ＋ Tạo hồ sơ vay
        </button>
      </div>

      {thongBao && <div className="alert alert-ok">{thongBao}</div>}

      {moTaoVay && (
        <div className="card card-pad" style={{ marginBottom: 18 }}>
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>Tạo hồ sơ vay mới</h3>
          <div className="flex gap-12 wrap">
            <div className="field grow">
              <label>Hạn mức (đ)</label>
              <input
                className="input"
                type="number"
                value={vay.hanMuc}
                onChange={(e) =>
                  setVay({ ...vay, hanMuc: Number(e.target.value) })
                }
              />
            </div>
            <div className="field grow">
              <label>Kỳ hạn (tháng)</label>
              <input
                className="input"
                type="number"
                value={vay.kyHanThang}
                onChange={(e) =>
                  setVay({ ...vay, kyHanThang: Number(e.target.value) })
                }
              />
            </div>
            <div className="field grow">
              <label>Lãi suất (%/năm)</label>
              <input
                className="input"
                type="number"
                value={vay.laiSuat}
                onChange={(e) =>
                  setVay({ ...vay, laiSuat: Number(e.target.value) })
                }
              />
            </div>
          </div>
          <div className="field">
            <label>Mục đích vay</label>
            <input
              className="input"
              value={vay.mucDich}
              onChange={(e) => setVay({ ...vay, mucDich: e.target.value })}
            />
          </div>
          <button className="btn btn-primary" onClick={taoVay} disabled={luuing}>
            Lưu hồ sơ
          </button>
        </div>
      )}

      <div className="row-2">
        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 14 }}>
            Thông tin định danh (KYC)
          </h3>
          <div className="field">
            <label>Họ tên</label>
            <input
              className="input"
              value={form.hoTen}
              onChange={(e) => setForm({ ...form, hoTen: e.target.value })}
            />
          </div>
          <div className="flex gap-12">
            <div className="field grow">
              <label>SĐT</label>
              <input
                className="input"
                value={form.sdt}
                onChange={(e) => setForm({ ...form, sdt: e.target.value })}
              />
            </div>
            <div className="field grow">
              <label>CCCD</label>
              <input
                className="input"
                value={form.cccd}
                onChange={(e) => setForm({ ...form, cccd: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Email</label>
            <input
              className="input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="field">
            <label>Địa chỉ</label>
            <input
              className="input"
              value={form.diaChi}
              onChange={(e) => setForm({ ...form, diaChi: e.target.value })}
            />
          </div>
          <button className="btn btn-ghost" onClick={luuKyc}>
            Lưu thông tin
          </button>
        </div>

        <div>
          <div
            className="card card-pad flex gap-16 items-center"
            style={{ marginBottom: 16 }}
          >
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
                Phân loại
              </div>
              <span className={`badge ${nhanNhomNo(kh.nhomNo!).cls}`}>
                {kh.tenNhomNo}
              </span>
            </div>
          </div>

          <div className="card card-pad">
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
        </div>
      </div>

      <div className="card card-pad" style={{ marginTop: 16 }}>
        <h3 style={{ fontSize: 16, marginBottom: 12 }}>
          Hồ sơ vay của khách hàng
        </h3>
        <table className="tbl">
          <thead>
            <tr>
              <th>Mã HĐ</th>
              <th>Hạn mức</th>
              <th>Kỳ hạn</th>
              <th>Dư nợ</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {hopDongs.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="empty">Chưa có hồ sơ vay.</div>
                </td>
              </tr>
            ) : (
              hopDongs.map((h) => (
                <tr key={h.id}>
                  <td>#{h.id}</td>
                  <td className="mono-num">{tien(h.hanMuc)}</td>
                  <td>{h.kyHanThang} tháng</td>
                  <td className="mono-num">{tien(h.duNoConLai)}</td>
                  <td>
                    <span className={`badge ${nhanTrangThai(h.trangThai).cls}`}>
                      {nhanTrangThai(h.trangThai).text}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/quan-tri/ho-so-vay/${h.id}`}
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
    </>
  );
}
