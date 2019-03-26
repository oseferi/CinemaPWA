import { Movie } from './movie.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Theater } from '../../home/theaters/models/theater.model';

export class Schedule {
  id: number;
  theater: Theater;
  movie: Movie;
  date: string;
  time: string;
  price: number;
}

export class ScheduleRequest {
  formGroup: FormGroup = new FormGroup({
    theater: new FormControl('', Validators.required),
    movie: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(1), Validators.max(999)])
  });
}