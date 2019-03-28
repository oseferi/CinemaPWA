import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { ScheduleComponent } from './schedule/schedule.component';
import { Schedule } from './models/schedule.model';
import { LoadSchedules, ScheduleActions, ScheduleActionTypes, RestoreSchedule } from './actions/schedule.actions';
import { Store, ActionsSubject, select } from '@ngrx/store';
import * as fromSchedule from './reducers/schedule.reducer';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SchedulesComponent implements OnInit, OnDestroy {
  private actionsSubjectSubscription: Subscription;
  private dialogRef: MatDialogRef<ScheduleComponent>;
  schedules$: Observable<Schedule[]>;
  displayedColumns: string[] = ['movie.name', 'theater.number', 'date', 'time', 'price'];

  constructor(
    private store: Store<fromSchedule.ScheduleState>,
    private actionsSubject: ActionsSubject,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.schedules$ = this.store.pipe(
      select(fromSchedule.selectAll),
      map((schedules: Schedule[]) => {
        if (!schedules.length) {
          this.store.dispatch(new LoadSchedules());
        }
        return schedules;
      })
    );
    this.actionsSubjectSubscription = this.actionsSubject.subscribe((action: ScheduleActions) => {
      switch (action.type) {
        case ScheduleActionTypes.AddScheduleSuccess:
        case ScheduleActionTypes.UpdateScheduleSuccess: this.dialogRef.close(); return;
        case ScheduleActionTypes.DeleteScheduleSuccess: this.dialogRef.close(); this.showUndoSnackbar(action.payload.schedule); return;
      }
    });
  }

  ngOnDestroy(): void {
    this.actionsSubjectSubscription.unsubscribe();
  }

  private showUndoSnackbar(schedule: Schedule): void {
    const snackBarRef = this.snackBar.open(`Schedule for movie "${schedule.movie.name}" deleted successfully!`, 'Undo', { duration: 4000 });
    snackBarRef.onAction().subscribe(() => this.store.dispatch(new RestoreSchedule({ schedule })));
  }

  public add(): void {
    this.dialogRef = this.dialog.open(ScheduleComponent);
  }

  public onRowClick(selectedSchedule: Schedule): void {
    this.dialogRef = this.dialog.open(ScheduleComponent, { data: selectedSchedule });
  }
}