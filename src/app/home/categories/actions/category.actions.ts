import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { Category, CategoryRequest } from '../models/category.model';

export enum CategoryActionTypes {
  LoadCategories = '[Category] Load Categories',
  LoadCategoriesSuccess = '[Category] Load Categories Success',
  LoadCategoriesFailure = '[Category] Load Categories Failure',
  AddCategory = '[Category] Add Category',
  AddCategorySuccess = '[Category] Add Category Success',
  AddCategoryFailure = '[Category] Add Category Failure',
  UpdateCategory = '[Category] Update Category',
  UpdateCategorySuccess = '[Category] Update Category Success',
  UpdateCategoryFailure = '[Category] Update Category Failure',
  DeleteCategory = '[Category] Delete Category',
  DeleteCategorySuccess = '[Category] Delete Category Success',
  DeleteCategoryFailure = '[Category] Delete Category Failure',
  RestoreCategory = '[Category] Restore Category',
  RestoreCategorySuccess = '[Category] Restore Category Success',
  RestoreCategoryFailure = '[Category] Restore Category Failure'
}

export class LoadCategories implements Action {
  readonly type = CategoryActionTypes.LoadCategories;
}

export class LoadCategoriesSuccess implements Action {
  readonly type = CategoryActionTypes.LoadCategoriesSuccess;

  constructor(public payload: { categories: Category[] }) {}
}

export class LoadCategoriesFailure implements Action {
  readonly type = CategoryActionTypes.LoadCategoriesFailure;

  constructor(public payload: { error: any }) {}
}

export class AddCategory implements Action {
  readonly type = CategoryActionTypes.AddCategory;

  constructor(public payload: { category: CategoryRequest }) {}
}

export class AddCategorySuccess implements Action {
  readonly type = CategoryActionTypes.AddCategorySuccess;

  constructor(public payload: { category: Category }) {}
}

export class AddCategoryFailure implements Action {
  readonly type = CategoryActionTypes.AddCategoryFailure;

  constructor(public payload: { error: any }) {}
}

export class UpdateCategory implements Action {
  readonly type = CategoryActionTypes.UpdateCategory;

  constructor(public payload: { category: Update<Category> }) {}
}

export class UpdateCategorySuccess implements Action {
  readonly type = CategoryActionTypes.UpdateCategorySuccess;

  constructor(public payload: { category: Update<Category> }) {}
}

export class UpdateCategoryFailure implements Action {
  readonly type = CategoryActionTypes.UpdateCategoryFailure;

  constructor(public payload: { error: any }) {}
}

export class DeleteCategory implements Action {
  readonly type = CategoryActionTypes.DeleteCategory;

  constructor(public payload: { category: Category }) {}
}

export class DeleteCategorySuccess implements Action {
  readonly type = CategoryActionTypes.DeleteCategorySuccess;

  constructor(public payload: { category: Category }) {}
}

export class DeleteCategoryFailure implements Action {
  readonly type = CategoryActionTypes.DeleteCategoryFailure;

  constructor(public payload: { error: any }) {}
}

export class RestoreCategory implements Action {
  readonly type = CategoryActionTypes.RestoreCategory;

  constructor(public payload: { category: Category }) {}
}

export class RestoreCategorySuccess implements Action {
  readonly type = CategoryActionTypes.RestoreCategorySuccess;

  constructor(public payload: { category: Category }) {}
}

export class RestoreCategoryFailure implements Action {
  readonly type = CategoryActionTypes.RestoreCategoryFailure;

  constructor(public payload: { error: any }) {}
}

export type CategoryActions =
 LoadCategories
 | LoadCategoriesSuccess
 | LoadCategoriesFailure
 | AddCategory
 | AddCategorySuccess
 | AddCategoryFailure
 | UpdateCategory
 | UpdateCategorySuccess
 | UpdateCategoryFailure
 | DeleteCategory
 | DeleteCategorySuccess
 | DeleteCategoryFailure
 | RestoreCategory
 | RestoreCategorySuccess
 | RestoreCategoryFailure;
