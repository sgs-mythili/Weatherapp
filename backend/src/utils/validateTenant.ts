import type { Request } from "@hapi/hapi";

import {
  BadRequestError,
  NotFoundError,
} from "../errors";

import TenantModel from "../models/tenantModel";

export async function validateTenant(
  request: Request
): Promise<string> {
  const tenantId = request.headers["x-tenant-id"];

  // Check whether the header exists
  if (!tenantId || typeof tenantId !== "string") {
    throw BadRequestError(
      "INVALID_TENANT",
      "Tenant ID is required"
    );
  }

  // Check whether the tenant exists and is active
  const tenant = await TenantModel.findOne({
    where: {
      id: tenantId,
      status: "ACTIVE",
    },
  });

  if (!tenant) {
    throw NotFoundError(
      "TENANT_NOT_FOUND",
      "Tenant does not exist or is inactive"
    );
  }

  return tenantId;
}

