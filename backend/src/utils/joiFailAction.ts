import type {
  Request,
  ResponseToolkit,
} from "@hapi/hapi";

import type { ValidationError } from "joi";

export function inputValidationJoiFailAction(
  request: Request,
  h: ResponseToolkit,
  err?: Error
) {
  const joiError = err as ValidationError | undefined;

  const details = Array.isArray(joiError?.details)
    ? joiError.details.map((detail) => ({
        field: detail.path.join(".") || "request",
        message: detail.message,
        type: detail.type,
      }))
    : [
        {
          field: "request",
          message: "Invalid request data",
          type: "validation.error",
        },
      ];

  return h
    .response({
      error: details,
    })
    .code(400)
    .takeover();
}