import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { CategoryComponent } from './category/category.component';
import { Category, CategoryRequest } from './models/category.model';
import { Observable, Subscription } from 'rxjs';
import { Store, ActionsSubject, select } from '@ngrx/store';
import * as fromCategory from './reducers/category.reducer';
import { LoadCategories, DeleteCategory, AddCategory, UpdateCategory, CategoryActions, CategoryActionTypes, RestoreCategory } from './actions/category.actions';
import { map } from 'rxjs/operators';
import { Update } from '@ngrx/entity';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
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
    this.categories$ = this.store.pipe(
      select(fromCategory.selectAll),
      map((categories: Category[]) => {
        if (!categories.length) {
          this.store.dispatch(new LoadCategories());
        }
        return categories;
      })
    );
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

  public onPageChange(event: PageEvent) {
    console.log(event);
  }

  public add(): void {
    this.dialogRef = this.dialog.open(CategoryComponent);
    const subscription = this.dialogRef.componentInstance.addedCategory.subscribe((category: CategoryRequest) => this.onAddedCategory(category));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedCategory(category: CategoryRequest): void {
    this.store.dispatch(new AddCategory({ category }));
  }

  private onUpdatedCategory(category: Update<Category>): void {
    this.store.dispatch(new UpdateCategory({ category }));
  }

  private onDeletedCategory(category: Category): void {
    this.store.dispatch(new DeleteCategory({ category }));
  }

  private showUndoSnackbar(category: Category): void {
    const snackBarRef = this.snackBar.open(`Category "${category.name}" deleted successfully!`, 'Undo', { duration: 4000 });
    snackBarRef.onAction().subscribe(() => this.store.dispatch(new RestoreCategory({ category })));
  }

  public onRowClick(selectedCategory: Category): void {
    this.dialogRef = this.dialog.open(CategoryComponent, { data: selectedCategory });
    const updateSubscription = this.dialogRef.componentInstance.updatedCategory.subscribe((category: Update<Category>) => this.onUpdatedCategory(category));
    const deleteSubscription = this.dialogRef.componentInstance.deletedCategory.subscribe((category: Category) => this.onDeletedCategory(category));
    this.dialogRef.afterClosed().subscribe(() => {
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    });
  }
}