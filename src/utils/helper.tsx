import { jwtDecode } from "jwt-decode";

export const maskEmail = (email: string) => {
  if (!email.includes("@")) return email;
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) {
    return localPart[0] + "*@" + domain;
  }
  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const maskedMiddle = "*".repeat(localPart.length - 2);
  return `${firstChar}${maskedMiddle}${lastChar}@${domain}`;
};

export const generateCaptcha = (): string => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};
