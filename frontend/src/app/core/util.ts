import { Pipe, PipeTransform } from '@angular/core';

// Dinh dang tien te VND: 1500000 -> "1.500.000 ?"
@Pipe({ name: 'tien', standalone: true })
export class TienPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value == null) return '0 \u0111';
    return value.toLocaleString('vi-VN') + ' \u0111';
  }
}

// Nhan & mau cho trang thai hop dong
export function nhanTrangThai(tt: string): { text: string; cls: string } {
  switch (tt) {
    case 'ChoDuyet': return { text: 'Ch\u1edd duy\u1ec7t', cls: 'badge-warn' };
    case 'DaGiaiNgan': return { text: '\u0110\u00e3 gi\u1ea3i ng\u00e2n', cls: 'badge-info' };
    case 'DangVay': return { text: '\u0110ang vay', cls: 'badge-info' };
    case 'TatToan': return { text: 'T\u1ea5t to\u00e1n', cls: 'badge-ok' };
    case 'TuChoi': return { text: 'T\u1eeb ch\u1ed1i', cls: 'badge-danger' };
    default: return { text: tt, cls: 'badge-neutral' };
  }
}

// Nhan & mau cho nhom no
export function nhanNhomNo(nhom: number): { text: string; cls: string } {
  switch (nhom) {
    case 1: return { text: 'Nh\u00f3m 1 - N\u1ee3 \u0111\u1ee7 ti\u00eau chu\u1ea9n', cls: 'badge-ok' };
    case 2: return { text: 'Nh\u00f3m 2 - N\u1ee3 c\u1ea7n ch\u00fa \u00fd', cls: 'badge-info' };
    case 3: return { text: 'Nh\u00f3m 3 - N\u1ee3 d\u01b0\u1edbi ti\u00eau chu\u1ea9n', cls: 'badge-warn' };
    case 4: return { text: 'Nh\u00f3m 4 - N\u1ee3 nghi ng\u1edd', cls: 'badge-warn' };
    case 5: return { text: 'Nh\u00f3m 5 - N\u1ee3 c\u00f3 kh\u1ea3 n\u0103ng m\u1ea5t v\u1ed1n', cls: 'badge-danger' };
    default: return { text: 'Nh\u00f3m ' + nhom, cls: 'badge-neutral' };
  }
}

// Vai tro hien thi
export function nhanVaiTro(vt: string): string {
  switch (vt) {
    case 'Admin': return 'Qu\u1ea3n tr\u1ecb vi\u00ean';
    case 'NhanVien': return 'Nh\u00e2n vi\u00ean t\u00edn d\u1ee5ng';
    case 'KhachHang': return 'Kh\u00e1ch h\u00e0ng';
    default: return vt;
  }
}
