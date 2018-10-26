import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MoviesComponent } from './movies/movies.component';
import { FavouritesComponent } from './favourites/favourites.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'movies'
      },
      {
        path: 'movies',
        component: MoviesComponent,
        data: { icon: 'movie' }
      },
      {
        path: 'favourites',
        component: FavouritesComponent,
        data: { icon: 'favorite_border' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

export const homeRoutes = routes[0].children.filter(route => route.path);
