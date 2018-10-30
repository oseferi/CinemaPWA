import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../core/services/schedule.service';
import { Schedule } from '../../core/models/schedule.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  schedules: any[];

  constructor(
    private scheduleService: ScheduleService
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
}
