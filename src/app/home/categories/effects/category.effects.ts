import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, withLatestFrom, filter, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadCategoriesFailure, LoadCategoriesSuccess, CategoryActionTypes, CategoryActions, AddCategory, AddCategorySuccess, AddCategoryFailure, UpdateCategory, UpdateCategorySuccess, UpdateCategoryFailure, DeleteCategory, DeleteCategorySuccess, DeleteCategoryFailure, RestoreCategory, RestoreCategorySuccess, RestoreCategoryFailure } from '../actions/category.actions';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Store } from '@ngrx/store';
import * as fromCategory from '../reducers/category.reducer';
import { SubscriptionService } from '../../../shared/subscription.service';

@Injectable()
export class CategoryEffects {

  @Effect()
  loadCategories$ = this.actions$.pipe(
    ofType(CategoryActionTypes.LoadCategories),
    withLatestFrom(this.store.select(fromCategory.selectCategoriesLoaded)),
    filter(([action, categoriesLoaded]) => !categoriesLoaded),
    switchMap(() => this.categoryService.getCategories().pipe(
        map((response: Category[]) => new LoadCategoriesSuccess({ categories: response })),
        catchError(error => of(new LoadCategoriesFailure({ error }))),
        takeUntil(this.subscriptionService.unsubscribe$)
      )
    )
  );

  @Effect()
  addCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.AddCategory),
    switchMap((action: AddCategory) => this.categoryService.createCategory(action.payload.category).pipe(
        map((response: Category) => new AddCategorySuccess({ category: response })),
        catchError(error => of(new AddCategoryFailure({ error }))),
        takeUntil(this.subscriptionService.unsubscribe$)
      )
    )
  );

  @Effect()
  updateCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.UpdateCategory),
    switchMap((action: UpdateCategory) => this.categoryService.updateCategory(action.payload.category).pipe(
        map(() => new UpdateCategorySuccess(action.payload)),
        catchError(error => of(new UpdateCategoryFailure({ error }))),
        takeUntil(this.subscriptionService.unsubscribe$)
      )
    )
  );

  @Effect()
  deleteCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.DeleteCategory),
    switchMap((action: DeleteCategory) => this.categoryService.deleteCategory(action.payload.category._id).pipe(
        map(() => new DeleteCategorySuccess(action.payload)),
        catchError(error => of(new DeleteCategoryFailure({ error }))),
        takeUntil(this.subscriptionService.unsubscribe$)
      )
    )
  );

  @Effect()
  restoreCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.RestoreCategory),
    switchMap((action: RestoreCategory) => this.categoryService.restoreCategory(action.payload.category._id).pipe(
        map(() => new RestoreCategorySuccess(action.payload)),
        catchError(error => of(new RestoreCategoryFailure({ error }))),
        takeUntil(this.subscriptionService.unsubscribe$)
      )
    )
  );

  constructor(private actions$: Actions<CategoryActions>, private categoryService: CategoryService, private store: Store<fromCategory.CategoryState>, private subscriptionService: SubscriptionService) { }
}
