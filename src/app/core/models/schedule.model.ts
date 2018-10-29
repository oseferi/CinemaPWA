import { Theater } from './theater.model';
import { Movie } from './movie.model';

export class Schedule {
  id: number;
  theater: Theater;
  movie: Movie;
  date: string;
  time: string;
  price: number;
}