import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ScheduleRequest, Schedule } from '../models/schedule.model';
import { Movie } from '../../movies/models/movie.model';
import { Theater } from '../../theaters/models/theater.model';
import { Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import * as fromTheater from '../../theaters/reducers/theater.reducer';
import * as fromMovie from '../../movies/reducers/movie.reducer';
import { State } from '../../../reducers';
import { map } from 'rxjs/operators';
import { LoadTheaters } from '../../theaters/actions/theater.actions';
import { LoadMovies } from '../../movies/actions/movie.actions';
import { UpdateSchedule, AddSchedule, DeleteSchedule } from '../actions/schedule.actions';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduleComponent implements OnInit {
  today = new Date();
  preselectedMovie: Movie;
  editMode = false;
  request: ScheduleRequest = new ScheduleRequest();
  theaters$: Observable<Theater[]>;
  movies$: Observable<Movie[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Schedule | Movie,
    private store: Store<State>
  ) { }

  ngOnInit(): void {
    this.loadDropdownData();
    this.buildForm();
  }

  private buildForm(): void {
    this.request.formGroup.get('date').setValue(`${this.today.getFullYear()}-${this.today.getMonth() + 1 < 10 ? '0' + (this.today.getMonth() + 1) : this.today.getMonth() + 1}-${this.today.getDate() < 10 ? '0' + this.today.getDate() : this.today.getDate()}`);
    this.request.formGroup.get('time').setValue(`${this.today.getHours() < 10 ? '0' + this.today.getHours() : this.today.getHours()}:${this.today.getMinutes() < 10 ? '0' + this.today.getMinutes() : this.today.getMinutes()}`);
    if (this.data) {
      if ((this.data as Schedule).theater) {
        this.request.formGroup.patchValue(this.data);
        this.editMode = true;
      } else if ((this.data as Movie).name) {
        this.preselectedMovie = this.data as Movie;
        this.request.formGroup.get('movie').setValue(this.preselectedMovie);
      }
    }
  }

  private loadDropdownData(): void {
    this.theaters$ = this.store.pipe(
      select(fromTheater.selectAll),
      map((theaters: Theater[]) => {
        if (!theaters.length) {
          this.store.dispatch(new LoadTheaters());
        }
        return theaters;
      })
    );
    this.movies$ = this.store.pipe(
      select(fromMovie.selectAll),
      map((movies: Movie[]) => {
        if (!movies.length) {
          this.store.dispatch(new LoadMovies());
        }
        return movies;
      })
    );
  }

  public save(): void {
    const date = new Date(this.request.formGroup.get('date').value);
    this.request.formGroup.get('date').setValue(`${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`);
    if (this.editMode) {
      this.store.dispatch(new UpdateSchedule({ schedule: { id: this.data._id, changes: this.request.formGroup.value } }));
    } else {
      this.store.dispatch(new AddSchedule({ schedule: this.request.formGroup.value }));
    }
  }

  public delete(): void {
    this.store.dispatch(new DeleteSchedule({ schedule: this.data as Schedule }));
  }

  public dropdownCompareFn = (obj1: any, obj2: any): boolean => obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
}