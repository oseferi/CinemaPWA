import { Component, OnInit } from '@angular/core';
import { TheaterService } from '../../core/services/theater.service';
import { Theater } from '../../core/models/theater.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-theaters',
  templateUrl: './theaters.component.html',
  styleUrls: ['./theaters.component.scss']
})
export class TheatersComponent implements OnInit {
  theaters: any[];

  constructor(
    private theaterService: TheaterService
  ) {}

  ngOnInit(): void {
    this.theaterService
      .getTheaters()
      .toPromise()
      .then((response: Theater[]) => {
        this.theaters = response.map((theater: Theater) => {
          return {
            id: theater.id,
            number: theater.number,
            floor: theater.floor,
            capacity: theater.capacity
          };
        });
      })
      .catch(err => console.warn(err));
  }

  public onPageChange(event: PageEvent) {
    console.log(event);
  }
}