
import { Component, OnInit } from '@angular/core';
import { Movie } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  movies: Movie[];

  constructor(
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.movieService
      .getMovies()
      .toPromise()
      .then((response: Movie[]) => this.movies = response)
      .catch(err => console.warn(err));
  }

  public getAvatarUrl = (url: string) => `url(${url})`;

  public watchTrailer = (url: string) => window.open(url, '_blank');
}