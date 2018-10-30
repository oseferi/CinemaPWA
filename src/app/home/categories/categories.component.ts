import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../core/models/category.model';
import { PageEvent, MatBottomSheet } from '@angular/material';
import { CategoryComponent } from './category/category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any[];

  constructor(
    private categoryService: CategoryService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.categoryService
      .getCategories()
      .toPromise()
      .then((response: Category[]) => {
        this.categories = response.map((category: Category) => {
          return {
            id: category.id,
            name: category.name
          };
        });
      })
      .catch(err => console.warn(err));
  }

  public onPageChange(event: PageEvent) {
    console.log(event);
  }

  public add(): void {
    const bottomSheetRef = this.bottomSheet.open(CategoryComponent);
    const subscription = bottomSheetRef.instance.addedCategory.subscribe((response: Category) => this.onAddedCategory(response));
    bottomSheetRef.afterDismissed().subscribe(() => {
      subscription.unsubscribe();
    });
  }

  private onAddedCategory(category: Category): void {
    console.log(category);
  }
}