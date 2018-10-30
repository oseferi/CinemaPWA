import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Output()
  addedCategory: EventEmitter<Category> = new EventEmitter<Category>();

  constructor() { }

  ngOnInit(): void {
  }

  public save(): void {
    this.addedCategory.emit();
  }
}
