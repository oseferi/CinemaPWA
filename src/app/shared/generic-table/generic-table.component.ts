import { Component, Input, ViewChild, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnChanges {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<any>;
  @Input()
  data: any[];
  @Input()
  displayedColumns: string[];
  @Input()
  filtering = true;
  @Input()
  pagination = true;
  @Input()
  sorting = true;
  @Input()
  pageSize = 10;
  @Input()
  pageSizeOptions = [10, 25, 50, 100];
  @Output()
  pageChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnChanges() {
    if (this.data && this.data.length && !this.displayedColumns) {
      this.displayedColumns = Object.keys(this.data[1]);
    }
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data, filter) => Object.values(data).join(' ').toLowerCase().includes(filter.toLowerCase());
  }
}