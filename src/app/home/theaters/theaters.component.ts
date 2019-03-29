import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import {  MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { TheaterComponent } from './theater/theater.component';
import * as fromTheater from './reducers/theater.reducer';
import { Store, ActionsSubject } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoadTheaters, TheaterActionTypes, TheaterActions, RestoreTheater } from './actions/theater.actions';
import { Theater } from './models/theater.model';

@Component({
  selector: 'app-theaters',
  templateUrl: './theaters.component.html',
  styleUrls: ['./theaters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TheatersComponent implements OnInit, OnDestroy {
  private actionsSubjectSubscription: Subscription;
  private dialogRef: MatDialogRef<TheaterComponent>;
  theaters$: Observable<Theater[]>;
  displayedColumns: string[] = ['number', 'floor', 'capacity'];

  constructor(
    private store: Store<fromTheater.TheaterState>,
    private actionsSubject: ActionsSubject,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadTheaters());
    this.theaters$ = this.store.select(fromTheater.selectAll);
    this.actionsSubjectSubscription = this.actionsSubject.subscribe((action: TheaterActions) => {
      switch (action.type) {
        case TheaterActionTypes.AddTheaterSuccess:
        case TheaterActionTypes.UpdateTheaterSuccess: this.dialogRef.close(); return;
        case TheaterActionTypes.DeleteTheaterSuccess: this.dialogRef.close(); this.showUndoSnackbar(action.payload.theater); return;
      }
    });
  }

  ngOnDestroy(): void {
    this.actionsSubjectSubscription.unsubscribe();
  }

  private showUndoSnackbar(theater: Theater): void {
    const snackBarRef = this.snackBar.open(`Theater number ${theater.number} deleted successfully!`, 'Undo', { duration: 4000 });
    snackBarRef.onAction().subscribe(() => this.store.dispatch(new RestoreTheater({ theater })));
  }

  public add(): void {
    this.dialogRef = this.dialog.open(TheaterComponent);
  }

  public onRowClick(selectedTheater: Theater): void {
    this.dialogRef = this.dialog.open(TheaterComponent, { data: selectedTheater });
  }
}