import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Project } from '../projects/projects.component';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = 'http://app-movies-api.test/api/projects';
  private token: any;

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token')!
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl, {headers: {'Authorization': `Bearer ${this.token}`}}).pipe(map((response: Project[]) => {
      return response;
    }));
  }

  getProject(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`);
  }

  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${project.id}`, project);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
