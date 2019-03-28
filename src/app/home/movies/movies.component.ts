
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Movie } from './models/movie.model';
import { ScheduleComponent } from '../schedules/schedule/schedule.component';
import { Schedule } from '../schedules/models/schedule.model';
import { Observable, Subscription } from 'rxjs';
import { Store, select, ActionsSubject } from '@ngrx/store';
import * as fromMovie from './reducers/movie.reducer';
import { map } from 'rxjs/operators';
import { LoadMovies } from './actions/movie.actions';
import { ScheduleActionTypes, ScheduleActions } from '../schedules/actions/schedule.actions';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MoviesComponent implements OnInit, OnDestroy {
  private actionsSubjectSubscription: Subscription;
  private dialogRef: MatDialogRef<ScheduleComponent>;
  movies$: Observable<Movie[]>;

  constructor(
    private store: Store<fromMovie.MovieState>,
    private actionsSubject: ActionsSubject,
    private router: Router,
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
    this.actionsSubjectSubscription = this.actionsSubject.subscribe((action: ScheduleActions) => {
      switch (action.type) {
        case ScheduleActionTypes.AddScheduleSuccess: this.onAddedSchedule(action.payload.schedule); return;
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
  }

  private onAddedSchedule(schedule: Schedule): void {
    this.dialogRef.close();
    const snackBarRef = this.snackBar.open(`Schedule for movie "${schedule.movie.name}" was created successfully!`, 'Schedules', { duration: 4000 });
    const snackBarOnActionSubscription: Subscription = snackBarRef.onAction().subscribe(() => {
      this.router.navigateByUrl('/home/schedules');
      snackBarOnActionSubscription.unsubscribe();
    });
  }
}