import { Component, Input, ViewChild, OnChanges, Output, EventEmitter } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator, MatInput } from '@angular/material';

@Component({
  selector: 'app-generic-table',
  templateUrl: './generic-table.component.html',
  styleUrls: ['./generic-table.component.scss']
})
export class GenericTableComponent implements OnChanges {
  @ViewChild(MatInput) filterInput: MatInput;
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
  @Input()
  includeIdColumn = false;
  @Input()
  clickableRows = false;
  @Output()
  pageChange: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  rowClick: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnChanges() {
    if (this.data && this.data.length && !this.displayedColumns) {
      this.displayedColumns = Object.keys(this.data[0]);
    }
    if (!this.includeIdColumn && this.displayedColumns && this.displayedColumns.includes('id')) {
      this.displayedColumns.splice(this.displayedColumns.indexOf('id'), 1);
    }
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (data: any, sortHeaderId: string): string => { // Ignoring cases for string sort.
      if (typeof data[sortHeaderId] === 'string') {
        return data[sortHeaderId].toLowerCase();
      }
      return data[sortHeaderId];
    };
    this.dataSource.filterPredicate = (data, filter) => Object.values(data).join(' ').toLowerCase().includes(filter.toLowerCase());
    this.applyFilter();
  }

  public applyFilter = () => this.dataSource.filter = this.filterInput && this.filterInput.value;
}