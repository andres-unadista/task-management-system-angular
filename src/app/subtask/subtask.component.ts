import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../services/theme.service';
import Swal from 'sweetalert2';

export interface SubTask {
  idsubtask: number;
  name: string;
  status: boolean;
  task_idtask: number;
}

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
      <div class="flex justify-between items-center mb-2">
        <h3 class="font-medium">Listado</h3>
        <button
          (click)="addSubtask()"
          class="text-sm text-indigo-600 dark:text-indigo-400"
        >
          + Añadir subtarea
        </button>
      </div>

      <ul class="space-y-2">
        <li
          *ngFor="let subtask of subtasks"
          class="flex items-center justify-between group"
        >
          <div class="flex items-center">
            <input type="checkbox" [(ngModel)]="subtask.status" />
            <span [class.line-through]="subtask.status" class="ml-2">
              {{ subtask.name }}
            </span>
          </div>
          <button
            (click)="removeSubtask(subtask.idsubtask)"
            class="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <i class="fas fa-trash"></i>
          </button>
        </li>
      </ul>
    </div>
  `,
})
export class SubTaskComponent implements OnInit {
  @Input() taskId!: number;
  @Input() subtasks: SubTask[] = [];

  ngOnInit(): void {
  }

  addSubtask() {
    this.subtasks.push({
      idsubtask: this.subtasks.length + 1,
      name: 'Nueva subtarea',
      status: false,
      task_idtask: this.taskId,
    });
  }

  removeSubtask(subtaskId: number) {
    const subtask = this.subtasks.find(task => task.idsubtask === subtaskId);

    if (!subtask) return;

    Swal.fire({
      title: `¿Eliminar subtarea ${subtask.name}?`,
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      background: this.themeService.darkMode ? '#1f2937' : '#ffffff',
      color: this.themeService.darkMode ? '#f3f4f6' : '#111827',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subtasks = this.subtasks.filter((st) => st.idsubtask !== subtaskId);
      }
    });
  }

  constructor(private themeService: ThemeService) {
  }
}
