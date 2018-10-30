import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { MatButtonModule, MatIconModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatBottomSheetModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { MoviesComponent } from './movies/movies.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SharedModule } from '../shared/shared.module';
import { TheatersComponent } from './theaters/theaters.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './categories/category/category.component';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    LayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatBottomSheetModule
  ],
  declarations: [
    MoviesComponent,
    SchedulesComponent,
    TheatersComponent,
    CategoriesComponent,
    CategoryComponent
  ],
  entryComponents: [
    CategoryComponent
  ]
})
export class HomeModule { }
