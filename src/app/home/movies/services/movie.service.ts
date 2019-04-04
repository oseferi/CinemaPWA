import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Movie } from '../models/movie.model';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  constructor(private http: HttpClient) {}

  public getMovies = (): Observable<Movie[]> => this.http.get<Movie[]>(`${environment.apiUrl}/movies`);
  public createMovie = (request: Partial<Movie>): Observable<Movie> => this.http.post<Movie>(`${environment.apiUrl}/movies`, request);
  public updateMovie = (request: Update<Movie>): Observable<Movie> => this.http.patch<Movie>(`${environment.apiUrl}/movies/${request.id}`, request.changes);
  public deleteMovie = (id: string): Observable<void> => this.http.delete<void>(`${environment.apiUrl}/movies/${id}`);
  public restoreMovie = (id: string): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/movies/${id}/restore`, {});
}
