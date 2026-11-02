"use strict";

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeIndex(
      "favorites",
      "favorites_tenant_id_city_unique"
    );

    await queryInterface.sequelize.query(`
      CREATE UNIQUE INDEX favorites_tenant_id_city_unique
      ON favorites (tenant_id, LOWER(city))
      WHERE is_deleted = false;
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP INDEX IF EXISTS favorites_tenant_id_city_unique;
    `);

    await queryInterface.addIndex(
      "favorites",
      ["tenant_id", "city"],
      {
        unique: true,
        name: "favorites_tenant_id_city_unique",
      }
    );
  },
};