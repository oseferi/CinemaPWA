import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Theater, TheaterRequest } from '../models/theater.model';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.scss']
})
export class TheaterComponent implements OnInit {
  editMode = false;
  request: TheaterRequest = new TheaterRequest();
  @Output()
  addedTheater: EventEmitter<TheaterRequest> = new EventEmitter<TheaterRequest>();
  @Output()
  updatedTheater: EventEmitter<Update<Theater>> = new EventEmitter<Update<Theater>>();
  @Output()
  deletedTheater: EventEmitter<Theater> = new EventEmitter<Theater>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Theater
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.request.formGroup.patchValue(this.data);
      this.editMode = true;
    }
  }

  public save(): void {
    if (this.editMode) {
      this.updatedTheater.emit({ id: this.data.id, changes: this.request.formGroup.value });
    } else {
      this.addedTheater.emit(this.request);
    }
  }

  public delete(): void {
    this.deletedTheater.emit(this.data);
  }
}
