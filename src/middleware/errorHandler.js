import { isProduction } from "../config/env.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const payload = {
    success: false,
    message: statusCode === 500 && isProduction ? "Internal server error" : err.message
  };

  if (!isProduction && statusCode === 500) {
    payload.stack = err.stack;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(payload);
}
