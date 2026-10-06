import type { Request } from "@hapi/hapi";
import Boom from "@hapi/boom";

export function validateTenant(request: Request) {
  const tenantId:any = request.headers["x-tenant-id"];

  if (!tenantId) {
    throw Boom.unauthorized("Tenant ID is required");
  }

  return tenantId;
}