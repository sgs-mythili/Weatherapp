import "dotenv/config";

import assert from "node:assert/strict";

import { sequelize } from "../src/database/db";
import FavoriteModel from "../src/models/favoriteModel";
import TenantModel from "../src/models/tenantModel";

const API_BASE_URL =
  process.env.API_BASE_URL || "http://localhost:3000";

const ALPHA_TENANT = "tenant-alpha";
const BETA_TENANT = "tenant-beta";

interface FavoritesResponse {
  data: Array<{
    id: number;
    city: string;
    tenant_id: string;
  }>;
}

interface ErrorResponse {
  code?: string;
  message?: string;
}

async function main() {
  try {
    await sequelize.authenticate();

    console.log("Database connected successfully.");

    // Verify that both tenants exist and are active.
    const alphaTenant = await TenantModel.findOne({
      where: {
        id: ALPHA_TENANT,
        status: "ACTIVE",
      },
    });

    const betaTenant = await TenantModel.findOne({
      where: {
        id: BETA_TENANT,
        status: "ACTIVE",
      },
    });

    assert.ok(alphaTenant, "Alpha tenant must exist and be ACTIVE");
    assert.ok(betaTenant, "Beta tenant must exist and be ACTIVE");

    // Get existing, non-deleted favorites for both tenants.
    const alphaFavorites = await FavoriteModel.findAll({
      where: {
        tenant_id: ALPHA_TENANT,
        is_deleted: false,
      },
      order: [["id", "ASC"]],
    });

    const betaFavorites = await FavoriteModel.findAll({
      where: {
        tenant_id: BETA_TENANT,
        is_deleted: false,
      },
      order: [["id", "ASC"]],
    });

    assert.ok(
      alphaFavorites.length > 0,
      "Seed Alpha favorites before running this script"
    );

    assert.ok(
      betaFavorites.length > 0,
      "Seed Beta favorites before running this script"
    );

    // Use an Alpha favorite ID for the cross-tenant tests.
    const alphaFavorite = alphaFavorites[0];

    const originalNickname = alphaFavorite.nickname;
    const originalNotes = alphaFavorite.notes;

    console.log("\nStarting tenant isolation checks...\n");

    // Rule 1: GET /favorites using Alpha tenant header
const readResponse = await fetch(`${API_BASE_URL}/favorites?limit=all`, {
  method: "GET",
  headers: {
    "x-tenant-id": ALPHA_TENANT,
  },
});

assert.equal(readResponse.status, 200);

const readBody = (await readResponse.json()) as FavoritesResponse;

assert.ok(
  Array.isArray(readBody.data),
  "Favorites response should contain a data array",
);

// Every returned favorite must belong to Alpha.
assert.ok(
  readBody.data.every((favorite) => favorite.tenant_id === ALPHA_TENANT),
  "Alpha response contains a favorite belonging to another tenant",
);

console.log("PASS Rule 1: Read isolation");

    // RULE 2: MUTATION ISOLATION
    // Beta tries to PATCH a favorite owned by Alpha.
    const patchResponse = await fetch(
      `${API_BASE_URL}/favorites/${alphaFavorite.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": BETA_TENANT,
        },
        body: JSON.stringify({
          nickname: "Unauthorized change",
        }),
      }
    );

    assert.equal(patchResponse.status, 404);

    const patchBody =
      (await patchResponse.json()) as ErrorResponse;

    assert.equal(patchBody.code, "CITY_NOT_FOUND");

    // Verify that the original record was not modified.
    const afterPatch = await FavoriteModel.findByPk(
      alphaFavorite.id
    );

    assert.ok(afterPatch);
    assert.equal(afterPatch.tenant_id, ALPHA_TENANT);
    assert.equal(afterPatch.nickname, originalNickname);
    assert.equal(afterPatch.notes, originalNotes);

    console.log("PASS Rule 2: Mutation isolation");

    // RULE 3: DELETE ISOLATION
    // Beta tries to DELETE a favorite owned by Alpha.
    const deleteResponse = await fetch(
      `${API_BASE_URL}/favorites/${alphaFavorite.id}`,
      {
        method: "DELETE",
        headers: {
          "x-tenant-id": BETA_TENANT,
        },
      }
    );

    assert.equal(deleteResponse.status, 404);

    const deleteBody =
      (await deleteResponse.json()) as ErrorResponse;

    assert.equal(deleteBody.code, "CITY_NOT_FOUND");

    // Verify that Alpha's favorite still exists and is not deleted.
    const afterDelete = await FavoriteModel.findByPk(
      alphaFavorite.id
    );

    assert.ok(afterDelete);
    assert.equal(afterDelete.tenant_id, ALPHA_TENANT);
    assert.equal(afterDelete.is_deleted, false);

    console.log("PASS Rule 3: Delete isolation");

    // RULE 4: INVALID TENANT
    const invalidTenantResponse = await fetch(
      `${API_BASE_URL}/favorites`,
      {
        method: "GET",
        headers: {
          "x-tenant-id": "non-existent-tenant",
        },
      }
    );

    assert.equal(invalidTenantResponse.status, 404);

    const invalidTenantBody =
      (await invalidTenantResponse.json()) as ErrorResponse;

    assert.equal(
      invalidTenantBody.code,
      "TENANT_NOT_FOUND"
    );

    console.log("PASS Rule 4: Invalid tenant");

    console.log("\nAll 4 tenant isolation checks passed!");
  } catch (error) {
    console.error("\nTenant isolation verification failed:");
    console.error(error);

    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

main();