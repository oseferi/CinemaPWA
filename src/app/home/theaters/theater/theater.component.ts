import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Theater, TheaterRequest } from '../models/theater.model';
import * as fromTheater from '../reducers/theater.reducer';
import { Store } from '@ngrx/store';
import { UpdateTheater, AddTheater, DeleteTheater } from '../actions/theater.actions';

@Component({
  selector: 'app-theater',
  templateUrl: './theater.component.html',
  styleUrls: ['./theater.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TheaterComponent implements OnInit {
  editMode = false;
  request: TheaterRequest = new TheaterRequest();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Theater,
    private store: Store<fromTheater.TheaterState>
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.request.formGroup.patchValue(this.data);
      this.editMode = true;
    }
  }

  public save(): void {
    if (this.editMode) {
      this.store.dispatch(new UpdateTheater({ theater: { id: this.data.id, changes: this.request.formGroup.value } }));
    } else {
      this.store.dispatch(new AddTheater({ theater: this.request.formGroup.value }));
    }
  }

  public delete(): void {
    this.store.dispatch(new DeleteTheater({ theater: this.data }));
  }
}
