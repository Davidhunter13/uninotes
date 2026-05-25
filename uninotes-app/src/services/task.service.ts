// ============================================
// UniNotes - Task Service
// CRUD para tareas con filtros
// ============================================

import { Task } from '../types';
import { StorageService, STORAGE_KEYS } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

export class TaskService {
  /** Obtener todas las tareas del usuario */
  static getAll(userId: string): Task[] {
    return StorageService.getAll<Task>(STORAGE_KEYS.TASKS)
      .filter(t => t.userId === userId);
  }

  /** Obtener tareas por materia */
  static getBySubject(userId: string, subjectId: string): Task[] {
    return this.getAll(userId).filter(t => t.subjectId === subjectId);
  }

  /** Obtener tareas pendientes ordenadas por fecha */
  static getPending(userId: string): Task[] {
    return this.getAll(userId)
      .filter(t => !t.completed)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  /** Obtener tareas completadas */
  static getCompleted(userId: string): Task[] {
    return this.getAll(userId).filter(t => t.completed);
  }

  /** Obtener tareas próximas (dentro de los siguientes N días) */
  static getUpcoming(userId: string, days: number = 7): Task[] {
    const now = new Date();
    const limit = new Date();
    limit.setDate(now.getDate() + days);

    return this.getPending(userId).filter(t => {
      const due = new Date(t.dueDate);
      return due >= now && due <= limit;
    });
  }

  /** Crear nueva tarea */
  static create(data: Omit<Task, 'id' | 'createdAt'>): Task {
    const task: Task = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    StorageService.save<Task>(STORAGE_KEYS.TASKS, task);
    return task;
  }

  /** Actualizar tarea */
  static update(id: string, data: Partial<Task>): void {
    StorageService.update<Task>(STORAGE_KEYS.TASKS, id, data);
  }

  /** Cambiar estado de completado */
  static toggleComplete(id: string): void {
    const task = StorageService.getById<Task>(STORAGE_KEYS.TASKS, id);
    if (task) {
      StorageService.update<Task>(STORAGE_KEYS.TASKS, id, { completed: !task.completed } as Partial<Task>);
    }
  }

  /** Eliminar tarea */
  static delete(id: string): void {
    StorageService.remove<Task>(STORAGE_KEYS.TASKS, id);
  }
}
