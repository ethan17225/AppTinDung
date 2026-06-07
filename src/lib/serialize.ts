import { Prisma } from "@prisma/client";

// Chuyển Prisma.Decimal (hoặc số) thành number để trả JSON gọn gàng cho frontend.
export function toNum(
  x: Prisma.Decimal | number | null | undefined
): number {
  if (x == null) return 0;
  return typeof x === "number" ? x : Number(x.toString());
}
