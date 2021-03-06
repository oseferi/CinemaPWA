import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Category } from '../models/category.model';
import { CategoryActions, CategoryActionTypes } from '../actions/category.actions';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface CategoryState extends EntityState<Category> {
  categoriesLoaded: boolean;
}

export const adapter: EntityAdapter<Category> = createEntityAdapter<Category>(
  {
    sortComparer: (a: Category, b: Category) => a._id < b._id ? -1 : 1,
    selectId: (category: Category) => category._id
  }
);

export const initialState: CategoryState = adapter.getInitialState({
  categoriesLoaded: false
});

export function categoryReducer(
  state = initialState,
  action: CategoryActions
): CategoryState {
  switch (action.type) {
    case CategoryActionTypes.LoadCategoriesSuccess: {
      return adapter.addAll(action.payload.categories, { ...state, categoriesLoaded: true });
    }

    case CategoryActionTypes.AddCategorySuccess: {
      return adapter.addOne(action.payload.category, state);
    }

    case CategoryActionTypes.UpdateCategorySuccess: {
      return adapter.updateOne(action.payload.category, state);
    }

    case CategoryActionTypes.DeleteCategorySuccess: {
      return adapter.removeOne(action.payload.category._id, state);
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

export const selectCategoriesLoaded = createSelector(
  selectCategoryState,
  (state: CategoryState) => state.categoriesLoaded
);
