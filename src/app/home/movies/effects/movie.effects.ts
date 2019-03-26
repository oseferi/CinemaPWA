import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadMoviesFailure, LoadMoviesSuccess, MovieActionTypes, MovieActions } from '../actions/movie.actions';
import { MovieService } from '../services/movie.service';
import { Movie } from '../models/movie.model';

@Injectable()
export class MovieEffects {

  @Effect()
  loadMovies$ = this.actions$.pipe(
    ofType(MovieActionTypes.LoadMovies),
    switchMap(() => this.movieService.getMovies().pipe(
      map((response: Movie[]) => new LoadMoviesSuccess({ movies: response })),
      catchError(error => of(new LoadMoviesFailure({ error }))))
    )
  );

  constructor(private actions$: Actions<MovieActions>, private movieService: MovieService) {}
}
