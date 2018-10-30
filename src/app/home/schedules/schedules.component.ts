import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ScheduleService } from '../../core/services/schedule.service';
import { Schedule } from '../../core/models/schedule.model';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Schedule>;

  displayedColumns = ['theater', 'movie', 'date', 'time', 'price'];

  constructor(
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.scheduleService
      .getSchedules()
      .toPromise()
      .then((response: Schedule[]) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.sortingDataAccessor = (item) => {
          switch (this.dataSource.sort.active) {
            case 'theater': return item.theater.number;
            case 'movie': return item.movie.name;
            case 'date': return item.date;
            case 'time': return item.time;
            case 'price': return item.price;
            default: return 0;
          }
        };
        this.dataSource.filterPredicate = (data, filter) => {
          return (data.theater.number + data.movie.name + data.date + data.time + data.price).trim().toLowerCase().includes(filter.trim().toLowerCase());
        };
      })
      .catch(err => console.warn(err));
  }
}
