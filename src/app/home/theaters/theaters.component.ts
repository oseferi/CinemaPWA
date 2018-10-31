import { Component, OnInit } from '@angular/core';
import { TheaterService } from '../../core/services/theater.service';
import { Theater, TheaterRequest } from '../../core/models/theater.model';
import { PageEvent, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { TheaterComponent } from './theater/theater.component';

@Component({
  selector: 'app-theaters',
  templateUrl: './theaters.component.html',
  styleUrls: ['./theaters.component.scss']
})
export class TheatersComponent implements OnInit {
  theaters: any[];
  dialogRef: MatDialogRef<TheaterComponent>;

  constructor(
    private theaterService: TheaterService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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

  public add(): void {
    this.dialogRef = this.dialog.open(TheaterComponent);
    const subscription = this.dialogRef.componentInstance.addedTheater.subscribe((request: TheaterRequest) => this.onAddedTheater(request));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedTheater(theater: TheaterRequest): void {
    this.theaterService
      .createTheater(theater)
      .toPromise()
      .then((response: Theater) => {
        this.theaters = [...this.theaters, response];
        this.dialogRef.close();
      })
      .catch(err => console.warn(err));
  }

  private onUpdatedTheater(request: { id: number, theater: TheaterRequest }): void {
    this.theaterService
      .updateTheater(request.id, request.theater)
      .toPromise()
      .then((response: Theater) => {
        this.theaters = this.theaters.map((theater: Theater) => theater.id === request.id ? { ...theater, ...response } : theater );
        this.dialogRef.close();
      })
      .catch(err => console.warn(err));
  }

  private onDeletedTheater(id: number): void {
    const targetTheater: Theater = this.theaters.find((theater: Theater) => theater.id === id);
    const targetTheaterIndex = this.theaters.indexOf(targetTheater);
    this.theaterService
      .deleteTheater(id)
      .toPromise()
      .then(() => {
        this.dialogRef.close();
        const snackBarRef = this.snackBar.open(`Theater no. "${targetTheater.number}" deleted successfully!`, 'Undo', {
          duration: 4000
        });
        snackBarRef.onAction().subscribe(() => {
          this.theaterService
            .restoreTheater(id)
            .toPromise()
            .then(() => this.theaters = [...this.theaters.slice(0, targetTheaterIndex), targetTheater, ...this.theaters.slice(targetTheaterIndex)]) // Adds to original position.
            .catch(err => console.warn(err));
        });
        this.theaters = this.theaters.filter((theater: Theater) => theater !== targetTheater);
      })
        .catch(err => console.warn(err));
  }

  public onRowClick(theater: Theater): void {
    this.dialogRef = this.dialog.open(TheaterComponent, { data: theater });
    const updateSubscription = this.dialogRef.componentInstance.updatedTheater.subscribe((request: { id: number, theater: TheaterRequest }) => this.onUpdatedTheater(request));
    const deleteSubscription = this.dialogRef.componentInstance.deletedTheater.subscribe((id: number) => this.onDeletedTheater(id));
    this.dialogRef.afterClosed().subscribe(() => {
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    });
  }
}