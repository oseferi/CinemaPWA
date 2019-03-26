import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Schedule, ScheduleRequest } from '../models/schedule.model';

export enum ScheduleActionTypes {
  LoadSchedules = '[Schedule] Load Schedules',
  LoadSchedulesSuccess = '[Schedule] Load Schedules Success',
  LoadSchedulesFailure = '[Schedule] Load Schedules Failure',
  AddSchedule = '[Schedule] Add Schedule',
  AddScheduleSuccess = '[Schedule] Add Schedule Success',
  AddScheduleFailure = '[Schedule] Add Schedule Failure',
  UpdateSchedule = '[Schedule] Update Schedule',
  UpdateScheduleSuccess = '[Schedule] Update Schedule Success',
  UpdateScheduleFailure = '[Schedule] Update Schedule Failure',
  DeleteSchedule = '[Schedule] Delete Schedule',
  DeleteScheduleSuccess = '[Schedule] Delete Schedule Success',
  DeleteScheduleFailure = '[Schedule] Delete Schedule Failure',
  RestoreSchedule = '[Schedule] Restore Schedule',
  RestoreScheduleSuccess = '[Schedule] Restore Schedule Success',
  RestoreScheduleFailure = '[Schedule] Restore Schedule Failure'
}

export class LoadSchedules implements Action {
  readonly type = ScheduleActionTypes.LoadSchedules;
}

export class LoadSchedulesSuccess implements Action {
  readonly type = ScheduleActionTypes.LoadSchedulesSuccess;

  constructor(public payload: { categories: Schedule[] }) {}
}

export class LoadSchedulesFailure implements Action {
  readonly type = ScheduleActionTypes.LoadSchedulesFailure;

  constructor(public payload: { error: any }) {}
}

export class AddSchedule implements Action {
  readonly type = ScheduleActionTypes.AddSchedule;

  constructor(public payload: { schedule: ScheduleRequest }) {}
}

export class AddScheduleSuccess implements Action {
  readonly type = ScheduleActionTypes.AddScheduleSuccess;

  constructor(public payload: { schedule: Schedule }) {}
}

export class AddScheduleFailure implements Action {
  readonly type = ScheduleActionTypes.AddScheduleFailure;

  constructor(public payload: { error: any }) {}
}

export class UpdateSchedule implements Action {
  readonly type = ScheduleActionTypes.UpdateSchedule;

  constructor(public payload: { schedule: Update<Schedule> }) {}
}

export class UpdateScheduleSuccess implements Action {
  readonly type = ScheduleActionTypes.UpdateScheduleSuccess;

  constructor(public payload: { schedule: Update<Schedule> }) {}
}

export class UpdateScheduleFailure implements Action {
  readonly type = ScheduleActionTypes.UpdateScheduleFailure;

  constructor(public payload: { error: any }) {}
}

export class DeleteSchedule implements Action {
  readonly type = ScheduleActionTypes.DeleteSchedule;

  constructor(public payload: { schedule: Schedule }) {}
}

export class DeleteScheduleSuccess implements Action {
  readonly type = ScheduleActionTypes.DeleteScheduleSuccess;

  constructor(public payload: { schedule: Schedule }) {}
}

export class DeleteScheduleFailure implements Action {
  readonly type = ScheduleActionTypes.DeleteScheduleFailure;

  constructor(public payload: { error: any }) {}
}

export class RestoreSchedule implements Action {
  readonly type = ScheduleActionTypes.RestoreSchedule;

  constructor(public payload: { schedule: Schedule }) {}
}

export class RestoreScheduleSuccess implements Action {
  readonly type = ScheduleActionTypes.RestoreScheduleSuccess;

  constructor(public payload: { schedule: Schedule }) {}
}

export class RestoreScheduleFailure implements Action {
  readonly type = ScheduleActionTypes.RestoreScheduleFailure;

  constructor(public payload: { error: any }) {}
}

export type ScheduleActions =
 LoadSchedules
 | LoadSchedulesSuccess
 | LoadSchedulesFailure
 | AddSchedule
 | AddScheduleSuccess
 | AddScheduleFailure
 | UpdateSchedule
 | UpdateScheduleSuccess
 | UpdateScheduleFailure
 | DeleteSchedule
 | DeleteScheduleSuccess
 | DeleteScheduleFailure
 | RestoreSchedule
 | RestoreScheduleSuccess
 | RestoreScheduleFailure;
