import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ThemeService } from '../services/theme.service';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { SubTask, SubTaskComponent } from '../subtask/subtask.component';
import { AuthService } from '../services/auth.service';
import { TasksService } from '../services/tasks.service';
import { iconStatus } from '../shared/icons';

export interface Task {
  id: number;
  title: string;
  description: string;
  expiration_date: string;
  priority_level: string;
  status: string;
  project_id: number;
  user_iduser: number;
  subtasks?: SubTask[]; // Nueva propiedad
  showSubtasks?: boolean; // Para controlar el collapse
}

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SubTaskComponent],
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent implements OnInit {
  private authService = inject(AuthService);
  private taskService = inject(TasksService);
  public iconStatus = iconStatus;

  showProfileMenu = false;
  isDarkMode = false;
  themeService = inject(ThemeService);
  route = inject(ActivatedRoute);
  router = inject(Router)

  projectId: number = 0;

  // Datos de prueba
  allTasks: Task[] = [];

  searchTerm = '';
  selectedStatus = 'Todos';
  statusOptions = ['Todos', 'En progreso', 'Completada', 'Pendiente'];
  priorityOptions = ['Todas', 'Alta', 'Media', 'Baja'];

  currentPage = 1;
  itemsPerPage = 5;
  paginatedTasks: Task[] = [];

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id_project'));
    });

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login'])
    }
  
    this.detectDarkMode();
  }

  ngOnInit(): void {
    this.taskService.getTasks(this.projectId).subscribe({
      next: (response) => {
        this.allTasks = response
        console.log(response)
        this.updatePaginatedTasks();
      },
      error: (error) => {
        if (error.status === 401) {
          console.log('Error de autorización')
          this.logout();
        }
      }
    })
  }

  detectDarkMode() {
    // Si ThemeService tiene un método para saber el modo, úsalo aquí
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.isDarkMode = true;
    }
    // Si ThemeService tiene un observable, puedes suscribirte aquí
    // O actualizar esto cuando el usuario cambie el tema
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
    this.alertCreate();
  }

  private alertCreate() {
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
    console.log(task)
    const taskDate = task.expiration_date
      ? new Date(task.expiration_date).toISOString().slice(0, 16)
      : '';

    this.alertEdit(task, taskDate);
  }

  private alertEdit(task: Task, taskDate: string) {
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
           <option value="low" ${task.priority_level.toString() === 'low' ? 'selected' : ''}>Bajo</option>
          <option value="medium" ${task.priority_level.toString() === 'medium' ? 'selected' : ''}>Medio</option>
          <option value="high" ${task.priority_level.toString() === 'high' ? 'selected' : ''}>Alto</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-4 mt-2">
        <div>
          <label class="block text-sm mb-1 dark:text-gray-300">Estado</label>
          <select id="edit-task-status" class="swal2-select">
            <option value="1" ${task.status.toString() === '1' ? 'selected' : ''}>Activo</option>
          <option value="0" ${task.status.toString() === '0' ? 'selected' : ''}>En pausa</option>
          <option value="2" ${task.status.toString() === '2' ? 'selected' : ''}>Completado</option>
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
        this.allTasks = this.allTasks.map((original) => original.id === task.id ? updatedTask : original
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
    this.alertDelete(task);
  }

  private alertDelete(task: Task) {
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

  toggleSubtasks(task: Task) {
    // Alternar el estado de visualización
    task.showSubtasks = !task.showSubtasks;
  }


  logout() {
    // Lógica para cerrar sesión
    console.log('Sesión cerrada');
    this.authService.logout();
  }
}
