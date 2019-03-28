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

  public getCategories = (): Observable<Category[]> => this.http.get<Category[]>(`${environment.apiUrl}/categories?validity=true`);
  public createCategory = (request: Partial<Category>): Observable<Category> => this.http.post<Category>(`${environment.apiUrl}/categories`, { ...request, validity: true });
  public updateCategory = (request: Update<Category>): Observable<Category> => this.http.patch<Category>(`${environment.apiUrl}/categories/${request.id}`, request.changes);
  public deleteCategory = (id: string): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/categories/${id}`, { validity: false });
  public restoreCategory = (id: string): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/categories/${id}`, { validity: true });
}
