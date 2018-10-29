import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { SchedulesDataSource } from './schedules-datasource';
import { ScheduleService } from '../../core/services/schedule.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: SchedulesDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['theater', 'movie', 'date', 'time', 'price'];

  constructor(
    private scheduleService: ScheduleService
  ) {}

  ngOnInit() {
    this.dataSource = new SchedulesDataSource(this.paginator, this.sort, this.scheduleService);
  }
}
