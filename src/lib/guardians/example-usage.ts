// Ejemplo de uso del Sistema de Guardianes para AscendHub
// Este archivo demuestra cómo implementar y usar el sistema

import { TaskGuardian, TaskState, TaskType } from './index';

// Ejemplo 1: Inicialización y configuración básica
export async function initializeGuardianSystem() {
  console.log('🛡️ Inicializando Sistema de Guardianes...');
  
  const guardian = new TaskGuardian({
    maxConcurrentTasks: 3,
    autoRetryFailedTasks: true,
    notificationEnabled: true,
    persistenceEnabled: true
  });

  // Inicializar las tareas específicas de AscendHub
  const taskIds = await guardian.initializeAscendHubTasks();
  
  console.log(`✅ ${taskIds.length} tareas inicializadas:`, taskIds);
  
  return { guardian, taskIds };
}

// Ejemplo 2: Flujo completo de una tarea
export async function demonstrateTaskFlow() {
  const { guardian, taskIds } = await initializeGuardianSystem();
  
  // Tomar la primera tarea (eliminar CartSidebar duplicado)
  const taskId = taskIds[0];
  const task = guardian.getTask(taskId);
  
  console.log('📋 Tarea seleccionada:', task?.description);
  
  try {
    // 1. Comenzar la tarea
    await guardian.transitionTask(taskId, TaskState.InProgress, 'Iniciando eliminación de duplicado');
    console.log('🚀 Tarea iniciada');
    
    // 2. Simular trabajo (actualizar archivos modificados)
    guardian.updateModifiedFiles(taskId, [
      'src/components/CartSidebar.tsx',
      'src/components/organisms/CartSidebar.tsx'
    ]);
    console.log('📝 Archivos registrados como modificados');
    
    // 3. Simular tiempo de trabajo
    await new Promise(resolve => setTimeout(resolve, 1000));
    guardian.recordActualTime(taskId, 25); // 25 minutos reales
    
    // 4. Completar la tarea
    await guardian.transitionTask(taskId, TaskState.Completed, 'Duplicado eliminado exitosamente');
    console.log('✅ Tarea completada');
    
    // 5. Verificar la tarea
    await guardian.transitionTask(taskId, TaskState.Verified, 'Revisión aprobada');
    console.log('🎯 Tarea verificada');
    
    // Mostrar progreso
    const progress = guardian.getProgress();
    console.log(`📊 Progreso general: ${progress.completed}/${progress.total} (${progress.percentage}%)`);
    
  } catch (error) {
    console.error('❌ Error en el flujo:', error);
    
    // Manejar error
    await guardian.transitionTask(taskId, TaskState.Failed, 'Error durante la ejecución');
  }
}

// Ejemplo 3: Manejo de dependencias
export async function demonstrateDependencies() {
  const { guardian, taskIds } = await initializeGuardianSystem();
  
  // Intentar completar una tarea que tiene dependencias
  const taskWithDeps = taskIds[2]; // Error boundaries (depende de eliminar duplicados)
  
  try {
    // Esto debería fallar porque la dependencia no está completada
    await guardian.transitionTask(taskWithDeps, TaskState.Completed);
  } catch (error) {
    console.log('⚠️ Dependencia no cumplida (esperado):', error.message);
    
    // Completar la dependencia primero
    const dependency = taskIds[0];
    await guardian.transitionTask(dependency, TaskState.InProgress);
    await guardian.transitionTask(dependency, TaskState.Completed);
    await guardian.transitionTask(dependency, TaskState.Verified);
    
    // Ahora sí se puede completar la tarea dependiente
    await guardian.transitionTask(taskWithDeps, TaskState.InProgress);
    await guardian.transitionTask(taskWithDeps, TaskState.Completed);
    
    console.log('✅ Dependencia resuelta, tarea completada');
  }
}

// Ejemplo 4: Monitoreo y consultas
export async function demonstrateMonitoring() {
  const { guardian } = await initializeGuardianSystem();
  
  // Obtener tareas por estado
  const pendingTasks = guardian.getTasksByState(TaskState.Pending);
  const inProgressTasks = guardian.getTasksByState(TaskState.InProgress);
  
  console.log('📋 Tareas pendientes:', pendingTasks.length);
  console.log('🔄 Tareas en progreso:', inProgressTasks.length);
  
  // Obtener tareas por tipo
  const componentFixes = guardian.getTasksByType(TaskType.ComponentFix);
  const performanceOpts = guardian.getTasksByType(TaskType.PerformanceOpt);
  
  console.log('🔧 Correcciones de componentes:', componentFixes.length);
  console.log('⚡ Optimizaciones de performance:', performanceOpts.length);
  
  // Ver historial de eventos
  const events = guardian.getEventHistory();
  console.log('📚 Eventos registrados:', events.length);
  
  // Mostrar últimos 3 eventos
  const recentEvents = events.slice(-3);
  recentEvents.forEach(event => {
    console.log(`📅 ${event.timestamp.toISOString()}: ${event.type} - ${event.taskId}`);
  });
}

// Ejemplo 5: Integración con React (pseudo-código)
export function useTaskGuardian() {
  // Este sería un hook personalizado para usar en componentes React
  const guardian = new TaskGuardian();
  
  return {
    // Métodos del guardian
    initializeTasks: () => guardian.initializeAscendHubTasks(),
    transitionTask: (id: string, state: TaskState, reason?: string) => 
      guardian.transitionTask(id, state, reason),
    
    // Consultas reactivas
    getAllTasks: () => guardian.getAllTasks(),
    getProgress: () => guardian.getProgress(),
    getTasksByState: (state: TaskState) => guardian.getTasksByState(state),
    
    // Utilidades
    updateFiles: (id: string, files: string[]) => guardian.updateModifiedFiles(id, files),
    recordTime: (id: string, minutes: number) => guardian.recordActualTime(id, minutes),
  };
}

// Ejemplo 6: Función principal para demostrar todo
export async function runCompleteDemo() {
  console.log('🎬 Iniciando demostración completa del Sistema de Guardianes\n');
  
  try {
    console.log('1️⃣ Flujo básico de tarea:');
    await demonstrateTaskFlow();
    console.log('\n');
    
    console.log('2️⃣ Manejo de dependencias:');
    await demonstrateDependencies();
    console.log('\n');
    
    console.log('3️⃣ Monitoreo y consultas:');
    await demonstrateMonitoring();
    console.log('\n');
    
    console.log('🎉 Demostración completada exitosamente!');
    
  } catch (error) {
    console.error('💥 Error en la demostración:', error);
  }
}

// Para ejecutar la demo:
// runCompleteDemo();