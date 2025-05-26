import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Task } from '../task/task.component';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://app-movies-api.test/api/tasks';
  private token: any;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token')!;
  }

  getTasks(project: number): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${this.apiUrl}/project/${project}`, {
        headers: { Authorization: `Bearer ${this.token}` },
      })
      .pipe(
        map((response: Task[]) => {
          response = response.map((task: any) => {
            return {...task, id: task.idtask}
          })
          return response
        })
      );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${task.id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
