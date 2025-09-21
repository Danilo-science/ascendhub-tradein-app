import React, { useState } from 'react';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';

interface TradeInRequest {
  id: string;
  customerName: string;
  email: string;
  device: string;
  condition: string;
  estimatedValue: number;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const mockTradeIns: TradeInRequest[] = [
  {
    id: '1',
    customerName: 'Juan Pérez',
    email: 'juan@email.com',
    device: 'iPhone 14 Pro',
    condition: 'Excelente',
    estimatedValue: 850000,
    status: 'pending',
    submittedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    customerName: 'María García',
    email: 'maria@email.com',
    device: 'MacBook Air M2',
    condition: 'Bueno',
    estimatedValue: 1200000,
    status: 'approved',
    submittedAt: '2024-01-14T15:45:00Z'
  },
  {
    id: '3',
    customerName: 'Carlos López',
    email: 'carlos@email.com',
    device: 'iPad Pro 12.9"',
    condition: 'Regular',
    estimatedValue: 650000,
    status: 'rejected',
    submittedAt: '2024-01-13T09:15:00Z'
  }
];

export default function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tradeIns, setTradeIns] = useState<TradeInRequest[]>(mockTradeIns);

  const updateTradeInStatus = (id: string, status: 'approved' | 'rejected') => {
    setTradeIns(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pendiente</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprobado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rechazado</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = {
    total: tradeIns.length,
    pending: tradeIns.filter(t => t.status === 'pending').length,
    approved: tradeIns.filter(t => t.status === 'approved').length,
    rejected: tradeIns.filter(t => t.status === 'rejected').length,
    totalValue: tradeIns.filter(t => t.status === 'approved').reduce((sum, t) => sum + t.estimatedValue, 0)
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-6">
            <h2 className="text-brand-heading text-brand-blue mb-6">Panel Admin</h2>
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                className="w-full justify-start btn-text"
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant={activeTab === 'tradein' ? 'default' : 'ghost'}
                className="w-full justify-start btn-text"
                onClick={() => setActiveTab('tradein')}
              >
                <Package className="mr-2 h-4 w-4" />
                Trade-ins
              </Button>
              <Button
                variant={activeTab === 'users' ? 'default' : 'ghost'}
                className="w-full justify-start btn-text"
                onClick={() => setActiveTab('users')}
              >
                <Users className="mr-2 h-4 w-4" />
                Usuarios
              </Button>
              <Button
                variant={activeTab === 'settings' ? 'default' : 'ghost'}
                className="w-full justify-start btn-text"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {activeTab === 'dashboard' && (
            <div>
              <h1 className="text-brand-heading text-brand-blue mb-6">Dashboard</h1>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                    <Clock className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                    <TrendingUp className="h-4 w-4 text-brand-blue" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-brand-blue">{formatCurrency(stats.totalValue)}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Trade-ins */}
              <Card>
                <CardHeader>
                  <CardTitle>Solicitudes Recientes</CardTitle>
                  <CardDescription>Últimas solicitudes de trade-in recibidas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tradeIns.slice(0, 3).map((tradeIn) => (
                      <div key={tradeIn.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{tradeIn.customerName}</p>
                          <p className="text-sm text-gray-600">{tradeIn.device}</p>
                          <p className="text-sm text-gray-500">{formatDate(tradeIn.submittedAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(tradeIn.estimatedValue)}</p>
                          {getStatusBadge(tradeIn.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'tradein' && (
            <div>
              <h1 className="text-brand-heading text-brand-blue mb-6">Gestión de Trade-ins</h1>
              
              <Card>
                <CardHeader>
                  <CardTitle>Todas las Solicitudes</CardTitle>
                  <CardDescription>Gestiona las solicitudes de trade-in de los clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tradeIns.map((tradeIn) => (
                      <div key={tradeIn.id} className="border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-brand-subheading">{tradeIn.customerName}</h3>
                            <p className="text-brand-body">{tradeIn.email}</p>
                          </div>
                          {getStatusBadge(tradeIn.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Dispositivo</p>
                            <p className="text-brand-body">{tradeIn.device}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Condición</p>
                            <p className="text-brand-body">{tradeIn.condition}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Valor Estimado</p>
                            <p className="text-brand-body font-semibold">{formatCurrency(tradeIn.estimatedValue)}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-600">Fecha de Solicitud</p>
                          <p className="text-brand-body">{formatDate(tradeIn.submittedAt)}</p>
                        </div>
                        
                        {tradeIn.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              onClick={() => updateTradeInStatus(tradeIn.id, 'approved')}
                              className="btn-text bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Aprobar
                            </Button>
                            <Button
                              onClick={() => updateTradeInStatus(tradeIn.id, 'rejected')}
                              variant="destructive"
                              className="btn-text"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Rechazar
                            </Button>
                            <Button variant="outline" className="btn-text">
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h1 className="text-brand-heading text-brand-blue mb-6">Gestión de Usuarios</h1>
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-brand-body">Funcionalidad de usuarios en desarrollo</p>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h1 className="text-brand-heading text-brand-blue mb-6">Configuración</h1>
              <Card>
                <CardContent className="p-8 text-center">
                  <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-brand-body">Panel de configuración en desarrollo</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}