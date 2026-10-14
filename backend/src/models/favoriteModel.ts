import {
  DataTypes,
  Model,
  type Optional,
} from "sequelize";

import { sequelize } from "../database/db";

interface FavoriteAttributes {
  id: number;
  city: string;
  temperature: number;
  nickname: string | null;
  notes: string | null;
  tenant_id: string;
  created_at: Date;
}

type FavoriteCreationAttributes = Optional<
  FavoriteAttributes,
  "id" | "nickname" | "notes" | "created_at"
>;

class FavoriteModel
  extends Model<FavoriteAttributes, FavoriteCreationAttributes>
  implements FavoriteAttributes
{
  declare id: number;
  declare city: string;
  declare temperature: number;
  declare nickname: string | null;
  declare notes: string | null;
  declare tenant_id: string;
  declare created_at: Date;
}

FavoriteModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    temperature: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },

    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    notes: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    tenant_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Favorite",
    tableName: "favorites",
    timestamps: false,
  }
);

export default FavoriteModel;