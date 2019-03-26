
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Movie } from './models/movie.model';
import { ScheduleComponent } from '../schedules/schedule/schedule.component';
import { Schedule, ScheduleRequest } from '../schedules/models/schedule.model';
import { ScheduleService } from '../schedules/services/schedule.service';
import { Observable, Subscription } from 'rxjs';
import { Store, select, ActionsSubject, Action } from '@ngrx/store';
import * as fromMovie from './reducers/movie.reducer';
import { map } from 'rxjs/operators';
import { LoadMovies } from './actions/movie.actions';
import { ScheduleActionTypes, AddScheduleSuccess, AddSchedule } from '../schedules/actions/schedule.actions';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit, OnDestroy {
  private actionsSubjectSubscription: Subscription;
  private dialogRef: MatDialogRef<ScheduleComponent>;
  movies$: Observable<Movie[]>;

  constructor(
    private store: Store<fromMovie.MovieState>,
    private actionsSubject: ActionsSubject,
    private router: Router,
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.movies$ = this.store.pipe(
      select(fromMovie.selectAll),
      map((movies: Movie[]) => {
        if (!movies.length) {
          this.store.dispatch(new LoadMovies());
        }
        return movies;
      })
    );
    this.actionsSubjectSubscription = this.actionsSubject.subscribe((action: Action) => {
      switch (action.type) {
        case ScheduleActionTypes.AddScheduleSuccess: this.onAddedSchedule((action as AddScheduleSuccess).payload.schedule); return;
      }
    });
  }

  ngOnDestroy(): void {
    this.actionsSubjectSubscription.unsubscribe();
  }

  public getAvatarUrl = (url: string) => `url(${url})`;

  public watchTrailer = (url: string) => window.open(url, '_blank');

  public scheduleMovie(movie: Movie) {
    this.dialogRef = this.dialog.open(ScheduleComponent, { data: movie });
    const subscription = this.dialogRef.componentInstance.addedSchedule.subscribe((schedule: ScheduleRequest) => this.store.dispatch(new AddSchedule({ schedule })));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedSchedule(schedule: Schedule): void {
    this.dialogRef.close();
    const snackBarRef = this.snackBar.open(`Schedule for movie "${schedule.movie.name}" was created successfully!`, 'Schedules', {
      duration: 4000
    });
    const snackBarOnActionSubscription: Subscription = snackBarRef.onAction().subscribe(() => {
      this.router.navigateByUrl('/home/schedules');
      snackBarOnActionSubscription.unsubscribe();
    });
  }
}