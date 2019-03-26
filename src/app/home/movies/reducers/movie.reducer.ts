import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Movie } from '../models/movie.model';
import { MovieActions, MovieActionTypes } from '../actions/movie.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface MovieState extends EntityState<Movie> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Movie> = createEntityAdapter<Movie>();

export const initialState: MovieState = adapter.getInitialState({
  // additional entity state properties
});

export function movieReducer(
  state = initialState,
  action: MovieActions
): MovieState {
  switch (action.type) {
    case MovieActionTypes.LoadMoviesSuccess: {
      return adapter.addAll(action.payload.movies, state);
    }

    default: {
      return state;
    }
  }
}

export const selectMovieState = createFeatureSelector<MovieState>('movie');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectMovieState);
