// ============================================
// UniNotes - Grade Service
// CRUD para calificaciones + cálculo de promedios
// ============================================

import { Grade } from '../types';
import { StorageService, STORAGE_KEYS } from './storage.service';
import { v4 as uuidv4 } from 'uuid';

export class GradeService {
  /** Obtener todas las notas del usuario */
  static getAll(userId: string): Grade[] {
    return StorageService.getAll<Grade>(STORAGE_KEYS.GRADES)
      .filter(g => g.userId === userId);
  }

  /** Obtener notas por materia */
  static getBySubject(userId: string, subjectId: string): Grade[] {
    return this.getAll(userId).filter(g => g.subjectId === subjectId);
  }

  /** Calcular promedio ponderado de una materia */
  static getSubjectAverage(userId: string, subjectId: string): number {
    const grades = this.getBySubject(userId, subjectId);
    if (grades.length === 0) return 0;

    const totalPercentage = grades.reduce((sum, g) => sum + g.percentage, 0);
    if (totalPercentage === 0) return 0;

    const weightedSum = grades.reduce((sum, g) => sum + (g.score * g.percentage / 100), 0);
    // Normalizar al porcentaje total registrado
    return Math.round((weightedSum / (totalPercentage / 100)) * 100) / 100;
  }

  /** Calcular promedio global de todas las materias */
  static getGlobalAverage(userId: string, subjectIds: string[]): number {
    const averages = subjectIds
      .map(id => this.getSubjectAverage(userId, id))
      .filter(avg => avg > 0);

    if (averages.length === 0) return 0;
    const sum = averages.reduce((a, b) => a + b, 0);
    return Math.round((sum / averages.length) * 100) / 100;
  }

  /** Crear nueva nota */
  static create(data: Omit<Grade, 'id' | 'createdAt'>): Grade {
    const grade: Grade = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    StorageService.save<Grade>(STORAGE_KEYS.GRADES, grade);
    return grade;
  }

  /** Actualizar nota */
  static update(id: string, data: Partial<Grade>): void {
    StorageService.update<Grade>(STORAGE_KEYS.GRADES, id, data);
  }

  /** Eliminar nota */
  static delete(id: string): void {
    StorageService.remove<Grade>(STORAGE_KEYS.GRADES, id);
  }
}
