"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

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

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, dangTai, laKhachHang, laNhanVien, dangXuat } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (dangTai) return;
    if (!laKhachHang) {
      router.replace(laNhanVien ? "/quan-tri" : "/dang-nhap");
    }
  }, [dangTai, laKhachHang, laNhanVien, router]);

  if (dangTai || !laKhachHang) return null;

  return (
    <div className="shell">
      <aside className="side">
        <div className="side-logo">
          <span className="dot">T</span> App Tín Dụng
        </div>

        <div className="nav-group-title">Tài khoản của tôi</div>
        <NavLink href="/portal" exact ico="☺">
          Trang cá nhân
        </NavLink>
        <NavLink href="/portal/khoan-vay" ico="▤">
          Khoản vay của tôi
        </NavLink>
        <NavLink href="/portal/lich-su" ico="⇄">
          Lịch sử giao dịch
        </NavLink>
        <NavLink href="/portal/dang-ky-vay" ico="＋">
          Đăng ký vay mới
        </NavLink>

        <div className="side-user">
          <div className="who">
            <div className="name">{user?.hoTen}</div>
            <div className="role">Khách hàng</div>
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
