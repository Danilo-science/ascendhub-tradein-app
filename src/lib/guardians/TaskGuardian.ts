// Sistema de Guardianes Backend para AscendHub - Implementación Principal
// Adaptación de la propuesta Rust a TypeScript

import { 
  TaskState, 
  TaskType, 
  BuilderTask, 
  TaskTransition, 
  GuardianEvent, 
  TaskDependency,
  GuardianConfig,
  GuardianError,
  InvalidTransitionError,
  TaskNotFoundError,
  DependencyNotMetError
} from './types';

export class TaskGuardian {
  private tasks: Map<string, BuilderTask> = new Map();
  private transitions: Map<TaskState, TaskState[]> = new Map();
  private dependencies: Map<string, string[]> = new Map();
  private eventHistory: GuardianEvent[] = [];
  private config: GuardianConfig;

  constructor(config: Partial<GuardianConfig> = {}) {
    this.config = {
      maxConcurrentTasks: 5,
      autoRetryFailedTasks: true,
      notificationEnabled: true,
      persistenceEnabled: true,
      ...config
    };

    this.initializeTransitions();
  }

  private initializeTransitions(): void {
    // Definir transiciones válidas para AscendHub Builder MCP
    this.transitions.set(TaskState.Pending, [
      TaskState.InProgress,
      TaskState.Failed
    ]);

    this.transitions.set(TaskState.InProgress, [
      TaskState.Completed,
      TaskState.Failed,
      TaskState.NeedsReview
    ]);

    this.transitions.set(TaskState.Completed, [
      TaskState.Verified,
      TaskState.NeedsReview
    ]);

    this.transitions.set(TaskState.Failed, [
      TaskState.Pending,
      TaskState.InProgress
    ]);

    this.transitions.set(TaskState.NeedsReview, [
      TaskState.Verified,
      TaskState.InProgress,
      TaskState.Failed
    ]);

    this.transitions.set(TaskState.Verified, [
      TaskState.NeedsReview // Solo si se encuentra un problema
    ]);
  }

  // Inicializar las tareas específicas identificadas en el diagnóstico
  public async initializeAscendHubTasks(): Promise<string[]> {
    const taskDefinitions: Array<{
      description: string;
      taskType: TaskType;
      priority: 'low' | 'medium' | 'high' | 'critical';
      estimatedTime: number;
    }> = [
      {
        description: "Eliminar componente CartSidebar duplicado",
        taskType: TaskType.ComponentFix,
        priority: 'high',
        estimatedTime: 30
      },
      {
        description: "Estandarizar imports de React en toda la aplicación",
        taskType: TaskType.CodeRefactor,
        priority: 'medium',
        estimatedTime: 45
      },
      {
        description: "Implementar error boundaries globales",
        taskType: TaskType.StateManagement,
        priority: 'high',
        estimatedTime: 60
      },
      {
        description: "Mejorar validación en tiempo real en formularios",
        taskType: TaskType.ValidationFix,
        priority: 'high',
        estimatedTime: 90
      },
      {
        description: "Optimizar bundle size y code splitting",
        taskType: TaskType.PerformanceOpt,
        priority: 'medium',
        estimatedTime: 120
      },
      {
        description: "Implementar skeleton loaders y estados de carga",
        taskType: TaskType.UXImprovement,
        priority: 'medium',
        estimatedTime: 75
      },
      {
        description: "Añadir tests para componentes críticos",
        taskType: TaskType.TestImplementation,
        priority: 'low',
        estimatedTime: 180
      }
    ];

    const taskIds: string[] = [];

    for (const taskDef of taskDefinitions) {
      const taskId = this.generateTaskId();
      const task: BuilderTask = {
        id: taskId,
        description: taskDef.description,
        taskType: taskDef.taskType,
        state: TaskState.Pending,
        progress: 0,
        filesModified: [],
        dependencies: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
        priority: taskDef.priority,
        estimatedTime: taskDef.estimatedTime
      };

      this.tasks.set(taskId, task);
      taskIds.push(taskId);

      this.emitEvent({
        id: this.generateEventId(),
        type: 'task_created',
        taskId,
        timestamp: new Date(),
        data: { task }
      });
    }

    // Configurar dependencias lógicas
    if (taskIds.length >= 7) {
      // Error boundaries depende de eliminar duplicados
      this.dependencies.set(taskIds[2], [taskIds[0]]);
      
      // Validación depende de error boundaries
      this.dependencies.set(taskIds[3], [taskIds[2]]);
      
      // UX improvements depende de validación
      this.dependencies.set(taskIds[5], [taskIds[3]]);
      
      // Tests depende de que todo lo demás esté estable
      this.dependencies.set(taskIds[6], [taskIds[0], taskIds[2], taskIds[3]]);
    }

    return taskIds;
  }

  public async transitionTask(
    taskId: string, 
    toState: TaskState, 
    reason?: string
  ): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new TaskNotFoundError(taskId);
    }

    const currentState = task.state;

    // Verificar si la transición es válida
    const allowedStates = this.transitions.get(currentState);
    if (!allowedStates || !allowedStates.includes(toState)) {
      throw new InvalidTransitionError(taskId, currentState, toState);
    }

    // Verificar dependencias antes de marcar como completada
    if (toState === TaskState.Completed) {
      await this.checkDependencies(taskId);
    }

    // Aplicar la transición
    task.state = toState;
    task.updatedAt = new Date();

    // Actualizar progreso basado en estado
    task.progress = this.calculateProgressByState(toState);

    // Registrar la transición
    const transition: TaskTransition = {
      from: currentState,
      to: toState,
      timestamp: new Date(),
      reason
    };

    // Emitir evento
    this.emitEvent({
      id: this.generateEventId(),
      type: 'task_updated',
      taskId,
      timestamp: new Date(),
      data: { transition, task }
    });

    // Auto-retry lógica para tareas fallidas
    if (toState === TaskState.Failed && this.config.autoRetryFailedTasks) {
      setTimeout(() => {
        this.scheduleRetry(taskId);
      }, 5000); // Retry después de 5 segundos
    }
  }

  private async checkDependencies(taskId: string): Promise<void> {
    const dependencies = this.dependencies.get(taskId);
    if (!dependencies || dependencies.length === 0) {
      return;
    }

    const unmetDependencies: string[] = [];

    for (const depId of dependencies) {
      const depTask = this.tasks.get(depId);
      if (!depTask || (depTask.state !== TaskState.Completed && depTask.state !== TaskState.Verified)) {
        unmetDependencies.push(depId);
      }
    }

    if (unmetDependencies.length > 0) {
      throw new DependencyNotMetError(taskId, unmetDependencies);
    }
  }

  private calculateProgressByState(state: TaskState): number {
    switch (state) {
      case TaskState.Pending: return 0;
      case TaskState.InProgress: return 25;
      case TaskState.NeedsReview: return 75;
      case TaskState.Completed: return 90;
      case TaskState.Verified: return 100;
      case TaskState.Failed: return 0;
      default: return 0;
    }
  }

  private scheduleRetry(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task && task.state === TaskState.Failed) {
      // Implementar lógica de retry inteligente
      this.transitionTask(taskId, TaskState.Pending, 'Auto-retry after failure');
    }
  }

  private emitEvent(event: GuardianEvent): void {
    this.eventHistory.push(event);
    
    // Mantener solo los últimos 1000 eventos
    if (this.eventHistory.length > 1000) {
      this.eventHistory = this.eventHistory.slice(-1000);
    }

    if (this.config.notificationEnabled) {
      this.notifyEvent(event);
    }
  }

  private notifyEvent(event: GuardianEvent): void {
    // Implementar notificaciones (console, webhooks, etc.)
    console.log(`[TaskGuardian] ${event.type}: ${event.taskId}`, event.data);
  }

  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Métodos públicos para consulta
  public getTask(taskId: string): BuilderTask | undefined {
    return this.tasks.get(taskId);
  }

  public getAllTasks(): BuilderTask[] {
    return Array.from(this.tasks.values());
  }

  public getTasksByState(state: TaskState): BuilderTask[] {
    return Array.from(this.tasks.values()).filter(task => task.state === state);
  }

  public getTasksByType(type: TaskType): BuilderTask[] {
    return Array.from(this.tasks.values()).filter(task => task.taskType === type);
  }

  public getProgress(): { completed: number; total: number; percentage: number } {
    const tasks = Array.from(this.tasks.values());
    const completed = tasks.filter(t => t.state === TaskState.Verified).length;
    const total = tasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { completed, total, percentage };
  }

  public getEventHistory(): GuardianEvent[] {
    return [...this.eventHistory];
  }

  // Método para actualizar archivos modificados
  public updateModifiedFiles(taskId: string, files: string[]): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.filesModified = [...new Set([...task.filesModified, ...files])];
      task.updatedAt = new Date();
    }
  }

  // Método para registrar tiempo real
  public recordActualTime(taskId: string, minutes: number): void {
    const task = this.tasks.get(taskId);
    if (task) {
      task.actualTime = minutes;
      task.updatedAt = new Date();
    }
  }
}