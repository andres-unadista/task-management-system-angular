import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Project } from '../projects/projects.component';

interface RequestProject {
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = 'http://app-movies-api.test/api/projects';

  constructor(private http: HttpClient) {
  }

  getProjects(): Observable<Project[]> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return this.http.get<Project[]>(this.apiUrl, {headers: {'Authorization': `Bearer ${token}`}}).pipe(map((response: Project[]) => {
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

  deleteProject(id: number): Observable<RequestProject> {
    return this.http.delete<RequestProject>(`${this.apiUrl}/${id}`);
  }
}
