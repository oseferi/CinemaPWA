import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Category } from '../models/category.model';
import { CategoryActions, CategoryActionTypes } from '../actions/category.actions';
import { createFeatureSelector } from '@ngrx/store';

export interface CategoryState extends EntityState<Category> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>({ sortComparer: (a: Category, b: Category) => a.id < b.id ? -1 : 1 });

export const initialState: CategoryState = adapter.getInitialState({
  // additional entity state properties
});

export function categoryReducer(
  state = initialState,
  action: CategoryActions
): CategoryState {
  switch (action.type) {
    case CategoryActionTypes.LoadCategoriesSuccess: {
      return adapter.addAll(action.payload.categories, state);
    }

    case CategoryActionTypes.AddCategorySuccess: {
      return adapter.addOne(action.payload.category, state);
    }

    case CategoryActionTypes.UpdateCategorySuccess: {
      return adapter.updateOne(action.payload.category, state);
    }

    case CategoryActionTypes.DeleteCategorySuccess: {
      return adapter.removeOne(action.payload.category.id, state);
    }

    case CategoryActionTypes.RestoreCategorySuccess: {
      return adapter.addOne(action.payload.category, state);
    }

    default: {
      return state;
    }
  }
}

export const selectCategoryState = createFeatureSelector<CategoryState>('category');

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(selectCategoryState);
