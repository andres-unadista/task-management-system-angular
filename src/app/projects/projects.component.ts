// projects.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';

interface Project {
  id: number;
  name: string;
  description: string;
  status: string;
}
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})

export class ProjectsComponent {
  themeService = inject(ThemeService);
   // Datos y paginación
   allProjects: Project[] = [
    {id: 1, name: 'Proyecto A', description: 'Descripción A', status: 'Activo'},
    {id: 2, name: 'Proyecto B', description: 'Descripción B', status: 'En pausa'},
    {id: 3, name: 'Proyecto C', description: 'Descripción C', status: 'Activo'},
    {id: 4, name: 'Proyecto D', description: 'Descripción D', status: 'En pausa'},
    {id: 5, name: 'Proyecto E', description: 'Descripción E', status: 'En pausa'},
    {id: 6, name: 'Proyecto F', description: 'Descripción F', status: 'Activo'},
    // ... más proyectos ...
  ];
  
  currentPage = 1;
  itemsPerPage = 5;
  paginatedProjects: Project[] = [];

  constructor() {
    this.updatePaginatedProjects();
  }

  updatePaginatedProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProjects = this.allProjects.slice(
      startIndex, 
      startIndex + this.itemsPerPage
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedProjects();
  }

  get totalPages(): number {
    return Math.ceil(this.allProjects.length / this.itemsPerPage);
  }
  
  logout() {
    // Lógica para cerrar sesión
    console.log('Sesión cerrada');
  }
}