import { Component, OnInit, Inject, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';
import { Category, CategoryRequest } from '../models/category.model';
import { Store } from '@ngrx/store';
import * as fromCategory from '../reducers/category.reducer';
import { UpdateCategory, AddCategory, DeleteCategory, CategoryActions, CategoryActionTypes } from '../actions/category.actions';
import { SubscriptionService } from '../../../shared/subscription.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Actions } from '@ngrx/effects';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit, OnDestroy {
  private actionsSubscription: Subscription;
  private snackBarRef: MatSnackBarRef<SimpleSnackBar>;
  editMode = false;
  request: CategoryRequest = new CategoryRequest();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Category,
    private store: Store<fromCategory.CategoryState>,
    private actions: Actions,
    private matSnackBar: MatSnackBar,
    private subscriptionService: SubscriptionService
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.request.formGroup.patchValue(this.data);
      this.editMode = true;
    }
    this.actionsSubscription = this.actions.subscribe((action: CategoryActions) => {
      switch (action.type) {
        case CategoryActionTypes.AddCategory:
        case CategoryActionTypes.UpdateCategory:
        case CategoryActionTypes.DeleteCategory: this.request.formGroup.markAsPending(); return;
        case CategoryActionTypes.AddCategoryFailure:
          this.snackBarRef = this.matSnackBar.open(`Couldn't create the Category "${this.request.formGroup.get('name').value}"! ${action.payload.error.status !== undefined ? `Error ${action.payload.error.status}` : ''}`, 'Retry', { duration: 4000 });
          this.snackBarRef.onAction().pipe(take(1)).subscribe(() => this.store.dispatch(new AddCategory({ category: this.request.formGroup.value })));
          this.request.formGroup.updateValueAndValidity();
          return;
        case CategoryActionTypes.UpdateCategoryFailure:
          this.snackBarRef = this.matSnackBar.open(`Couldn't update the Category "${this.data.name}" to "${this.request.formGroup.get('name').value}"! ${action.payload.error.status !== undefined ? `Error ${action.payload.error.status}` : ''}`, 'Retry', { duration: 4000 });
          this.snackBarRef.onAction().pipe(take(1)).subscribe(() => this.store.dispatch(new UpdateCategory({ category: { id: this.data.id, changes: this.request.formGroup.value } })));
          this.request.formGroup.updateValueAndValidity();
          return;
        case CategoryActionTypes.DeleteCategoryFailure:
          this.snackBarRef = this.matSnackBar.open(`Couldn't create the Category "${this.data.name}"! ${action.payload.error.status !== undefined ? `Error ${action.payload.error.status}` : ''}`, 'Retry', { duration: 4000 });
          this.snackBarRef.onAction().pipe(take(1)).subscribe(() => this.store.dispatch(new DeleteCategory({ category: this.data })));
          this.request.formGroup.updateValueAndValidity();
          return;
        default: this.request.formGroup.updateValueAndValidity(); return;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
    if (this.request.formGroup.pending) {
      this.matSnackBar.open('Cancelled', null, { duration: 4000 });
    }
    this.actionsSubscription.unsubscribe();
    this.subscriptionService.unsubscribeComponent$.next();
  }

  public save(): void {
    if (this.editMode) {
      this.store.dispatch(new UpdateCategory({ category: { id: this.data._id, changes: this.request.formGroup.value } }));
    } else {
      this.store.dispatch(new AddCategory({ category: this.request.formGroup.value }));
    }
  }

  public delete(): void {
    this.store.dispatch(new DeleteCategory({ category: this.data }));
  }
}
