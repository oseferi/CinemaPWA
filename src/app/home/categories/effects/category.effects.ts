import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { LoadCategoriesFailure, LoadCategoriesSuccess, CategoryActionTypes, CategoryActions, AddCategory, AddCategorySuccess, AddCategoryFailure, UpdateCategory, UpdateCategorySuccess, UpdateCategoryFailure, DeleteCategory, DeleteCategorySuccess, DeleteCategoryFailure, RestoreCategory, RestoreCategorySuccess, RestoreCategoryFailure } from '../actions/category.actions';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';

@Injectable()
export class CategoryEffects {

  @Effect()
  loadCategories$ = this.actions$.pipe(
    ofType(CategoryActionTypes.LoadCategories),
    switchMap(() => this.categoryService.getCategories().pipe(
      map((response: Category[]) => new LoadCategoriesSuccess({ categories: response })),
      catchError(error => of(new LoadCategoriesFailure({ error }))))
    )
  );

  @Effect()
  addCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.AddCategory),
    switchMap((action: AddCategory) => this.categoryService.createCategory(action.payload.category).pipe(
      map((response: Category) => new AddCategorySuccess({ category: response })),
      catchError(error => of(new AddCategoryFailure({ error }))))
    )
  );

  @Effect()
  updateCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.UpdateCategory),
    switchMap((action: UpdateCategory) => this.categoryService.updateCategory(action.payload.category).pipe(
      map(() => new UpdateCategorySuccess(action.payload)),
      catchError(error => of(new UpdateCategoryFailure({ error }))))
    )
  );

  @Effect()
  deleteCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.DeleteCategory),
    switchMap((action: DeleteCategory) => this.categoryService.deleteCategory(action.payload.category.id).pipe(
      map(() => new DeleteCategorySuccess(action.payload)),
      catchError(error => of(new DeleteCategoryFailure({ error }))))
    )
  );

  @Effect()
  restoreCategory$ = this.actions$.pipe(
    ofType(CategoryActionTypes.RestoreCategory),
    switchMap((action: RestoreCategory) => this.categoryService.restoreCategory(action.payload.category.id).pipe(
      map(() => new RestoreCategorySuccess(action.payload)),
      catchError(error => of(new RestoreCategoryFailure({ error }))))
    )
  );

  constructor(private actions$: Actions<CategoryActions>, private categoryService: CategoryService) { }
}
