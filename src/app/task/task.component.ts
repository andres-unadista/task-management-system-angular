import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description: string;
  expiration_date: string;
  priority_level: string;
  status: string;
  project_id: number;
  user_iduser: number;
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  themeService = inject(ThemeService);
  route = inject(ActivatedRoute);

  projectId: number = 0;

  // Datos de prueba
  allTasks: Task[] = [
    {
      id: 1,
      title: 'Implementar diseño',
      description: 'Crear componentes UI',
      expiration_date: '2023-06-15',
      priority_level: 'Alta',
      status: 'En progreso',
      project_id: 1,
      user_iduser: 1,
    },
    {
      id: 2,
      title: 'Implementar diseño',
      description: 'Crear componentes UI',
      expiration_date: '2023-06-15',
      priority_level: 'Alta',
      status: 'Completada',
      project_id: 1,
      user_iduser: 1,
    },
    // Más tareas...
  ];

  searchTerm = '';
  selectedStatus = 'Todos';
  statusOptions = ['Todos', 'En progreso', 'Completada', 'Pendiente'];
  priorityOptions = ['Todas', 'Alta', 'Media', 'Baja'];

  currentPage = 1;
  itemsPerPage = 5;
  paginatedTasks: Task[] = [];

  constructor() {
    this.updatePaginatedTasks();
    this.route.params.subscribe((params) => {
      this.projectId = +params['id_project'];
      console.log('ID del proyecto:', this.projectId);
    });
  }

  get filteredTasks() {
    return this.allTasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        task.id.toString().includes(this.searchTerm);

      const matchesStatus =
        this.selectedStatus === 'Todos' || task.status === this.selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }

  updatePaginatedTasks() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedTasks = this.filteredTasks.slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  }

  onFilterChange() {
    this.currentPage = 1;
    this.updatePaginatedTasks();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePaginatedTasks();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredTasks.length / this.itemsPerPage);
  }

  openCreateTaskModal() {
    Swal.fire({
      title: 'Crear Nueva Tarea',
      html: `
        <input id="task-title" class="swal2-input" placeholder="Título" required>
        <textarea id="task-desc" class="swal2-textarea" placeholder="Descripción"></textarea>
        
        <div class="grid grid-cols-1 gap-4 mt-2">
          <div>
            <label for="task-date" class="block text-sm mb-1 dark:text-gray-300">Fecha y Hora Límite</label>
            <input id="task-date" type="datetime-local" class="swal2-input" required>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 mt-2">
          <div>
            <label for="task-priority" class="block text-sm mb-1 dark:text-gray-300">Prioridad</label>
            <select id="task-priority" class="swal2-select">
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-1 gap-4 mt-2">
          <div>
            <label for="task-status" class="block text-sm mb-1 dark:text-gray-300">Estado</label>
            <select id="task-status" class="swal2-select">
              <option value="Pendiente">Pendiente</option>
              <option value="En progreso">En progreso</option>
              <option value="Completada">Completada</option>
            </select>
          </div>
        </div>
  
        <input id="task-user" type="hidden" value="1"> <!-- user_iduser hardcodeado temporalmente -->
      `,
      background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
      color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
      confirmButtonText: 'Crear',
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => {
        const title = (
          Swal.getPopup()?.querySelector('#task-title') as HTMLInputElement
        )?.value;
        const description = (
          Swal.getPopup()?.querySelector('#task-desc') as HTMLTextAreaElement
        )?.value;
        const expiration_date = (
          Swal.getPopup()?.querySelector('#task-date') as HTMLInputElement
        )?.value;

        // Convertir a formato ISO si es necesario
        const formattedDate = expiration_date
          ? new Date(expiration_date).toISOString()
          : '';

        const priority_level = (
          Swal.getPopup()?.querySelector('#task-priority') as HTMLSelectElement
        )?.value;
        const status = (
          Swal.getPopup()?.querySelector('#task-status') as HTMLSelectElement
        )?.value;
        const user_iduser = 1; // Temporalmente hardcodeado

        if (!title || !expiration_date) {
          Swal.showValidationMessage('Título y Fecha Límite son requeridos');
          return false;
        }

        return {
          title,
          description,
          expiration_date: formattedDate,
          priority_level,
          status,
          project_id: this.projectId,
          user_iduser,
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newTask: Task = {
          id: this.allTasks.length + 1,
          ...result.value,
        };

        this.allTasks.unshift(newTask);
        this.updatePaginatedTasks();

        Swal.fire({
          title: '¡Tarea creada!',
          text: `${newTask.title} ha sido creada exitosamente.`,
          icon: 'success',
          background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
          color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
        });
      }
    });
  }

  // task.component.ts
  openEditTaskModal(task: Task) {
    // Convertir fecha ISO a formato datetime-local
    const taskDate = task.expiration_date
      ? new Date(task.expiration_date).toISOString().slice(0, 16)
      : '';

    Swal.fire({
      title: 'Editar Tarea',
      html: `
      <input id="edit-task-title" class="swal2-input" 
             placeholder="Título" value="${task.title}" required>
      <textarea id="edit-task-desc" class="swal2-textarea" 
                placeholder="Descripción">${task.description || ''}</textarea>
      
      <div class="grid grid-cols-1 gap-4 mt-2">
        <div>
          <label class="block text-sm mb-1 dark:text-gray-300">Fecha y Hora Límite</label>
          <input id="edit-task-date" type="datetime-local" 
                 class="swal2-input" value="${taskDate}" required>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 mt-2">
        <div>
          <label class="block text-sm mb-1 dark:text-gray-300">Prioridad</label>
          <select id="edit-task-priority" class="swal2-select">
            <option value="Alta" ${task.priority_level === 'Alta' ? 'selected' : ''}>Alta</option>
            <option value="Media" ${task.priority_level === 'Media' ? 'selected' : ''}>Media</option>
            <option value="Baja" ${task.priority_level === 'Baja' ? 'selected' : ''}>Baja</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 mt-2">
        <div>
          <label class="block text-sm mb-1 dark:text-gray-300">Estado</label>
          <select id="edit-task-status" class="swal2-select">
            <option value="Pendiente" ${task.status === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
            <option value="En progreso" ${task.status === 'En progreso' ? 'selected' : ''}>En progreso</option>
            <option value="Completada" ${task.status === 'Completada' ? 'selected' : ''}>Completada</option>
          </select>
        </div>
      </div>

      <!-- Resto de campos similares al create modal -->
    `,
      background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
      confirmButtonText: 'Guardar',
      showCancelButton: true,
      didOpen: () => {
        // Prioridad
        const prioritySelect = document.getElementById('edit-task-priority') as HTMLSelectElement;
        if (prioritySelect) prioritySelect.value = task.priority_level;
        
        // Estado
        const statusSelect = document.getElementById('edit-task-status') as HTMLSelectElement;
        if (statusSelect) statusSelect.value = task.status;
      },
      preConfirm: () => {
        // Lógica similar a create pero para edición
        const name = (
          Swal.getPopup()?.querySelector('#edit-task-title') as HTMLInputElement
        )?.value;
        const description = (
          Swal.getPopup()?.querySelector('#edit-task-desc') as HTMLTextAreaElement
        )?.value;
        const expiration_date = (
          Swal.getPopup()?.querySelector('#edit-task-date') as HTMLInputElement
        )?.value;
        const priority_level = (
          Swal.getPopup()?.querySelector('#edit-task-priority') as HTMLSelectElement
        )?.value;
        const status = (
          Swal.getPopup()?.querySelector('#edit-task-status') as HTMLSelectElement
        )?.value;
        return {
         name, description, expiration_date, priority_level, status
        };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        // Actualizar la tarea existente
        const updatedTask = {
          ...task,
          name: result.value.name,
          description: result.value.description,
          expiration_date: result.value.expiration_date,
          priority_level: result.value.priority_level,
          status: result.value.status,
          project_id: this.projectId,
          user_iduser: 1,
        };
        this.allTasks = this.allTasks.map((original) =>
          original.id === task.id ? updatedTask : original
        );
        this.updatePaginatedTasks();

        Swal.fire({
          title: '¡Editado!',
          text: 'La tarea ha sido editada exitosamente.',
          icon: 'success',
          background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
          color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
        });
      }
    });
  }

  deleteTask(task: Task) {
    Swal.fire({
      title: '¿Eliminar tarea?',
      text: `Estás por eliminar "${task.title}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
      color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para eliminar el proyecto
        this.allTasks = this.allTasks.filter((t) => t.id !== task.id);
        this.updatePaginatedTasks();

        Swal.fire({
          title: '¡Eliminado!',
          text: 'La tarea ha sido eliminada.',
          icon: 'success',
          background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
          color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
        });
      }
    });
  }

  logout() {
    // Lógica para cerrar sesión
    console.log('Sesión cerrada');
  }
}
