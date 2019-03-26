import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Schedule, ScheduleRequest } from '../../../core/models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  constructor(private http: HttpClient) {}

  public getSchedules = (): Observable<Schedule[]> => this.http.get<Schedule[]>(`${environment.apiUrl}/schedules?validity=true`);
  public getSchedule = (id: number): Observable<Schedule> => this.http.get<Schedule>(`${environment.apiUrl}/schedules/${id}/?validity=true`);
  public createSchedule = (request: ScheduleRequest): Observable<Schedule> => this.http.post<Schedule>(`${environment.apiUrl}/schedules`, { ...request.formGroup.value, validity: true });
  public updateSchedule = (id: number, request: ScheduleRequest): Observable<Schedule> => this.http.patch<Schedule>(`${environment.apiUrl}/schedules/${id}`, request.formGroup.value);
  public deleteSchedule = (id: number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/schedules/${id}`, { validity: false });
  public restoreSchedule = (id: number): Observable<void> => this.http.patch<void>(`${environment.apiUrl}/schedules/${id}`, { validity: true });
}
