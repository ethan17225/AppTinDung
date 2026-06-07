import { NextResponse } from "next/server";
import type { VaiTro } from "@prisma/client";
import { prisma } from "./prisma";
import { xacThucToken, type TokenClaims } from "./auth";

// Lỗi nghiệp vụ có kèm mã HTTP, được bắt ở wrapper xuLy()
export class ApiError extends Error {
  status: number;
  constructor(status: number, thongBao: string) {
    super(thongBao);
    this.status = status;
  }
}

// Trả JSON thành công
export function ok(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

// Lấy claims từ header Authorization (Bearer ...). Trả null nếu không có/không hợp lệ.
export async function layNguoiDung(req: Request): Promise<TokenClaims | null> {
  const header = req.headers.get("authorization") ?? "";
  if (!header.startsWith("Bearer ")) return null;
  const token = header.slice(7).trim();
  if (!token) return null;
  return xacThucToken(token);
}

// Yêu cầu đăng nhập + (tuỳ chọn) thuộc một trong các vai trò cho phép.
export async function yeuCau(
  req: Request,
  vaiTroChoPhep?: VaiTro[]
): Promise<TokenClaims> {
  const claims = await layNguoiDung(req);
  if (!claims) throw new ApiError(401, "Chưa đăng nhập");
  if (vaiTroChoPhep && !vaiTroChoPhep.includes(claims.vaiTro)) {
    throw new ApiError(403, "Không có quyền truy cập");
  }
  return claims;
}

// Bọc phần thân handler để bắt ApiError và lỗi không lường trước -> trả JSON đúng chuẩn.
export async function xuLy(fn: () => Promise<Response>): Promise<Response> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof ApiError) {
      return NextResponse.json({ thongBao: e.message }, { status: e.status });
    }
    console.error("Lỗi máy chủ:", e);
    return NextResponse.json(
      { thongBao: "Lỗi máy chủ nội bộ" },
      { status: 500 }
    );
  }
}

// Ghi một dòng audit log
export async function ghiLog(
  claims: TokenClaims,
  hanhDong: string,
  doiTuong: string,
  chiTiet: string
) {
  await prisma.auditLog.create({
    data: {
      taiKhoanId: claims.taiKhoanId,
      nguoiThucHien: claims.tenDangNhap,
      hanhDong,
      doiTuong,
      chiTiet,
    },
  });
}
