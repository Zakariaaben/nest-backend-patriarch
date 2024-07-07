import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Project } from 'src/projects/models/project.model';

@Table
export class Category extends Model {
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

  @HasMany(() => Project)
  project: Project[];
}
