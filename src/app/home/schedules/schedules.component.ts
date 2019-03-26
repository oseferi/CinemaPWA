import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleRequest, Schedule } from './models/schedule.model';
import { AddSchedule, UpdateSchedule, DeleteSchedule, LoadSchedules, ScheduleActions, ScheduleActionTypes, RestoreSchedule } from './actions/schedule.actions';
import { Store, ActionsSubject, select } from '@ngrx/store';
import * as fromSchedule from './reducers/schedule.reducer';
import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
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

  public onPageChange(event: PageEvent) {
    console.log(event);
  }

  public add(): void {
    this.dialogRef = this.dialog.open(ScheduleComponent);
    const subscription = this.dialogRef.componentInstance.addedSchedule.subscribe((schedule: ScheduleRequest) => this.onAddedSchedule(schedule));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedSchedule(schedule: ScheduleRequest): void {
    this.store.dispatch(new AddSchedule({ schedule }));
  }

  private onUpdatedSchedule(schedule: Update<Schedule>): void {
    this.store.dispatch(new UpdateSchedule({ schedule }));
  }

  private onDeletedSchedule(schedule: Schedule): void {
    this.store.dispatch(new DeleteSchedule({ schedule }));
  }

  private showUndoSnackbar(schedule: Schedule): void {
    const snackBarRef = this.snackBar.open(`Schedule for movie "${schedule.movie.name}" deleted successfully!`, 'Undo', { duration: 4000 });
    snackBarRef.onAction().subscribe(() => this.store.dispatch(new RestoreSchedule({ schedule })));
  }

  public onRowClick(selectedSchedule: Schedule): void {
    this.dialogRef = this.dialog.open(ScheduleComponent, { data: selectedSchedule });
    const updateSubscription = this.dialogRef.componentInstance.updatedSchedule.subscribe((schedule: Update<Schedule>) => this.onUpdatedSchedule(schedule));
    const deleteSubscription = this.dialogRef.componentInstance.deletedSchedule.subscribe((schedule: Schedule) => this.onDeletedSchedule(schedule));
    this.dialogRef.afterClosed().subscribe(() => {
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    });
  }
}