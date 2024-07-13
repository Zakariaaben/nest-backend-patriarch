import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from 'src/categories/models/category.model';
import { Image } from 'src/images/Models/images.model.';

@Table
export class Project extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT({ length: 'long' }),
  })
  description: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  categoryId: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date: string;

  @HasMany(() => Image, { onDelete: 'CASCADE' })
  images: Image[];

  @BelongsTo(() => Category)
  category: Category;
}
