// Panel thương hiệu + thông tin nhóm (dùng chung cho các trang đăng nhập)
export default function BrandPanel() {
  return (
    <>
      <div className="auth-mobilebar">
        <span className="brand-logo">
          <span className="dot">T</span> App Tín Dụng
        </span>
      </div>

      <div className="auth-brand">
        <div className="brand-top">
          <span className="brand-logo">
            <span className="dot">T</span> App Tín Dụng
          </span>
        </div>

        <div className="brand-mid">
          <h1 className="brand-headline">
            <span className="brand-headline-line">Quản lý tín dụng,</span>
            <span className="brand-headline-accent">cho vay & thu hồi nợ</span>
          </h1>
          <p className="brand-desc">
            Nền tảng Core-Credit giúp số hóa quy trình cho vay: từ định danh
            khách hàng (KYC), khởi tạo hợp đồng, theo dõi điểm tín dụng CIC đến
            thu hồi nợ.
          </p>
          <ul className="brand-feats">
            <li>
              <span className="tick">✓</span> Quản lý hồ sơ vay & quy trình xét
              duyệt
            </li>
            <li>
              <span className="tick">✓</span> Theo dõi điểm CIC và phân loại nhóm
              nợ
            </li>
            <li>
              <span className="tick">✓</span> Thanh toán trực tuyến & biên lai
              điện tử
            </li>
          </ul>
        </div>

        <div className="brand-bottom team">
          <div className="team-title">Thành viên thực hiện</div>
          <div className="team-grid">
            <div>
              <div className="name">Nguyễn Phú Thái</div>
              <div className="role">Database</div>
            </div>
            <div>
              <div className="name">Dương Đức Pháp</div>
              <div className="role">Backend</div>
            </div>
            <div>
              <div className="name">Trần Nhật Anh</div>
              <div className="role">Frontend</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
