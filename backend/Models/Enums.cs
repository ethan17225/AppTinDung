namespace TinDungApi.Models;

// Vai tro nguoi dung trong he thong
public enum VaiTro
{
    Admin,      // Quan tri vien - toan quyen
    NhanVien,   // Nhan vien tin dung
    KhachHang   // Khach hang
}

// Trang thai cua mot ho so vay (workflow)
public enum TrangThaiHopDong
{
    ChoDuyet,     // Cho duyet
    DaGiaiNgan,   // Da giai ngan
    DangVay,      // Dang vay (con du no)
    TatToan,      // Da tat toan
    TuChoi        // Bi tu choi
}

// Loai giao dich tien te
public enum LoaiGiaoDich
{
    GiaiNgan,   // Tien ra: ngan hang giai ngan cho khach
    ThuNo       // Tien vao: khach tra no goc/lai
}
