import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../models/category.model';
import { Update } from '@ngrx/entity';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  public getCategories = (): Observable<Category[]> => this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  public createCategory = (request: Partial<Category>): Observable<Category> => this.http.post<Category>(`${environment.apiUrl}/categories`, request);
  public updateCategory = (request: Update<Category>): Observable<Category> => this.http.patch<Category>(`${environment.apiUrl}/categories/${request.id}`, request.changes);
  public deleteCategory = (id: string): Observable<void> => this.http.delete<void>(`${environment.apiUrl}/categories/${id}`);
  public restoreCategory = (id: string): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/categories/${id}/restore`, {});
}
