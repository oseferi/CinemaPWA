
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Movie } from '../../core/models/movie.model';
import { MovieService } from './services/movie.service';
import { ScheduleComponent } from '../schedules/schedule/schedule.component';
import { ScheduleRequest } from '../../core/models/schedule.model';
import { ScheduleService } from '../schedules/services/schedule.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  movies: Movie[];
  dialogRef: MatDialogRef<ScheduleComponent>;

  constructor(
    private router: Router,
    private movieService: MovieService,
    private scheduleService: ScheduleService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.movieService
      .getMovies()
      .toPromise()
      .then((response: Movie[]) => this.movies = response)
      .catch(err => console.warn(err));
  }

  public getAvatarUrl = (url: string) => `url(${url})`;

  public watchTrailer = (url: string) => window.open(url, '_blank');

  public scheduleMovie(movie: Movie) {
    this.dialogRef = this.dialog.open(ScheduleComponent, { data: movie });
    const subscription = this.dialogRef.componentInstance.addedSchedule.subscribe((request: ScheduleRequest) => this.onAddedSchedule(request));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedSchedule(request: ScheduleRequest): void {
    this.scheduleService
      .createSchedule(request)
      .toPromise()
      .then(_ => {
        this.dialogRef.close();
        const snackBarRef = this.snackBar.open(`Schedule created successfully!`, 'Schedules', {
          duration: 4000
        });
        snackBarRef.onAction().subscribe(() => this.router.navigateByUrl('/home/schedules'));
      })
      .catch(err => console.warn(err));
  }
}