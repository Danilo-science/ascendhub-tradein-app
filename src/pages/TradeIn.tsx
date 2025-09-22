import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { validateTradeInForm, sanitizeString, isValidImageFile, checkRateLimit } from '@/lib/security';
import { toast } from '@/hooks/use-toast';

interface TradeInFormData {
  // Información del producto
  categoria: string;
  marca: string;
  modelo: string;
  anio: string;
  color: string;
  capacidad: string;
  
  // Estado del dispositivo
  estadoGeneral: string;
  pantalla: string;
  bateria: string;
  funcionamiento: string;
  accesorios: string[];
  
  // Información personal
  nombre: string;
  email: string;
  telefono: string;
  ciudad: string;
  
  // Detalles adicionales
  descripcionAdicional: string;
  imagenes: File[];
}

const TradeIn = () => {
  const [formData, setFormData] = useState<TradeInFormData>({
    categoria: '',
    marca: '',
    modelo: '',
    anio: '',
    color: '',
    capacidad: '',
    estadoGeneral: '',
    pantalla: '',
    bateria: '',
    funcionamiento: '',
    accesorios: [],
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    descripcionAdicional: '',
    imagenes: []
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (field: keyof TradeInFormData, value: string) => {
    // Sanitizar el input antes de guardarlo
    const sanitizedValue = sanitizeString(value);
    
    setFormData(prev => ({
      ...prev,
      [field]: sanitizedValue
    }));
    
    // Limpiar errores de validación cuando el usuario empiece a escribir
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleAccesoriosChange = (accesorio: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      accesorios: checked 
        ? [...prev.accesorios, accesorio]
        : prev.accesorios.filter(a => a !== accesorio)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validar cada archivo
    const validFiles: File[] = [];
    const errors: string[] = [];
    
    files.forEach(file => {
      if (!isValidImageFile(file)) {
        errors.push(`${file.name}: Formato no válido o archivo muy grande (máx. 5MB)`);
      } else {
        validFiles.push(file);
      }
    });
    
    if (errors.length > 0) {
      toast({
        title: "Error en archivos",
        description: errors.join(', '),
        variant: "destructive",
      });
      return;
    }
    
    // Verificar límite total de imágenes
    const totalImages = formData.imagenes.length + validFiles.length;
    if (totalImages > 6) {
      toast({
        title: "Límite excedido",
        description: "No puedes subir más de 6 imágenes en total",
        variant: "destructive",
      });
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...validFiles]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting - prevenir spam
    const userIdentifier = formData.email || 'anonymous';
    if (!checkRateLimit(userIdentifier, 3, 300000)) { // 3 intentos por 5 minutos
      toast({
        title: "Demasiados intentos",
        description: "Por favor espera unos minutos antes de intentar nuevamente",
        variant: "destructive",
      });
      return;
    }
    
    // Validar formulario completo
    const validation = validateTradeInForm(formData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: "Errores en el formulario",
        description: "Por favor corrige los errores indicados",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    setValidationErrors([]);
    
    try {
      // Simular envío del formulario con validación adicional
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de envío a la API
      // const response = await submitTradeInRequest(formData);
      
      setSubmitted(true);
      
      toast({
        title: "Solicitud enviada",
        description: "Tu solicitud de trade-in ha sido enviada exitosamente",
      });
    } catch (error) {
      toast({
        title: "Error al enviar",
        description: "Hubo un problema al enviar tu solicitud. Inténtalo nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Navigation />
        <div className="pt-16 pb-20">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-brand-heading mb-4">
                ¡Solicitud Enviada Exitosamente!
              </h1>
              <p className="text-brand-body mb-6">
                Hemos recibido tu solicitud de Trade-In. Nuestro equipo evaluará tu dispositivo 
                y te contactaremos dentro de las próximas 24-48 horas con una propuesta.
              </p>
              <div className="bg-brand-light-gray rounded-lg p-4 mb-6">
                <p className="text-sm font-body text-brand-gray">
                  <strong>Número de solicitud:</strong> TI-{Date.now().toString().slice(-6)}
                </p>
                <p className="text-sm font-body text-brand-gray">
                  Te enviaremos un email de confirmación a <strong>{formData.email}</strong>
                </p>
              </div>
              <Button asChild className="btn-text">
                <a href="/">Volver al Inicio</a>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Evaluá tu Trade-In
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Completá el formulario para recibir una valuación de tu dispositivo. 
              Nuestro equipo te contactará con una propuesta personalizada.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg backdrop-blur-sm border transition-all duration-300 ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/50 shadow-blue-500/25' 
                      : 'bg-white/10 text-gray-400 border-white/20 hover:bg-white/20'
                  }`}>
                    {currentStep > step ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 4 && (
                    <div className={`w-16 h-1 rounded-full transition-all duration-500 ${
                      currentStep > step 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-blue-500/25' 
                        : 'bg-white/20'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Mostrar errores de validación */}
            {validationErrors.length > 0 && (
              <Card className="mb-6 border-red-400/50 bg-red-500/10 backdrop-blur-sm shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-200 mb-2">
                        Por favor corrige los siguientes errores:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-300">
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            {/* Step 1: Información del Producto */}
            {currentStep === 1 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-white text-xl">Información del Producto</CardTitle>
                  <CardDescription className="text-gray-300">
                    Contanos sobre el dispositivo que querés entregar como parte de pago
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="categoria" className="text-gray-200 font-medium">Categoría *</Label>
                      <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all">
                          <SelectValue placeholder="Seleccionar categoría" className="text-gray-300" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800/95 border-white/20 backdrop-blur-md">
                          <SelectItem value="smartphone" className="text-white hover:bg-white/10">Smartphone</SelectItem>
                          <SelectItem value="tablet" className="text-white hover:bg-white/10">Tablet</SelectItem>
                          <SelectItem value="laptop" className="text-white hover:bg-white/10">Laptop</SelectItem>
                          <SelectItem value="smartwatch" className="text-white hover:bg-white/10">Smartwatch</SelectItem>
                          <SelectItem value="auriculares" className="text-white hover:bg-white/10">Auriculares</SelectItem>
                          <SelectItem value="consola" className="text-white hover:bg-white/10">Consola de Juegos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="marca" className="text-gray-200 font-medium">Marca *</Label>
                      <Select value={formData.marca} onValueChange={(value) => handleInputChange('marca', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/20 transition-all">
                          <SelectValue placeholder="Seleccionar marca" className="text-gray-300" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800/95 border-white/20 backdrop-blur-md">
                          <SelectItem value="apple" className="text-white hover:bg-white/10">Apple</SelectItem>
                          <SelectItem value="samsung" className="text-white hover:bg-white/10">Samsung</SelectItem>
                          <SelectItem value="sony" className="text-white hover:bg-white/10">Sony</SelectItem>
                          <SelectItem value="huawei" className="text-white hover:bg-white/10">Huawei</SelectItem>
                          <SelectItem value="xiaomi" className="text-white hover:bg-white/10">Xiaomi</SelectItem>
                          <SelectItem value="nintendo" className="text-white hover:bg-white/10">Nintendo</SelectItem>
                          <SelectItem value="playstation" className="text-white hover:bg-white/10">PlayStation</SelectItem>
                          <SelectItem value="xbox" className="text-white hover:bg-white/10">Xbox</SelectItem>
                          <SelectItem value="otra" className="text-white hover:bg-white/10">Otra</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="modelo">Modelo *</Label>
                      <Input
                        id="modelo"
                        value={formData.modelo}
                        onChange={(e) => handleInputChange('modelo', e.target.value)}
                        placeholder="ej: iPhone 14 Pro, Galaxy S23, etc."
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="anio">Año de Compra</Label>
                      <Select value={formData.anio} onValueChange={(value) => handleInputChange('anio', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar año" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({length: 8}, (_, i) => 2024 - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        placeholder="ej: Negro, Blanco, Azul, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor="capacidad">Capacidad/Memoria</Label>
                      <Input
                        id="capacidad"
                        value={formData.capacidad}
                        onChange={(e) => handleInputChange('capacidad', e.target.value)}
                        placeholder="ej: 128GB, 256GB, 8GB RAM, etc."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Estado del Dispositivo */}
            {currentStep === 2 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-bold">Estado del Dispositivo</CardTitle>
                  <CardDescription className="text-gray-200">
                    Evaluá honestamente el estado de tu dispositivo para una valuación precisa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="estadoGeneral" className="text-gray-200 font-medium">Estado General *</Label>
                    <Select value={formData.estadoGeneral} onValueChange={(value) => handleInputChange('estadoGeneral', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-200">
                        <SelectValue placeholder="Seleccionar estado" className="text-gray-300" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 border-white/20 backdrop-blur-md">
                        <SelectItem value="excelente" className="text-white hover:bg-white/10 focus:bg-white/10">Excelente - Como nuevo</SelectItem>
                        <SelectItem value="muy-bueno" className="text-white hover:bg-white/10 focus:bg-white/10">Muy Bueno - Signos mínimos de uso</SelectItem>
                        <SelectItem value="bueno" className="text-white hover:bg-white/10 focus:bg-white/10">Bueno - Signos normales de uso</SelectItem>
                        <SelectItem value="regular" className="text-white hover:bg-white/10 focus:bg-white/10">Regular - Signos evidentes de uso</SelectItem>
                        <SelectItem value="malo" className="text-white hover:bg-white/10 focus:bg-white/10">Malo - Daños visibles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="pantalla" className="text-gray-200 font-medium">Estado de la Pantalla *</Label>
                      <Select value={formData.pantalla} onValueChange={(value) => handleInputChange('pantalla', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-200">
                          <SelectValue placeholder="Estado de pantalla" className="text-gray-300" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800/95 border-white/20 backdrop-blur-md">
                          <SelectItem value="perfecta" className="text-white hover:bg-white/10 focus:bg-white/10">Perfecta - Sin rayones ni grietas</SelectItem>
                          <SelectItem value="rayones-menores" className="text-white hover:bg-white/10 focus:bg-white/10">Rayones menores</SelectItem>
                          <SelectItem value="rayones-visibles" className="text-white hover:bg-white/10 focus:bg-white/10">Rayones visibles</SelectItem>
                          <SelectItem value="grieta-pequena" className="text-white hover:bg-white/10 focus:bg-white/10">Grieta pequeña</SelectItem>
                          <SelectItem value="grieta-grande" className="text-white hover:bg-white/10 focus:bg-white/10">Grieta grande</SelectItem>
                          <SelectItem value="rota" className="text-white hover:bg-white/10 focus:bg-white/10">Pantalla rota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bateria" className="text-gray-200 font-medium">Estado de la Batería</Label>
                      <Select value={formData.bateria} onValueChange={(value) => handleInputChange('bateria', value)}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-200">
                          <SelectValue placeholder="Estado de batería" className="text-gray-300" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800/95 border-white/20 backdrop-blur-md">
                          <SelectItem value="excelente" className="text-white hover:bg-white/10 focus:bg-white/10">Excelente - Dura todo el día</SelectItem>
                          <SelectItem value="buena" className="text-white hover:bg-white/10 focus:bg-white/10">Buena - Dura la mayor parte del día</SelectItem>
                          <SelectItem value="regular" className="text-white hover:bg-white/10 focus:bg-white/10">Regular - Necesita carga frecuente</SelectItem>
                          <SelectItem value="mala" className="text-white hover:bg-white/10 focus:bg-white/10">Mala - Se agota rápidamente</SelectItem>
                          <SelectItem value="no-funciona" className="text-white hover:bg-white/10 focus:bg-white/10">No funciona</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="funcionamiento" className="text-gray-200 font-medium">Funcionamiento General *</Label>
                    <Select value={formData.funcionamiento} onValueChange={(value) => handleInputChange('funcionamiento', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white backdrop-blur-sm hover:bg-white/15 transition-all duration-200">
                        <SelectValue placeholder="¿Cómo funciona el dispositivo?" className="text-gray-300" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800/95 border-white/20 backdrop-blur-md">
                        <SelectItem value="perfecto" className="text-white hover:bg-white/10 focus:bg-white/10">Perfecto - Todo funciona correctamente</SelectItem>
                        <SelectItem value="problemas-menores" className="text-white hover:bg-white/10 focus:bg-white/10">Problemas menores ocasionales</SelectItem>
                        <SelectItem value="problemas-frecuentes" className="text-white hover:bg-white/10 focus:bg-white/10">Problemas frecuentes</SelectItem>
                        <SelectItem value="no-enciende" className="text-white hover:bg-white/10 focus:bg-white/10">No enciende</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-200 font-medium">Accesorios Incluidos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {['Cargador original', 'Auriculares', 'Caja original', 'Funda/Case', 'Protector de pantalla', 'Manual'].map((accesorio) => (
                        <label key={accesorio} className="flex items-center space-x-2 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.accesorios.includes(accesorio)}
                            onChange={(e) => handleAccesoriosChange(accesorio, e.target.checked)}
                            className="w-4 h-4 rounded border-white/30 bg-white/10 text-blue-500 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0"
                          />
                          <span className="text-sm text-gray-200">{accesorio}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Imágenes */}
            {currentStep === 3 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-bold">Fotos del Dispositivo</CardTitle>
                  <CardDescription className="text-gray-200">
                    Subí fotos claras de tu dispositivo (máximo 6 imágenes). 
                    Incluí fotos del frente, dorso y cualquier daño visible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/30 rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-all duration-200">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-200 mb-2">
                          Hacé clic para subir fotos
                        </p>
                        <p className="text-sm text-gray-300">
                          PNG, JPG hasta 5MB cada una (máximo 6 fotos)
                        </p>
                      </label>
                    </div>

                    {formData.imagenes.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {formData.imagenes.map((file, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-white/20"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full p-1 hover:bg-red-600/90 transition-all duration-200"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-start space-x-3">
                        <Camera className="h-5 w-5 text-blue-300 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-200">Consejos para mejores fotos:</h4>
                          <ul className="text-sm text-blue-100 mt-1 space-y-1">
                            <li>• Usá buena iluminación natural</li>
                            <li>• Mostrá todos los lados del dispositivo</li>
                            <li>• Incluí fotos de cualquier daño o desgaste</li>
                            <li>• Asegurate que las fotos estén enfocadas</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Información Personal */}
            {currentStep === 4 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-xl shadow-black/20">
                <CardHeader>
                  <CardTitle className="text-white text-2xl font-bold">Información de Contacto</CardTitle>
                  <CardDescription className="text-gray-200">
                    Necesitamos tus datos para contactarte con la valuación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nombre" className="text-gray-200 font-medium">Nombre Completo *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm hover:bg-white/15 focus:bg-white/15 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-200 font-medium">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm hover:bg-white/15 focus:bg-white/15 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefono" className="text-gray-200 font-medium">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        placeholder="+54 9 11 1234-5678"
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm hover:bg-white/15 focus:bg-white/15 transition-all duration-200"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ciudad" className="text-gray-200 font-medium">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        placeholder="Buenos Aires, Córdoba, etc."
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm hover:bg-white/15 focus:bg-white/15 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descripcionAdicional" className="text-gray-200 font-medium">Información Adicional</Label>
                    <Textarea
                      id="descripcionAdicional"
                      value={formData.descripcionAdicional}
                      onChange={(e) => handleInputChange('descripcionAdicional', e.target.value)}
                      placeholder="Contanos cualquier detalle adicional sobre tu dispositivo que consideres importante..."
                      rows={4}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm hover:bg-white/15 focus:bg-white/15 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm text-blue-100">
                      Al enviar este formulario, aceptás que AscendHub se comunique contigo 
                      para coordinar la evaluación y propuesta de tu dispositivo. 
                      Tus datos están protegidos según nuestra política de privacidad.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                Anterior
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && (!formData.categoria || !formData.marca || !formData.modelo)) ||
                    (currentStep === 2 && (!formData.estadoGeneral || !formData.pantalla || !formData.funcionamiento))
                  }
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.nombre || !formData.email || !formData.telefono || !formData.ciudad}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TradeIn;