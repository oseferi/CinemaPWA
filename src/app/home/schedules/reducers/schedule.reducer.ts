import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Schedule } from '../models/schedule.model';
import { ScheduleActions, ScheduleActionTypes } from '../actions/schedule.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface ScheduleState extends EntityState<Schedule> {
  schedulesLoaded: boolean;
}

export const adapter: EntityAdapter<Schedule> = createEntityAdapter<Schedule>({
  sortComparer: (a: Schedule, b: Schedule) => a._id < b._id ? -1 : 1,
  selectId: (schedule: Schedule) => schedule._id
});

export const initialState: ScheduleState = adapter.getInitialState({
  schedulesLoaded: false
});

export function scheduleReducer(
  state = initialState,
  action: ScheduleActions
): ScheduleState {
  switch (action.type) {
    case ScheduleActionTypes.LoadSchedulesSuccess: {
      return adapter.addAll(action.payload.categories, { ...state, schedulesLoaded: true });
    }

    case ScheduleActionTypes.AddScheduleSuccess: {
      return adapter.addOne(action.payload.schedule, state);
    }

    case ScheduleActionTypes.UpdateScheduleSuccess: {
      return adapter.updateOne(action.payload.schedule, state);
    }

    case ScheduleActionTypes.DeleteScheduleSuccess: {
      return adapter.removeOne(action.payload.schedule._id, state);
    }

    case ScheduleActionTypes.RestoreScheduleSuccess: {
      return adapter.addOne(action.payload.schedule, state);
    }

    default: {
      return state;
    }
  }
}

export const selectScheduleState = createFeatureSelector<ScheduleState>('schedule');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectScheduleState);

export const selectSchedulesLoaded = createSelector(
  selectScheduleState,
  (state: ScheduleState) => state.schedulesLoaded
);
