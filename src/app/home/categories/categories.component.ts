import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../core/services/category.service';
import { Category, CategoryRequest } from '../../core/models/category.model';
import { PageEvent, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { CategoryComponent } from './category/category.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: any[];
  dialogRef: MatDialogRef<CategoryComponent>;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
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
    this.dialogRef = this.dialog.open(CategoryComponent);
    const subscription = this.dialogRef.componentInstance.addedCategory.subscribe((request: CategoryRequest) => this.onAddedCategory(request));
    this.dialogRef.afterClosed().subscribe(() => subscription.unsubscribe());
  }

  private onAddedCategory(category: CategoryRequest): void {
    this.categoryService
      .createCategory(category)
      .toPromise()
      .then((response: Category) => {
        this.categories = [...this.categories, response];
        this.dialogRef.close();
      })
      .catch(err => console.warn(err));
  }

  private onUpdatedCategory(request: { id: number, category: CategoryRequest }): void {
    this.categoryService
      .updateCategory(request.id, request.category)
      .toPromise()
      .then((response: Category) => {
        this.categories = this.categories.map((category: Category) => category.id === request.id ? { ...category, ...response } : category );
        this.dialogRef.close();
      })
      .catch(err => console.warn(err));
  }

  private onDeletedCategory(id: number): void {
    const targetCategory: Category = this.categories.find((category: Category) => category.id === id);
    const targetCategoryIndex = this.categories.indexOf(targetCategory);
    this.categoryService
      .deleteCategory(id)
      .toPromise()
      .then(() => {
        this.dialogRef.close();
        const snackBarRef = this.snackBar.open(`"${targetCategory.name}" deleted successfully!`, 'Undo', {
          duration: 4000
        });
        snackBarRef.onAction().subscribe(() => {
          this.categoryService
            .restoreCategory(id)
            .toPromise()
            .then(() => this.categories = [...this.categories.slice(0, targetCategoryIndex), targetCategory, ...this.categories.slice(targetCategoryIndex)]) // Adds to original position.
            .catch(err => console.warn(err));
        });
        this.categories = this.categories.filter((category: Category) => category !== targetCategory);
      })
        .catch(err => console.warn(err));
  }

  public onRowClick(category: Category): void {
    this.dialogRef = this.dialog.open(CategoryComponent, { data: category });
    const updateSubscription = this.dialogRef.componentInstance.updatedCategory.subscribe((request: { id: number, category: CategoryRequest }) => this.onUpdatedCategory(request));
    const deleteSubscription = this.dialogRef.componentInstance.deletedCategory.subscribe((id: number) => this.onDeletedCategory(id));
    this.dialogRef.afterClosed().subscribe(() => {
      updateSubscription.unsubscribe();
      deleteSubscription.unsubscribe();
    });
  }
}