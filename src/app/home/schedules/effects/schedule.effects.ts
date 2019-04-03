import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadSchedulesFailure, LoadSchedulesSuccess, ScheduleActionTypes, ScheduleActions, AddSchedule, AddScheduleSuccess, AddScheduleFailure, UpdateSchedule, UpdateScheduleSuccess, UpdateScheduleFailure, DeleteSchedule, DeleteScheduleSuccess, DeleteScheduleFailure, RestoreSchedule, RestoreScheduleSuccess, RestoreScheduleFailure } from '../actions/schedule.actions';
import { ScheduleService } from '../services/schedule.service';
import { Schedule } from '../models/schedule.model';
import * as fromSchedule from '../reducers/schedule.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class ScheduleEffects {

  @Effect()
  loadSchedules$ = this.actions$.pipe(
    ofType(ScheduleActionTypes.LoadSchedules),
    withLatestFrom(this.store.select(fromSchedule.selectSchedulesLoaded)),
    filter(([action, schedulesLoaded]) => !schedulesLoaded),
    switchMap(() => this.scheduleService.getSchedules().pipe(
      map((response: Schedule[]) => new LoadSchedulesSuccess({ categories: response })),
      catchError(error => of(new LoadSchedulesFailure({ error }))))
    )
  );

  @Effect()
  addSchedule$ = this.actions$.pipe(
    ofType(ScheduleActionTypes.AddSchedule),
    switchMap((action: AddSchedule) => this.scheduleService.createSchedule(action.payload.schedule).pipe(
      map((response: Schedule) => new AddScheduleSuccess({ schedule: response })),
      catchError(error => of(new AddScheduleFailure({ error }))))
    )
  );

  @Effect()
  updateSchedule$ = this.actions$.pipe(
    ofType(ScheduleActionTypes.UpdateSchedule),
    switchMap((action: UpdateSchedule) => this.scheduleService.updateSchedule(action.payload.schedule).pipe(
      map(() => new UpdateScheduleSuccess(action.payload)),
      catchError(error => of(new UpdateScheduleFailure({ error }))))
    )
  );

  @Effect()
  deleteSchedule$ = this.actions$.pipe(
    ofType(ScheduleActionTypes.DeleteSchedule),
    switchMap((action: DeleteSchedule) => this.scheduleService.deleteSchedule(action.payload.schedule._id).pipe(
      map(() => new DeleteScheduleSuccess(action.payload)),
      catchError(error => of(new DeleteScheduleFailure({ error }))))
    )
  );

  @Effect()
  restoreSchedule$ = this.actions$.pipe(
    ofType(ScheduleActionTypes.RestoreSchedule),
    switchMap((action: RestoreSchedule) => this.scheduleService.restoreSchedule(action.payload.schedule._id).pipe(
      map(() => new RestoreScheduleSuccess(action.payload)),
      catchError(error => of(new RestoreScheduleFailure({ error }))))
    )
  );

  constructor(private actions$: Actions<ScheduleActions>, private scheduleService: ScheduleService, private store: Store<fromSchedule.ScheduleState>) { }
}
