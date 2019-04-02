import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { CategoryComponent } from './category/category.component';
import { Category } from './models/category.model';
import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromCategory from './reducers/category.reducer';
import { LoadCategories, CategoryActions, CategoryActionTypes, RestoreCategory } from './actions/category.actions';
import { SubscriptionService } from '../../shared/subscription.service';
import { take } from 'rxjs/operators';
import { Actions } from '@ngrx/effects';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesComponent implements OnInit, OnDestroy {
  private actionsSubscription: Subscription;
  private dialogRef: MatDialogRef<CategoryComponent>;
  categories$: Observable<Category[]>;
  displayedColumns: string[] = ['name'];

  constructor(
    private store: Store<fromCategory.CategoryState>,
    private actions: Actions,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private subscriptionService: SubscriptionService
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new LoadCategories());
    this.categories$ = this.store.select(fromCategory.selectAll);
    this.actionsSubscription = this.actions.subscribe((action: CategoryActions) => {
      switch (action.type) {
        case CategoryActionTypes.AddCategorySuccess:
        case CategoryActionTypes.UpdateCategorySuccess: this.dialogRef.close(); return;
        case CategoryActionTypes.DeleteCategorySuccess: this.dialogRef.close(); this.showUndoSnackbar(action.payload.category); return;
      }
    });
  }

  ngOnDestroy(): void {
    this.actionsSubscription.unsubscribe();
    this.subscriptionService.unsubscribeComponent$.next();
  }

  private showUndoSnackbar(category: Category): void {
    const snackBarRef = this.snackBar.open(`Category "${category.name}" deleted successfully!`, 'Undo', { duration: 4000 });
    snackBarRef.onAction().pipe(take(1)).subscribe(() => this.store.dispatch(new RestoreCategory({ category })));
  }

  public add(): void {
    this.dialogRef = this.dialog.open(CategoryComponent);
  }

  public onRowClick(category: Category): void {
    this.dialogRef = this.dialog.open(CategoryComponent, { data: category });
  }
}