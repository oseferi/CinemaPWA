import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Category, CategoryRequest } from '../models/category.model';
import { Store } from '@ngrx/store';
import * as fromCategory from '../reducers/category.reducer';
import { UpdateCategory, AddCategory, DeleteCategory } from '../actions/category.actions';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit {
  editMode = false;
  request: CategoryRequest = new CategoryRequest();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Category,
    private store: Store<fromCategory.CategoryState>
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.request.formGroup.patchValue(this.data);
      this.editMode = true;
    }
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
