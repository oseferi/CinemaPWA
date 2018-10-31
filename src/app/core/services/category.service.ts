import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category, CategoryRequest } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  public getCategories = (): Observable<Category[]> => this.http.get<Category[]>(`${environment.apiUrl}/categories?validity=true`);
  public createCategory = (request: CategoryRequest): Observable<Category> => this.http.post<Category>(`${environment.apiUrl}/categories`, { ...request.formGroup.value, validity: true });
  public updateCategory = (id: number, request: CategoryRequest): Observable<Category> => this.http.put<Category>(`${environment.apiUrl}/categories/${id}`, request.formGroup.value);
  public deleteCategory = (id: number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/categories/${id}`, { validity: false });
  public restoreCategory = (id: number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/categories/${id}`, { validity: true });
}
