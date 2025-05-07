// projects.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

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
    FormsModule
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
  searchTerm = '';
  selectedStatus = 'Todos';
  statusOptions = ['Todos', 'Activo', 'En pausa', 'Completado'];
  router = inject(Router);

  constructor() {
    this.updatePaginatedProjects();
  }

  get filteredProjects() {
    return this.allProjects.filter(project => {
      const matchesSearch = 
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.id.toString().includes(this.searchTerm);
      
      const matchesStatus = 
        this.selectedStatus === 'Todos' || 
        project.status === this.selectedStatus;
      
      return matchesSearch && matchesStatus;
    });
  }

  updatePaginatedProjects() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProjects = this.filteredProjects.slice(
      startIndex, 
      startIndex + this.itemsPerPage
    );
  }

  // Llamar a updatePaginatedProjects() cuando cambien los filtros
  onFilterChange() {
    this.currentPage = 1; // Resetear a primera página
    this.updatePaginatedProjects();
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

  deleteProject(project: Project) {
    Swal.fire({
      title: '¿Eliminar proyecto?',
      text: `Estás por eliminar "${project.name}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
      color: this.themeService.darkMode ? '#f3f4f6' : '#111827'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para eliminar el proyecto
        this.allProjects = this.allProjects.filter(p => p.id !== project.id);
        this.updatePaginatedProjects();
        
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El proyecto ha sido eliminado.',
          icon: 'success',
          background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
          color: this.themeService.darkMode ? '#f3f4f6' : '#111827'
        });
      }
    });
  }

  openCreateProjectModal() {
    Swal.fire({
      title: 'Crear Nuevo Proyecto',
      html: `
        <input id="project-name" class="swal2-input" placeholder="Nombre">
        <textarea id="project-desc" class="swal2-textarea" placeholder="Descripción"></textarea>
        <select id="project-status" class="swal2-select">
          <option value="Activo">Activo</option>
          <option value="En pausa">En pausa</option>
          <option value="Completado">Completado</option>
        </select>
      `,
      background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
      color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
      confirmButtonText: 'Crear',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const name = (Swal.getPopup()?.querySelector('#project-name') as HTMLInputElement)?.value;
        const description = (Swal.getPopup()?.querySelector('#project-desc') as HTMLTextAreaElement)?.value;
        const status = (Swal.getPopup()?.querySelector('#project-status') as HTMLSelectElement)?.value;
  
        if (!name) {
          Swal.showValidationMessage('El nombre es requerido');
          return false;
        }
  
        return { name, description, status };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newProject: Project = {
          id: this.allProjects.length + 1,
          name: result.value.name,
          description: result.value.description,
          status: result.value.status
        };
  
        this.allProjects.unshift(newProject);
        this.updatePaginatedProjects();
  
        Swal.fire({
          title: '¡Proyecto creado!',
          text: `${newProject.name} ha sido creado exitosamente.`,
          icon: 'success',
          background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
          color: this.themeService.darkMode ? '#f3f4f6' : '#111827'
        });
      }
    });
  }

  openEditProjectModal(project: Project) {
    Swal.fire({
      title: 'Editar Proyecto',
      html: `
        <input id="project-name" class="swal2-input" placeholder="Nombre" value="${project.name}">
        <textarea id="project-desc" class="swal2-textarea" placeholder="Descripción">${project.description}</textarea>
        <select id="project-status" class="swal2-select">
          <option value="Activo" ${project.status === 'Activo' ? 'selected' : ''}>Activo</option>
          <option value="En pausa" ${project.status === 'En pausa' ? 'selected' : ''}>En pausa</option>
          <option value="Completado" ${project.status === 'Completado' ? 'selected' : ''}>Completado</option>
        </select>
      `,
      background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
      color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
      confirmButtonText: 'Actualizar',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const name = (Swal.getPopup()?.querySelector('#project-name') as HTMLInputElement)?.value;
        const description = (Swal.getPopup()?.querySelector('#project-desc') as HTMLTextAreaElement)?.value;
        const status = (Swal.getPopup()?.querySelector('#project-status') as HTMLSelectElement)?.value;
  
        if (!name) {
          Swal.showValidationMessage('El nombre es requerido');
          return false;
        }
  
        return { name, description, status };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const updatedProject = {
          ...project,
          name: result.value.name,
          description: result.value.description,
          status: result.value.status
        };
  
        this.allProjects = this.allProjects.map(p => 
          p.id === project.id ? updatedProject : p
        );
        this.updatePaginatedProjects();
  
        Swal.fire({
          title: '¡Proyecto actualizado!',
          text: `${updatedProject.name} ha sido actualizado exitosamente.`,
          icon: 'success',
          background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
          color: this.themeService.darkMode ? '#f3f4f6' : '#111827'
        });
      }
    });
  }

  navigateToTasks(projectId: number) {
    this.router.navigate(['/task', projectId]);
  }
}