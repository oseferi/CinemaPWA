import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Theater } from '../models/theater.model';

export enum TheaterActionTypes {
  LoadTheaters = '[Theater] Load Theaters',
  LoadTheatersSuccess = '[Theater] Load Theaters Success',
  LoadTheatersFailure = '[Theater] Load Theaters Failure',
  AddTheater = '[Theater] Add Theater',
  AddTheaterSuccess = '[Theater] Add Theater Success',
  AddTheaterFailure = '[Theater] Add Theater Failure',
  UpdateTheater = '[Theater] Update Theater',
  UpdateTheaterSuccess = '[Theater] Update Theater Success',
  UpdateTheaterFailure = '[Theater] Update Theater Failure',
  DeleteTheater = '[Theater] Delete Theater',
  DeleteTheaterSuccess = '[Theater] Delete Theater Success',
  DeleteTheaterFailure = '[Theater] Delete Theater Failure',
  RestoreTheater = '[Theater] Restore Theater',
  RestoreTheaterSuccess = '[Theater] Restore Theater Success',
  RestoreTheaterFailure = '[Theater] Restore Theater Failure'
}

export class LoadTheaters implements Action {
  readonly type = TheaterActionTypes.LoadTheaters;
}

export class LoadTheatersSuccess implements Action {
  readonly type = TheaterActionTypes.LoadTheatersSuccess;

  constructor(public payload: { categories: Theater[] }) {}
}

export class LoadTheatersFailure implements Action {
  readonly type = TheaterActionTypes.LoadTheatersFailure;

  constructor(public payload: { error: any }) {}
}

export class AddTheater implements Action {
  readonly type = TheaterActionTypes.AddTheater;

  constructor(public payload: { theater: Partial<Theater> }) {}
}

export class AddTheaterSuccess implements Action {
  readonly type = TheaterActionTypes.AddTheaterSuccess;

  constructor(public payload: { theater: Theater }) {}
}

export class AddTheaterFailure implements Action {
  readonly type = TheaterActionTypes.AddTheaterFailure;

  constructor(public payload: { error: any }) {}
}

export class UpdateTheater implements Action {
  readonly type = TheaterActionTypes.UpdateTheater;

  constructor(public payload: { theater: Update<Theater> }) {}
}

export class UpdateTheaterSuccess implements Action {
  readonly type = TheaterActionTypes.UpdateTheaterSuccess;

  constructor(public payload: { theater: Update<Theater> }) {}
}

export class UpdateTheaterFailure implements Action {
  readonly type = TheaterActionTypes.UpdateTheaterFailure;

  constructor(public payload: { error: any }) {}
}

export class DeleteTheater implements Action {
  readonly type = TheaterActionTypes.DeleteTheater;

  constructor(public payload: { theater: Theater }) {}
}

export class DeleteTheaterSuccess implements Action {
  readonly type = TheaterActionTypes.DeleteTheaterSuccess;

  constructor(public payload: { theater: Theater }) {}
}

export class DeleteTheaterFailure implements Action {
  readonly type = TheaterActionTypes.DeleteTheaterFailure;

  constructor(public payload: { error: any }) {}
}

export class RestoreTheater implements Action {
  readonly type = TheaterActionTypes.RestoreTheater;

  constructor(public payload: { theater: Theater }) {}
}

export class RestoreTheaterSuccess implements Action {
  readonly type = TheaterActionTypes.RestoreTheaterSuccess;

  constructor(public payload: { theater: Theater }) {}
}

export class RestoreTheaterFailure implements Action {
  readonly type = TheaterActionTypes.RestoreTheaterFailure;

  constructor(public payload: { error: any }) {}
}

export type TheaterActions =
 LoadTheaters
 | LoadTheatersSuccess
 | LoadTheatersFailure
 | AddTheater
 | AddTheaterSuccess
 | AddTheaterFailure
 | UpdateTheater
 | UpdateTheaterSuccess
 | UpdateTheaterFailure
 | DeleteTheater
 | DeleteTheaterSuccess
 | DeleteTheaterFailure
 | RestoreTheater
 | RestoreTheaterSuccess
 | RestoreTheaterFailure;
