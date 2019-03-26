import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { MatButtonModule, MatIconModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatDialogModule, MatSnackBarModule, MatSelectModule, MatOptionModule, MatDatepickerModule, MatNativeDateModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { MoviesComponent } from './movies/movies.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { SharedModule } from '../shared/shared.module';
import { TheatersComponent } from './theaters/theaters.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './categories/category/category.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TheaterComponent } from './theaters/theater/theater.component';
import { ScheduleComponent } from './schedules/schedule/schedule.component';
import { StoreModule } from '@ngrx/store';
import * as fromCategory from './categories/reducers/category.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects } from './categories/effects/category.effects';
import * as fromTheater from './theaters/reducers/theater.reducer';
import { TheaterEffects } from './theaters/effects/theater.effects';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatDialogModule,
    MatSnackBarModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    StoreModule.forFeature('category', fromCategory.categoryReducer),
    EffectsModule.forFeature([
      CategoryEffects,
      TheaterEffects
    ]),
    StoreModule.forFeature('theater', fromTheater.theaterReducer)
  ],
  declarations: [
    MoviesComponent,
    SchedulesComponent,
    TheatersComponent,
    TheaterComponent,
    CategoriesComponent,
    CategoryComponent,
    ScheduleComponent
  ],
  entryComponents: [
    ScheduleComponent,
    TheaterComponent,
    CategoryComponent
  ]
})
export class HomeModule { }
