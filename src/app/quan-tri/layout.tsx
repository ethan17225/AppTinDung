"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { nhanVaiTro } from "@/lib/format";

function NavLink({
  href,
  exact,
  ico,
  children,
}: {
  href: string;
  exact?: boolean;
  ico: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link className={`nav-link${active ? " active" : ""}`} href={href}>
      <span className="ico">{ico}</span> {children}
    </Link>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, dangTai, laNhanVien, laAdmin, laKhachHang, dangXuat } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (dangTai) return;
    if (!laNhanVien) {
      router.replace(laKhachHang ? "/portal" : "/dang-nhap");
    }
  }, [dangTai, laNhanVien, laKhachHang, router]);

  if (dangTai || !laNhanVien) return null;

  return (
    <div className="shell">
      <aside className="side">
        <div className="side-logo">
          <span className="dot">T</span> App Tín Dụng
        </div>

        <div className="nav-group-title">Nghiệp vụ</div>
        <NavLink href="/quan-tri" exact ico="▦">
          Tổng quan
        </NavLink>
        <NavLink href="/quan-tri/khach-hang" ico="☺">
          Khách hàng
        </NavLink>
        <NavLink href="/quan-tri/ho-so-vay" ico="▤">
          Hồ sơ vay
        </NavLink>
        <NavLink href="/quan-tri/thu-hoi-no" ico="⚠">
          Thu hồi nợ
        </NavLink>

        {laAdmin && (
          <>
            <div className="nav-group-title">Quản trị</div>
            <NavLink href="/quan-tri/tai-khoan" ico="⚙">
              Tài khoản
            </NavLink>
            <NavLink href="/quan-tri/audit-log" ico="❏">
              Nhật ký hệ thống
            </NavLink>
          </>
        )}

        <div className="side-user">
          <div className="who">
            <div className="name">{user?.hoTen}</div>
            <div className="role">{nhanVaiTro(user?.vaiTro ?? "")}</div>
          </div>
          <button
            className="logout"
            onClick={() => {
              dangXuat();
              router.push("/dang-nhap");
            }}
          >
            <span>⎋</span> Đăng xuất
          </button>
        </div>
      </aside>

      <main className="main">
        <div className="main-inner">{children}</div>
      </main>
    </div>
  );
}
