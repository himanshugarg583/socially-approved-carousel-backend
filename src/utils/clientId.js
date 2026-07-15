import crypto from "node:crypto";

export function getClientId(req) {
  const forwarded = req.headers["x-forwarded-for"];
  const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded || req.ip || "")
    .split(",")[0]
    .trim();
  const agent = req.headers["user-agent"] || "";
  return crypto.createHash("sha256").update(`${ip}::${agent}`).digest("hex");
}
