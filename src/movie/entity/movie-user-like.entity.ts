import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class MovieUserLike {
  @PrimaryColumn({
    name: 'movieId',
    type: 'int8',
  })
  @ManyToOne(() => Movie, (movie) => movie.likedUsers, { onDelete: 'CASCADE' })
  movie: Movie;

  @PrimaryColumn({
    name: 'userId',
    type: 'int8',
  })
  @ManyToOne(() => User, (movie) => movie.likedMovies, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  isLike: boolean;
}
