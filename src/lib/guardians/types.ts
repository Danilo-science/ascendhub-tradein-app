// Sistema de Guardianes Backend para AscendHub - Tipos TypeScript
// Adaptación de la propuesta Rust a TypeScript

export enum TaskState {
  Pending = 'pending',           // 0/4 Tasks done
  InProgress = 'in_progress',    // Trabajando en la tarea
  Completed = 'completed',       // Task completada
  Failed = 'failed',             // Falló la ejecución
  NeedsReview = 'needs_review',  // Necesita revisión manual
  Verified = 'verified',         // Verificada y aprobada
}

export enum TaskType {
  // Tipos específicos para AscendHub
  ComponentFix = 'component_fix',           // Corregir componentes duplicados
  StateManagement = 'state_management',     // Mejorar gestión de estado
  ValidationFix = 'validation_fix',         // Corregir validaciones
  PerformanceOpt = 'performance_opt',       // Optimización de performance
  UXImprovement = 'ux_improvement',         // Mejoras de UX
  CodeRefactor = 'code_refactor',           // Refactoring de código
  TestImplementation = 'test_implementation', // Implementar tests
  SecurityFix = 'security_fix',             // Correcciones de seguridad
}

export interface BuilderTask {
  id: string;
  description: string;
  taskType: TaskType;
  state: TaskState;
  progress: number;        // 0-100
  filesModified: string[];
  dependencies: string[];
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime?: number;  // en minutos
  actualTime?: number;     // tiempo real tomado
}

export interface TaskTransition {
  from: TaskState;
  to: TaskState;
  timestamp: Date;
  reason?: string;
  userId?: string;
}

export interface GuardianEvent {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'task_failed' | 'dependency_resolved';
  taskId: string;
  timestamp: Date;
  data: any;
}

export interface TaskDependency {
  taskId: string;
  dependsOn: string[];
  type: 'blocking' | 'soft' | 'optional';
}

export interface GuardianConfig {
  maxConcurrentTasks: number;
  autoRetryFailedTasks: boolean;
  notificationEnabled: boolean;
  persistenceEnabled: boolean;
}

// Errores específicos del Guardian
export class GuardianError extends Error {
  constructor(
    message: string,
    public code: string,
    public taskId?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'GuardianError';
  }
}

export class InvalidTransitionError extends GuardianError {
  constructor(taskId: string, from: TaskState, to: TaskState) {
    super(
      `Invalid transition from ${from} to ${to} for task ${taskId}`,
      'INVALID_TRANSITION',
      taskId,
      { from, to }
    );
  }
}

export class TaskNotFoundError extends GuardianError {
  constructor(taskId: string) {
    super(`Task ${taskId} not found`, 'TASK_NOT_FOUND', taskId);
  }
}

export class DependencyNotMetError extends GuardianError {
  constructor(taskId: string, missingDependencies: string[]) {
    super(
      `Dependencies not met for task ${taskId}: ${missingDependencies.join(', ')}`,
      'DEPENDENCY_NOT_MET',
      taskId,
      { missingDependencies }
    );
  }
}