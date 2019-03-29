import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { CategoryComponent } from './category/category.component';
import { Category } from './models/category.model';
import { Observable, Subscription } from 'rxjs';
import { Store, ActionsSubject } from '@ngrx/store';
import * as fromCategory from './reducers/category.reducer';
import { LoadCategories, CategoryActions, CategoryActionTypes, RestoreCategory } from './actions/category.actions';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private actionsSubjectSubscription: Subscription;
  private dialogRef: MatDialogRef<CategoryComponent>;
  categories$: Observable<Category[]>;
  displayedColumns: string[] = ['name'];

  constructor(
    private store: Store<fromCategory.CategoryState>,
    private actionsSubject: ActionsSubject,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadCategories());
    this.categories$ = this.store.select(fromCategory.selectAll);
    this.actionsSubjectSubscription = this.actionsSubject.subscribe((action: CategoryActions) => {
      switch (action.type) {
        case CategoryActionTypes.AddCategorySuccess:
        case CategoryActionTypes.UpdateCategorySuccess: this.dialogRef.close(); return;
        case CategoryActionTypes.DeleteCategorySuccess: this.dialogRef.close(); this.showUndoSnackbar(action.payload.category); return;
      }
    });
  }

  ngOnDestroy(): void {
    this.actionsSubjectSubscription.unsubscribe();
  }

  private showUndoSnackbar(category: Category): void {
    const snackBarRef = this.snackBar.open(`Category "${category.name}" deleted successfully!`, 'Undo', { duration: 4000 });
    snackBarRef.onAction().subscribe(() => this.store.dispatch(new RestoreCategory({ category })));
  }

  public add(): void {
    this.dialogRef = this.dialog.open(CategoryComponent);
  }

  public onRowClick(category: Category): void {
    this.dialogRef = this.dialog.open(CategoryComponent, { data: category });
  }
}