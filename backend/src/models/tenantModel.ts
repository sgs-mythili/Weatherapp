import {DataTypes,Model,} from "sequelize";

import { sequelize } from "../database/db";

interface TenantAttributes {
  id: string;
  name: string;
  status: string;
}

class TenantModel
  extends Model<TenantAttributes>
  implements TenantAttributes
{
  declare id: string;
  declare name: string;
  declare status: string;
}

TenantModel.init(
  {
    id: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "ACTIVE",
    },
  },
  {
    sequelize,
    modelName: "Tenant",
    tableName: "tenants",
    timestamps: false,
  }
);

export default TenantModel;