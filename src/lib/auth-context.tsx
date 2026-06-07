"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthResult } from "./types";

const KEY = "tindung_auth";

interface AuthContextValue {
  user: AuthResult | null;
  /** true cho tới khi đọc xong localStorage (tránh nháy/redirect sai khi SSR) */
  dangTai: boolean;
  daDangNhap: boolean;
  laAdmin: boolean;
  laNhanVien: boolean;
  laKhachHang: boolean;
  luu: (kq: AuthResult) => void;
  dangXuat: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function docToken(): string | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as AuthResult).token ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthResult | null>(null);
  const [dangTai, setDangTai] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        localStorage.removeItem(KEY);
      }
    }
    setDangTai(false);
  }, []);

  const luu = (kq: AuthResult) => {
    localStorage.setItem(KEY, JSON.stringify(kq));
    setUser(kq);
  };

  const dangXuat = () => {
    localStorage.removeItem(KEY);
    setUser(null);
  };

  const value: AuthContextValue = {
    user,
    dangTai,
    daDangNhap: user !== null,
    laAdmin: user?.vaiTro === "Admin",
    laNhanVien: user ? ["Admin", "NhanVien"].includes(user.vaiTro) : false,
    laKhachHang: user?.vaiTro === "KhachHang",
    luu,
    dangXuat,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải được dùng bên trong AuthProvider");
  return ctx;
}
