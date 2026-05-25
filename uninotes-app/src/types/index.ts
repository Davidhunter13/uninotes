// ============================================
// UniNotes - TypeScript Interfaces
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  career?: string;
  semester?: string;
  avatarColor?: string;
  createdAt: string;
}

export interface Subject {
  id: string;
  name: string;
  professor: string;
  color: string;
  credits: number;
  room?: string;
  userId: string;
  createdAt: string;
}

export type TaskPriority = 'alta' | 'media' | 'baja';

export interface Task {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  userId: string;
  createdAt: string;
}

export interface Grade {
  id: string;
  subjectId: string;
  name: string;
  score: number;
  percentage: number;
  userId: string;
  createdAt: string;
}

export type WeekDay = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado';

export interface ScheduleEntry {
  id: string;
  subjectId: string;
  day: WeekDay;
  startTime: string;
  endTime: string;
  room: string;
  userId: string;
}

export interface Reminder {
  id: string;
  taskId: string;
  title: string;
  message: string;
  date: string;
  active: boolean;
  userId: string;
}

// Utilidad para estadísticas del dashboard
export interface DashboardStats {
  totalSubjects: number;
  pendingTasks: number;
  globalAverage: number;
  completedTasks: number;
}
