import type { Request } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { BadRequestError } from "../errors";

export function validateTenant(request: Request) {
  const tenantId:any = request.headers["x-tenant-id"];

  if (!tenantId) {
     throw BadRequestError("INVALID_TENANT", "Tenant ID is required");
  }

  return tenantId;
}