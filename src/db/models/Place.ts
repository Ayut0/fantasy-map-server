import { DataTypes, Model, NonAttribute, Optional } from 'sequelize';
import { getSequelize } from '../../sequelize';
import Category from './Category';
import User from './User';
import Review from './Review';

export interface IPlaceOutput {
  id: number;
  name: string;
  address: string;
  description: string;
  picture: string;
  category?: Category;
  user?: User;
  reviews?: Review[];
}

export type IPlaceInput = Optional<IPlaceOutput, 'id'>;

class Place extends Model<IPlaceOutput, IPlaceInput> implements IPlaceOutput {
  declare id: number;
  declare name: string;
  declare address: string;
  declare description: string;
  declare picture: string;
  declare category?: Category;
  declare user?: User;
  declare reviews: NonAttribute<Review[]>;
}

const sequelize = getSequelize();

Place.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    picture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Place',
    tableName: 'places',
  }
);

Category.hasMany(Place, { foreignKey: 'categoryId' });
Place.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Place, { foreignKey: 'userId' });
Place.belongsTo(User, { foreignKey: 'userId' });

User.belongsToMany(Place, { through: 'favorites' });
Place.belongsToMany(User, { through: 'favorites' });

export default Place;
