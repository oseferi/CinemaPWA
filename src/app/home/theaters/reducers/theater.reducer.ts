import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Theater } from '../models/theater.model';
import { TheaterActions, TheaterActionTypes } from '../actions/theater.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface TheaterState extends EntityState<Theater> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Theater> = createEntityAdapter<Theater>({ sortComparer: (a: Theater, b: Theater) => a.id < b.id ? -1 : 1 });

export const initialState: TheaterState = adapter.getInitialState({
  // additional entity state properties
});

export function theaterReducer(
  state = initialState,
  action: TheaterActions
): TheaterState {
  switch (action.type) {
    case TheaterActionTypes.LoadTheatersSuccess: {
      return adapter.addAll(action.payload.categories, state);
    }

    case TheaterActionTypes.AddTheaterSuccess: {
      return adapter.addOne(action.payload.theater, state);
    }

    case TheaterActionTypes.UpdateTheaterSuccess: {
      return adapter.updateOne(action.payload.theater, state);
    }

    case TheaterActionTypes.DeleteTheaterSuccess: {
      return adapter.removeOne(action.payload.theater.id, state);
    }

    case TheaterActionTypes.RestoreTheaterSuccess: {
      return adapter.addOne(action.payload.theater, state);
    }

    default: {
      return state;
    }
  }
}

export const selectTheaterState = createFeatureSelector<TheaterState>('theater');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectTheaterState);
