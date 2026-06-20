import multer from "multer";
import { NODE_ENV } from "../../../../config/config.service.js";
//!global error
export const globalErrorHandling = (error, req, res, next) => {
  const status = error.cause?.status ?? 500;
  if (error instanceof multer.MulterError) {
    status = 400;
  }
  return res.status(status).json({
    error_message:
      status == 500
        ? "something went wrong"
        : (error.message ?? "something went wrong"),
    extra: error?.cause?.extra || undefined,
    stack: NODE_ENV == "development" ? error.stack : undefined,
  });
};

//!general_customized_error
// export const ErrorResponse = ({
//   message = "Error",
//   status = 400,
//   extra = undefined,
// } = {}) => {
//   throw new Error(message, { status, extra });
// };
export const ErrorResponse = ({
  message = "Error",
  status = 400,
  extra = undefined,
} = {}) => {
  throw new Error(message, {
    cause: { status, extra },
  });
};
//!error_templates
export const BadRequestException = ({
  message = "BadRequestException",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ message, status: 400, extra });
};
// export const BadRequestException = ({
//   message = "BadRequestException",
//   extra = undefined,
// } = {}) => {
//   return ErrorResponse({ message, cause: { status: 400, extra } });
// };
export const UnauthorizedException = ({
  message = "UnauthorizedException",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ message, cause: { status: 401, extra } });
};
export const ForbiddenException = ({
  message = "ForbiddenException",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ message, cause: { status: 404, extra } });
};
export const ConflictException = ({
  message = "ConflictException",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ message, cause: { status: 409, extra } });
};
export const NotFoundException = ({
  message = "NotFoundException",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ message, cause: { status: 404, extra } });
};
