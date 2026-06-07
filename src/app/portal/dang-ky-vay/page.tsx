"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiClientError } from "@/lib/api-client";
import { tien } from "@/lib/format";

export default function ApplyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ hanMuc: 10000000, kyHanThang: 12, mucDich: "" });
  const [dangGui, setDangGui] = useState(false);
  const [thanhCong, setThanhCong] = useState("");
  const [loi, setLoi] = useState("");

  const gocMoiKy =
    form.kyHanThang > 0 ? Math.round(form.hanMuc / form.kyHanThang) : 0;
  const laiKyDau = Math.round(form.hanMuc * (12 / 100 / 12));

  async function guiYeuCau() {
    setLoi("");
    setThanhCong("");
    setDangGui(true);
    try {
      const kq = await api.dangKyVay(form);
      setThanhCong(kq.thongBao);
      setTimeout(() => router.push("/portal/khoan-vay"), 1400);
    } catch (err) {
      setLoi(
        err instanceof ApiClientError ? err.thongBao : "Gửi yêu cầu thất bại"
      );
      setDangGui(false);
    }
  }

  return (
    <>
      <h1 className="page-title">Đăng ký vay mới</h1>
      <p className="page-sub">
        Điền thông tin khoản vay mong muốn. Hồ sơ sẽ được nhân viên tín dụng xét
        duyệt.
      </p>

      {thanhCong && <div className="alert alert-ok">{thanhCong}</div>}
      {loi && <div className="alert alert-error">{loi}</div>}

      <div className="row-2">
        <div className="card card-pad">
          <div className="field">
            <label>Số tiền muốn vay (đ)</label>
            <input
              className="input"
              type="number"
              value={form.hanMuc}
              onChange={(e) =>
                setForm({ ...form, hanMuc: Number(e.target.value) })
              }
            />
          </div>
          <div className="field">
            <label>Kỳ hạn (tháng)</label>
            <select
              className="select"
              value={form.kyHanThang}
              onChange={(e) =>
                setForm({ ...form, kyHanThang: Number(e.target.value) })
              }
            >
              <option value={6}>6 tháng</option>
              <option value={12}>12 tháng</option>
              <option value={18}>18 tháng</option>
              <option value={24}>24 tháng</option>
              <option value={36}>36 tháng</option>
            </select>
          </div>
          <div className="field">
            <label>Mục đích vay</label>
            <textarea
              className="input"
              rows={3}
              value={form.mucDich}
              onChange={(e) => setForm({ ...form, mucDich: e.target.value })}
              placeholder="Ví dụ: mua sắm, kinh doanh, tiêu dùng..."
            />
          </div>
          <button
            className="btn btn-primary btn-block"
            onClick={guiYeuCau}
            disabled={dangGui}
          >
            {dangGui ? "Đang gửi..." : "Gửi yêu cầu vay"}
          </button>
        </div>

        <div className="card card-pad">
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Ước tính khoản vay</h3>
          <p className="muted" style={{ fontSize: 13.5 }}>
            Lãi suất tham khảo: <b>12%/năm</b> (dư nợ giảm dần). Lãi suất chính
            thức sẽ do nhân viên xác định khi duyệt.
          </p>
          <div className="kv">
            <span className="k">Số tiền vay</span>
            <span className="v mono-num">{tien(form.hanMuc)}</span>
          </div>
          <div className="kv">
            <span className="k">Kỳ hạn</span>
            <span className="v">{form.kyHanThang} tháng</span>
          </div>
          <div className="kv">
            <span className="k">Gốc trả mỗi kỳ</span>
            <span className="v mono-num">{tien(gocMoiKy)}</span>
          </div>
          <div className="kv">
            <span className="k">Lãi kỳ đầu (ước tính)</span>
            <span className="v mono-num">{tien(laiKyDau)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
