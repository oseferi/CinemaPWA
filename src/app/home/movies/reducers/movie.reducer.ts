import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Movie } from '../models/movie.model';
import { MovieActions, MovieActionTypes } from '../actions/movie.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface MovieState extends EntityState<Movie> {
  moviesLoaded: boolean;
}

export const adapter: EntityAdapter<Movie> = createEntityAdapter<Movie>();

export const initialState: MovieState = adapter.getInitialState({
  moviesLoaded: false
});

export function movieReducer(
  state = initialState,
  action: MovieActions
): MovieState {
  switch (action.type) {
    case MovieActionTypes.LoadMoviesSuccess: {
      return adapter.addAll(action.payload.movies, { ...state, moviesLoaded: true });
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

export const selectMoviesLoaded = createSelector(
  selectMovieState,
  (state: MovieState) => state.moviesLoaded
);
