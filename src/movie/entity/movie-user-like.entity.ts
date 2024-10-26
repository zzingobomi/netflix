import { Entity } from 'typeorm';
import { Movie } from './movie.entity';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class MovieUserLike {
  movie: Movie;

  user: User;
}
