import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { TheaterComponent } from './theater/theater.component';
import * as fromTheater from './reducers/theater.reducer';
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { LoadTheaters, TheaterActionTypes, TheaterActions, RestoreTheater, AddTheater, UpdateTheater, DeleteTheater } from './actions/theater.actions';
import { map } from 'rxjs/operators';
import { Theater, TheaterRequest } from './models/theater.model';

@Component({
  selector: 'app-theaters',
  templateUrl: './theaters.component.html',
  styleUrls: ['./theaters.component.scss']
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
    this.theaters$ = this.store.pipe(
      select(fromTheater.selectAll),
      map((theaters: Theater[]) => {
        if (!theaters.length) {
          this.store.dispatch(new LoadTheaters());
        }
        return theaters;
      })
    );
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

  public onPageChange(event: PageEvent) {
    console.log(event);
  }

  public add(): void {
    this.dialogRef = this.dialog.open(TheaterComponent);
    const subscription = this.dialogRef.componentInstance.addedTheater.subscribe((request: TheaterRequest) => this.onAddedTheater(request));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedTheater(theater: TheaterRequest): void {
    this.store.dispatch(new AddTheater({ theater }));
  }

  private onUpdatedTheater(request: { id: string, theater: TheaterRequest }): void {
    this.store.dispatch(new UpdateTheater({ theater: { id: request.id, changes: request.theater.formGroup.value } }));
  }

  private onDeletedTheater(theater: Theater): void {
    this.store.dispatch(new DeleteTheater({ theater }))
  }

  private showUndoSnackbar(theater: Theater): void {
    const snackBarRef = this.snackBar.open(`Theater number ${theater.number} deleted successfully!`, 'Undo', { duration: 4000 });
    snackBarRef.onAction().subscribe(() => this.store.dispatch(new RestoreTheater({ theater })));
  }

  public onRowClick(theater: Theater): void {
    this.dialogRef = this.dialog.open(TheaterComponent, { data: theater });
    const updateSubscription = this.dialogRef.componentInstance.updatedTheater.subscribe((request: { id: string, theater: TheaterRequest }) => this.onUpdatedTheater(request));
    const deleteSubscription = this.dialogRef.componentInstance.deletedTheater.subscribe((theaterToDelete: Theater) => this.onDeletedTheater(theaterToDelete));
    this.dialogRef.afterClosed().subscribe(() => {
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    });
  }
}