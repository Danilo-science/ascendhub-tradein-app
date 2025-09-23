import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  Monitor, 
  RefreshCw, 
  Shield, 
  TrendingUp,
  Zap,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';

interface SystemMetrics {
  uptime: string;
  totalRequests: number;
  errorRate: number;
  avgResponseTime: number;
  memoryUsage: number;
  cpuUsage: number;
  activeUsers: number;
  cacheHitRate: number;
}

interface TaskStatus {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress: number;
  startTime: string;
  duration?: string;
  error?: string;
}

interface SecurityAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const TaskGuardianDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    uptime: '99.9%',
    totalRequests: 15420,
    errorRate: 0.2,
    avgResponseTime: 145,
    memoryUsage: 68,
    cpuUsage: 42,
    activeUsers: 1247,
    cacheHitRate: 94.5
  });

  const [tasks, setTasks] = useState<TaskStatus[]>([
    {
      id: '1',
      name: 'Skeleton Loader Implementation',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15 10:30:00',
      duration: '2h 15m'
    },
    {
      id: '2',
      name: 'Critical Tests Execution',
      status: 'completed',
      progress: 100,
      startTime: '2024-01-15 08:15:00',
      duration: '1h 45m'
    },
    {
      id: '3',
      name: 'Performance Optimization',
      status: 'running',
      progress: 75,
      startTime: '2024-01-15 12:00:00'
    },
    {
      id: '4',
      name: 'Security Audit',
      status: 'pending',
      progress: 0,
      startTime: '2024-01-15 14:00:00'
    }
  ]);

  const [alerts, setAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'info',
      message: 'Sistema funcionando correctamente',
      timestamp: '2024-01-15 13:45:00',
      resolved: true
    },
    {
      id: '2',
      type: 'warning',
      message: 'Uso de memoria por encima del 65%',
      timestamp: '2024-01-15 13:30:00',
      resolved: false
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshMetrics = async () => {
    setIsRefreshing(true);
    // Simular actualización de métricas
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setMetrics(prev => ({
      ...prev,
      totalRequests: prev.totalRequests + Math.floor(Math.random() * 100),
      avgResponseTime: Math.floor(Math.random() * 50) + 120,
      memoryUsage: Math.floor(Math.random() * 20) + 60,
      cpuUsage: Math.floor(Math.random() * 30) + 30,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 20) - 10
    }));
    
    setIsRefreshing(false);
  };

  const getStatusColor = (status: TaskStatus['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      case 'pending': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: TaskStatus['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'running': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: SecurityAlert['type']) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'secondary';
      case 'info': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">TaskGuardian Dashboard</h1>
                <p className="text-gray-400">Sistema de monitoreo y control en tiempo real</p>
              </div>
            </div>
            <Button 
              onClick={refreshMetrics} 
              disabled={isRefreshing}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20">
              <Monitor className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white/20">
              <Activity className="h-4 w-4 mr-2" />
              Tareas
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-white/20">
              <Shield className="h-4 w-4 mr-2" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analíticas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* System Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Tiempo Activo</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.uptime}</div>
                    <p className="text-xs text-gray-400">Sistema estable</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Solicitudes Totales</CardTitle>
                    <Zap className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.totalRequests.toLocaleString()}</div>
                    <p className="text-xs text-gray-400">+12% desde ayer</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Tiempo de Respuesta</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.avgResponseTime}ms</div>
                    <p className="text-xs text-gray-400">Promedio últimas 24h</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">Usuarios Activos</CardTitle>
                    <Eye className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{metrics.activeUsers.toLocaleString()}</div>
                    <p className="text-xs text-gray-400">En línea ahora</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Resource Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Uso de Recursos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Memoria</span>
                      <span className="text-white">{metrics.memoryUsage}%</span>
                    </div>
                    <Progress value={metrics.memoryUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">CPU</span>
                      <span className="text-white">{metrics.cpuUsage}%</span>
                    </div>
                    <Progress value={metrics.cpuUsage} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-300">Cache Hit Rate</span>
                      <span className="text-white">{metrics.cacheHitRate}%</span>
                    </div>
                    <Progress value={metrics.cacheHitRate} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Estado del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">API Gateway</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Operativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Base de Datos</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Operativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Cache Redis</span>
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Operativo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">CDN</span>
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Degradado
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Tareas del Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitoreo en tiempo real de todas las tareas ejecutándose
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getStatusColor(task.status)}/20`}>
                          {getStatusIcon(task.status)}
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{task.name}</h4>
                          <p className="text-sm text-gray-400">
                            Iniciado: {task.startTime}
                            {task.duration && ` • Duración: ${task.duration}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-sm text-white">{task.progress}%</div>
                          <Progress value={task.progress} className="w-20 h-2" />
                        </div>
                        <Badge variant={task.status === 'completed' ? 'default' : 'secondary'}>
                          {task.status}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Alertas de Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert, index) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant={getAlertColor(alert.type)}>
                          {alert.type}
                        </Badge>
                        <div>
                          <p className="text-white text-sm">{alert.message}</p>
                          <p className="text-xs text-gray-400">{alert.timestamp}</p>
                        </div>
                      </div>
                      {alert.resolved && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Analíticas del Sistema</CardTitle>
                <CardDescription className="text-gray-400">
                  Métricas detalladas y tendencias de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Gráficos de analíticas en desarrollo</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Próximamente: Gráficos interactivos con Chart.js
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskGuardianDashboard;