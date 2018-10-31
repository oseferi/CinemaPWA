import { Component, Output, EventEmitter, OnInit, Inject } from '@angular/core';
import { CategoryRequest, Category } from '../../../core/models/category.model';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  editMode = false;
  request: CategoryRequest = new CategoryRequest();
  @Output()
  addedCategory: EventEmitter<CategoryRequest> = new EventEmitter<CategoryRequest>();
  @Output()
  updatedCategory: EventEmitter<{ id: number, category: CategoryRequest }> = new EventEmitter<{ id: number, category: CategoryRequest }>();
  @Output()
  deletedCategory: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Category
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.request.formGroup.patchValue(this.data);
      this.editMode = true;
    }
  }

  public save(): void {
    if (this.editMode) {
      this.updatedCategory.emit({ id: this.data.id, category: this.request });
    } else {
      this.addedCategory.emit(this.request);
    }
  }

  public delete(): void {
    this.deletedCategory.emit(this.data.id);
  }
}
