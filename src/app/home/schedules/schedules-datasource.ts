import { DataSource } from '@angular/cdk/collections';
import { MatPaginator, MatSort } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';
import { Schedule } from '../../core/models/schedule.model';
import { ScheduleService } from '../../core/services/schedule.service';

/**
 * Data source for the Favourites view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SchedulesDataSource extends DataSource<Schedule> {
  schedules: Schedule[] = [];

  constructor(private paginator: MatPaginator, private sort: MatSort, private scheduleService: ScheduleService) {
    super();
    if (this.scheduleService) {
      this.loadSchedules();
    }
  }

  loadSchedules(): void {
    this.scheduleService
      .getSchedules()
      .toPromise()
      .then((response: Schedule[]) => this.schedules = response)
      .catch(err => console.warn(err));
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Schedule[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      observableOf(this.schedules),
      this.paginator.page,
      this.sort.sortChange
    ];

    // Set the paginator's length
    this.paginator.length = this.schedules.length;

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.schedules]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: Schedule[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: Schedule[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'theater': return this.compare(a.theater.number, b.theater.number, isAsc);
        case 'movie': return this.compare(a.movie.name, b.movie.name, isAsc);
        case 'date': return this.compareDate(a.date, b.date, isAsc);
        case 'time': return this.compare(a.time, b.time, isAsc);
        case 'price': return this.compare(a.price, b.price, isAsc);
        default: return 0;
      }
    });
  }

  private compare = (a, b, isAsc) => (a < b ? -1 : 1) * (isAsc ? 1 : -1);

  private compareDate = (a, b, isAsc) => (new Date(a) < new Date(b) ? -1 : 1) * (isAsc ? 1 : -1);
}