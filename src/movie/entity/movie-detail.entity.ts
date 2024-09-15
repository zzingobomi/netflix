import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { BaseTable } from '../../common/entity/base-table.entity';

@Entity()
export class MovieDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  detail: string;

  @OneToOne(() => Movie, (movie) => movie.id)
  movie: Movie;
}
