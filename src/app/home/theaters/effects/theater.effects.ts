import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadTheatersFailure, LoadTheatersSuccess, TheaterActionTypes, TheaterActions, AddTheater, AddTheaterSuccess, AddTheaterFailure, UpdateTheater, UpdateTheaterSuccess, UpdateTheaterFailure, DeleteTheater, DeleteTheaterSuccess, DeleteTheaterFailure, RestoreTheater, RestoreTheaterSuccess, RestoreTheaterFailure } from '../actions/theater.actions';
import { TheaterService } from '../services/theater.service';
import { Theater } from '../models/theater.model';
import { Store } from '@ngrx/store';
import * as fromTheater from '../reducers/theater.reducer';

@Injectable()
export class TheaterEffects {

  @Effect()
  loadTheaters$ = this.actions$.pipe(
    ofType(TheaterActionTypes.LoadTheaters),
    withLatestFrom(this.store.select(fromTheater.selectTheatersLoaded)),
    filter(([action, theatersLoaded]) => !theatersLoaded),
    switchMap(() => this.theaterService.getTheaters().pipe(
      map((response: Theater[]) => new LoadTheatersSuccess({ categories: response })),
      catchError(error => of(new LoadTheatersFailure({ error }))))
    )
  );

  @Effect()
  addTheater$ = this.actions$.pipe(
    ofType(TheaterActionTypes.AddTheater),
    switchMap((action: AddTheater) => this.theaterService.createTheater(action.payload.theater).pipe(
      map((response: Theater) => new AddTheaterSuccess({ theater: response })),
      catchError(error => of(new AddTheaterFailure({ error }))))
    )
  );

  @Effect()
  updateTheater$ = this.actions$.pipe(
    ofType(TheaterActionTypes.UpdateTheater),
    switchMap((action: UpdateTheater) => this.theaterService.updateTheater(action.payload.theater).pipe(
      map(() => new UpdateTheaterSuccess(action.payload)),
      catchError(error => of(new UpdateTheaterFailure({ error }))))
    )
  );

  @Effect()
  deleteTheater$ = this.actions$.pipe(
    ofType(TheaterActionTypes.DeleteTheater),
    switchMap((action: DeleteTheater) => this.theaterService.deleteTheater(action.payload.theater.id).pipe(
      map(() => new DeleteTheaterSuccess(action.payload)),
      catchError(error => of(new DeleteTheaterFailure({ error }))))
    )
  );

  @Effect()
  restoreTheater$ = this.actions$.pipe(
    ofType(TheaterActionTypes.RestoreTheater),
    switchMap((action: RestoreTheater) => this.theaterService.restoreTheater(action.payload.theater.id).pipe(
      map(() => new RestoreTheaterSuccess(action.payload)),
      catchError(error => of(new RestoreTheaterFailure({ error }))))
    )
  );

  constructor(private actions$: Actions<TheaterActions>, private theaterService: TheaterService, private store: Store<fromTheater.TheaterState>) { }
}
