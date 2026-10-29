"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("favorites", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      
      tenant_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        references: {
          model: "tenants",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },

      temperature: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },

      nickname: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });

    await queryInterface.addIndex("favorites", ["tenant_id", "city"], {
      unique: true,
      name: "favorites_tenant_id_city_unique",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("favorites");
  },
};
