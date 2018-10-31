import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ScheduleRequest, Schedule } from '../../../core/models/schedule.model';
import { Theater } from '../../../core/models/theater.model';
import { TheaterService } from '../../../core/services/theater.service';
import { Movie } from '../../../core/models/movie.model';
import { MovieService } from '../../../core/services/movie.service';
import { ScheduleService } from '../../../core/services/schedule.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  today = new Date();
  preselectedMovie: Movie;
  editMode = false;
  request: ScheduleRequest = new ScheduleRequest();
  theaters: Theater[];
  movies: Movie[];
  @Output()
  addedSchedule: EventEmitter<ScheduleRequest> = new EventEmitter<ScheduleRequest>();
  @Output()
  updatedSchedule: EventEmitter<{ id: number, schedule: ScheduleRequest }> = new EventEmitter<{ id: number, schedule: ScheduleRequest }>();
  @Output()
  deletedSchedule: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Schedule | Movie,
    private theaterService: TheaterService,
    private movieService: MovieService,
    private scheduleService: ScheduleService
  ) { }

  ngOnInit(): void {
    this.buildForm();
  }

  private async buildForm(): Promise<void> {
    this.request.formGroup.get('date').setValue(`${this.today.getFullYear()}-${this.today.getMonth() + 1 < 10 ? '0' + (this.today.getMonth() + 1) : this.today.getMonth() + 1}-${this.today.getDate() < 10 ? '0' + this.today.getDate() : this.today.getDate()}`);
    this.request.formGroup.get('time').setValue(`${this.today.getHours() < 10 ? '0' + this.today.getHours() : this.today.getHours()}:${this.today.getMinutes() < 10 ? '0' + this.today.getMinutes() : this.today.getMinutes()}`);
    await this.loadDropdownData();
    if (this.data) {
      if ((this.data as Schedule).theater) {
        this.scheduleService
          .getSchedule(this.data.id)
          .toPromise()
          .then((response: Schedule) => {
            this.request.formGroup.patchValue(response);
            this.editMode = true;
          })
          .catch(err => console.warn(err));
      } else if ((this.data as Movie).name) {
        this.preselectedMovie = this.data as Movie;
        this.request.formGroup.get('movie').setValue(this.preselectedMovie);
      }
    }
  }

  private async loadDropdownData(): Promise<void> {
    await this.theaterService
    .getTheaters()
    .toPromise()
    .then((response: Theater[]) => this.theaters = response)
    .catch(err => console.warn(err));
    await this.movieService
    .getMovies()
    .toPromise()
    .then((response: Movie[]) => this.movies = response)
    .catch(err => console.warn(err));
  }

  public save(): void {
    const date = new Date(this.request.formGroup.get('date').value);
    this.request.formGroup.get('date').setValue(`${date.getFullYear()}-${date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`);
    if (this.editMode) {
      this.updatedSchedule.emit({ id: this.data.id, schedule: this.request });
    } else {
      this.addedSchedule.emit(this.request);
    }
  }

  public delete(): void {
    this.deletedSchedule.emit(this.data.id);
  }

  public dropdownCompareFn = (obj1: any, obj2: any): boolean => obj1 && obj2 ? obj1.id === obj2.id : obj1 === obj2;
}