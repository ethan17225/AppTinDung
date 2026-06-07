import { Component } from '@angular/core';

// Panel thuong hieu + thong tin nhom (dung chung cho cac trang dang nhap)
@Component({
  selector: 'app-brand-panel',
  standalone: true,
  template: `
    <div class="auth-mobilebar">
      <span class="brand-logo"><span class="dot">T</span> App Tín Dụng</span>
    </div>

    <div class="auth-brand">
      <div class="brand-top">
        <span class="brand-logo"><span class="dot">T</span> App Tín Dụng</span>
      </div>

      <div class="brand-mid">
        <h1 class="brand-headline">Quản lý tín dụng,<br>cho vay & thu hồi nợ</h1>
        <p class="brand-desc">
          Nền tảng Core-Credit giúp số hóa quy trình cho vay: từ định danh khách hàng (KYC),
          khởi tạo hợp đồng, theo dõi điểm tín dụng CIC đến thu hồi nợ.
        </p>
        <ul class="brand-feats">
          <li><span class="tick">✓</span> Quản lý hồ sơ vay & quy trình xét duyệt</li>
          <li><span class="tick">✓</span> Theo dõi điểm CIC và phân loại nhóm nợ</li>
          <li><span class="tick">✓</span> Thanh toán trực tuyến & biên lai điện tử</li>
        </ul>
      </div>

      <div class="brand-bottom team">
        <div class="team-title">Thành viên thực hiện</div>
        <div class="team-grid">
          <div>
            <div class="name">Nguyễn Phú Thái</div>
            <div class="role">Database</div>
          </div>
          <div>
            <div class="name">Dương Đức Pháp</div>
            <div class="role">Backend</div>
          </div>
          <div>
            <div class="name">Trần Nhật Anh</div>
            <div class="role">Frontend</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './auth.scss'
})
export class BrandPanelComponent {}
