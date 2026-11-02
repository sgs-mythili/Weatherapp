"use strict";

const { randomUUID } = require("crypto");

module.exports = {
  async up(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      const now = new Date();

      await queryInterface.bulkInsert(
        "tenants",
        [
          {
            id: "tenant-alpha",
            name: "Alpha Logistics",
            status: "ACTIVE",
            created_at: now,
            updated_at: now,
          },
          {
            id: "tenant-beta",
            name: "Beta Air & Travel",
            status: "ACTIVE",
            created_at: now,
            updated_at: now,
          },
        ],
        { transaction }
      );

      const citiesByTenant = [
        {
          tenant_id: "tenant-alpha",
          cities: ["London", "Tokyo", "Paris", "Sydney"],
        },
        {
          tenant_id: "tenant-beta",
          cities: ["New York", "Dallas", "Seattle", "Toronto"],
        },
      ];

      const favorites = citiesByTenant.flatMap(
        ({ tenant_id, cities }) =>
          cities.map((city) => ({
            // id: randomUUID(),
            tenant_id,
            city,
            temperature: null,
            nickname: null,
            notes: null,
            created_at: now,
            // updated_at: now,
          }))
      );

      // 3. Insert favorites only after their tenants exist.
      await queryInterface.bulkInsert(
        "favorites",
        favorites,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Delete child records before parent records.
      await queryInterface.bulkDelete(
        "favorites",
        {
          tenant_id: [
            "tenant-alpha",
            "tenant-beta",
          ],
        },
        { transaction }
      );

      await queryInterface.bulkDelete(
        "tenants",
        {
          id: [
            "tenant-alpha",
            "tenant-beta",
          ],
        },
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};