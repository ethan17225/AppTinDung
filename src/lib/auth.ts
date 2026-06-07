import { SignJWT, jwtVerify } from "jose";
import type { VaiTro } from "@prisma/client";

// Thông tin được mã hóa trong JWT
export interface TokenClaims {
  taiKhoanId: number;
  tenDangNhap: string;
  vaiTro: VaiTro;
  khachHangId: number | null;
}

const ISSUER = "TinDungApi";
const AUDIENCE = "TinDungApp";

function laySecret(): Uint8Array {
  const key = process.env.JWT_SECRET;
  if (!key) {
    throw new Error("Thiếu biến môi trường JWT_SECRET");
  }
  return new TextEncoder().encode(key);
}

// Tạo token JWT cho một tài khoản
export async function taoToken(claims: TokenClaims): Promise<string> {
  const hours = Number(process.env.JWT_EXPIRE_HOURS ?? "8");
  return new SignJWT({
    tenDangNhap: claims.tenDangNhap,
    vaiTro: claims.vaiTro,
    khachHangId: claims.khachHangId,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(claims.taiKhoanId))
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${hours}h`)
    .sign(laySecret());
}

// Xác thực token, trả về claims hoặc null nếu không hợp lệ
export async function xacThucToken(token: string): Promise<TokenClaims | null> {
  try {
    const { payload } = await jwtVerify(token, laySecret(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });
    return {
      taiKhoanId: Number(payload.sub),
      tenDangNhap: String(payload.tenDangNhap ?? ""),
      vaiTro: payload.vaiTro as VaiTro,
      khachHangId:
        payload.khachHangId == null ? null : Number(payload.khachHangId),
    };
  } catch {
    return null;
  }
}
