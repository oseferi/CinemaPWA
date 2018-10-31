import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../core/services/schedule.service';
import { PageEvent, MatDialogRef, MatDialog, MatSnackBar } from '@angular/material';
import { ScheduleComponent } from './schedule/schedule.component';
import { ScheduleRequest, Schedule } from '../../core/models/schedule.model';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  schedules: any[];
  dialogRef: MatDialogRef<ScheduleComponent>;

  constructor(
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.scheduleService
      .getSchedules()
      .toPromise()
      .then((response: Schedule[]) => {
        this.schedules = response.map((schedule: Schedule) => {
          return {
            id: schedule.id,
            theater: schedule.theater.number,
            movie: schedule.movie.name,
            date: schedule.date,
            time: schedule.time,
            price: schedule.price
          };
        });
      })
      .catch(err => console.warn(err));
  }

  public onPageChange(event: PageEvent) {
    console.log(event);
  }

  public add(): void {
    this.dialogRef = this.dialog.open(ScheduleComponent);
    const subscription = this.dialogRef.componentInstance.addedSchedule.subscribe((request: ScheduleRequest) => this.onAddedSchedule(request));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedSchedule(schedule: ScheduleRequest): void {
    this.scheduleService
      .createSchedule(schedule)
      .toPromise()
      .then((response: Schedule) => {
        this.schedules = [...this.schedules, { ...response, theater: response.theater.number, movie: response.movie.name }];
        this.dialogRef.close();
      })
      .catch(err => console.warn(err));
  }

  private onUpdatedSchedule(request: { id: number, schedule: ScheduleRequest }): void {
    this.scheduleService
      .updateSchedule(request.id, request.schedule)
      .toPromise()
      .then((response: Schedule) => {
        this.schedules = this.schedules.map((schedule: Schedule) => schedule.id === request.id ? { ...schedule, ...response, theater: response.theater.number, movie: response.movie.name } : schedule );
        this.dialogRef.close();
      })
      .catch(err => console.warn(err));
  }

  private onDeletedSchedule(id: number): void {
    const targetSchedule: Schedule = this.schedules.find((schedule: Schedule) => schedule.id === id);
    const targetScheduleIndex = this.schedules.indexOf(targetSchedule);
    this.scheduleService
      .deleteSchedule(id)
      .toPromise()
      .then(() => {
        this.dialogRef.close();
        const snackBarRef = this.snackBar.open(`Schedule for movie: "${targetSchedule.movie}" deleted successfully!`, 'Undo', {
          duration: 4000
        });
        snackBarRef.onAction().subscribe(() => {
          this.scheduleService
            .restoreSchedule(id)
            .toPromise()
            .then(() => this.schedules = [...this.schedules.slice(0, targetScheduleIndex), targetSchedule, ...this.schedules.slice(targetScheduleIndex)]) // Adds to original position.
            .catch(err => console.warn(err));
        });
        this.schedules = this.schedules.filter((schedule: Schedule) => schedule !== targetSchedule);
      })
        .catch(err => console.warn(err));
  }

  public onRowClick(schedule: Schedule): void {
    this.dialogRef = this.dialog.open(ScheduleComponent, { data: schedule });
    const updateSubscription = this.dialogRef.componentInstance.updatedSchedule.subscribe((request: { id: number, schedule: ScheduleRequest }) => this.onUpdatedSchedule(request));
    const deleteSubscription = this.dialogRef.componentInstance.deletedSchedule.subscribe((id: number) => this.onDeletedSchedule(id));
    this.dialogRef.afterClosed().subscribe(() => {
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    });
  }
}