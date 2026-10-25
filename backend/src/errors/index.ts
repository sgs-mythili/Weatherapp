import Boom from "@hapi/boom";

export type ErrorCode =
  | "CITY_NOT_FOUND"
  | "CITY_ALREADY_EXISTS"
  | "INVALID_CITY"
  | "INVALID_TENANT"
  | "INVALID_REQUEST"
  | "WEATHER_NOT_FOUND"
  | "WEATHER_SERVICE_ERROR"
  | "INTERNAL_SERVER_ERROR";

function withCode(
  error: Boom.Boom,
  code: ErrorCode
): Boom.Boom {
  error.output.payload = {
    ...error.output.payload,
    code,
  } as typeof error.output.payload;

  return error;
}

export function NotFoundError(
  code: ErrorCode,
  message = "Resource not found"
): Boom.Boom {
  return withCode(Boom.notFound(message), code);
}

export function BadRequestError(
  code: ErrorCode,
  message = "Invalid request"
): Boom.Boom {
  return withCode(Boom.badRequest(message), code);
}

export function ConflictError(
  code: ErrorCode,
  message = "Resource already exists"
): Boom.Boom {
  return withCode(Boom.conflict(message), code);
}

export function InternalServerError(
  code: ErrorCode = "INTERNAL_SERVER_ERROR",
  message = "Internal server error"
): Boom.Boom {
  return withCode(Boom.internal(message), code);
}