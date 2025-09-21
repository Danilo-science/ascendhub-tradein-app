import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Camera, CheckCircle } from 'lucide-react';

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

  const handleInputChange = (field: keyof TradeInFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    if (files.length + formData.imagenes.length > 6) {
      alert('Máximo 6 imágenes permitidas');
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      imagenes: [...prev.imagenes, ...files]
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
    setIsSubmitting(true);
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitted(true);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-brand-heading mb-4">
              Evaluá tu Trade-In
            </h1>
            <p className="text-brand-body max-w-2xl mx-auto">
              Completá el formulario para recibir una valuación de tu dispositivo. 
              Nuestro equipo te contactará con una propuesta personalizada.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3, 4].map((step) => (
                <React.Fragment key={step}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-brand-blue text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 ${
                      currentStep > step ? 'bg-brand-blue' : 'bg-gray-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Información del Producto */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>Información del Producto</CardTitle>
                  <CardDescription>
                    Contanos sobre el dispositivo que querés entregar como parte de pago
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="categoria">Categoría *</Label>
                      <Select value={formData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="smartphone">Smartphone</SelectItem>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="laptop">Laptop</SelectItem>
                          <SelectItem value="smartwatch">Smartwatch</SelectItem>
                          <SelectItem value="auriculares">Auriculares</SelectItem>
                          <SelectItem value="consola">Consola de Juegos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="marca">Marca *</Label>
                      <Select value={formData.marca} onValueChange={(value) => handleInputChange('marca', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar marca" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apple">Apple</SelectItem>
                          <SelectItem value="samsung">Samsung</SelectItem>
                          <SelectItem value="sony">Sony</SelectItem>
                          <SelectItem value="huawei">Huawei</SelectItem>
                          <SelectItem value="xiaomi">Xiaomi</SelectItem>
                          <SelectItem value="nintendo">Nintendo</SelectItem>
                          <SelectItem value="playstation">PlayStation</SelectItem>
                          <SelectItem value="xbox">Xbox</SelectItem>
                          <SelectItem value="otra">Otra</SelectItem>
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
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Dispositivo</CardTitle>
                  <CardDescription>
                    Evaluá honestamente el estado de tu dispositivo para una valuación precisa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="estadoGeneral">Estado General *</Label>
                    <Select value={formData.estadoGeneral} onValueChange={(value) => handleInputChange('estadoGeneral', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente - Como nuevo</SelectItem>
                        <SelectItem value="muy-bueno">Muy Bueno - Signos mínimos de uso</SelectItem>
                        <SelectItem value="bueno">Bueno - Signos normales de uso</SelectItem>
                        <SelectItem value="regular">Regular - Signos evidentes de uso</SelectItem>
                        <SelectItem value="malo">Malo - Daños visibles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="pantalla">Estado de la Pantalla *</Label>
                      <Select value={formData.pantalla} onValueChange={(value) => handleInputChange('pantalla', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado de pantalla" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="perfecta">Perfecta - Sin rayones ni grietas</SelectItem>
                          <SelectItem value="rayones-menores">Rayones menores</SelectItem>
                          <SelectItem value="rayones-visibles">Rayones visibles</SelectItem>
                          <SelectItem value="grieta-pequena">Grieta pequeña</SelectItem>
                          <SelectItem value="grieta-grande">Grieta grande</SelectItem>
                          <SelectItem value="rota">Pantalla rota</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="bateria">Estado de la Batería</Label>
                      <Select value={formData.bateria} onValueChange={(value) => handleInputChange('bateria', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Estado de batería" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente - Dura todo el día</SelectItem>
                          <SelectItem value="buena">Buena - Dura la mayor parte del día</SelectItem>
                          <SelectItem value="regular">Regular - Necesita carga frecuente</SelectItem>
                          <SelectItem value="mala">Mala - Se agota rápidamente</SelectItem>
                          <SelectItem value="no-funciona">No funciona</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="funcionamiento">Funcionamiento General *</Label>
                    <Select value={formData.funcionamiento} onValueChange={(value) => handleInputChange('funcionamiento', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="¿Cómo funciona el dispositivo?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="perfecto">Perfecto - Todo funciona correctamente</SelectItem>
                        <SelectItem value="problemas-menores">Problemas menores ocasionales</SelectItem>
                        <SelectItem value="problemas-frecuentes">Problemas frecuentes</SelectItem>
                        <SelectItem value="no-enciende">No enciende</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Accesorios Incluidos</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {['Cargador original', 'Auriculares', 'Caja original', 'Funda/Case', 'Protector de pantalla', 'Manual'].map((accesorio) => (
                        <label key={accesorio} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.accesorios.includes(accesorio)}
                            onChange={(e) => handleAccesoriosChange(accesorio, e.target.checked)}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">{accesorio}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Imágenes */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>Fotos del Dispositivo</CardTitle>
                  <CardDescription>
                    Subí fotos claras de tu dispositivo (máximo 6 imágenes). 
                    Incluí fotos del frente, dorso y cualquier daño visible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          Hacé clic para subir fotos
                        </p>
                        <p className="text-sm text-gray-500">
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
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Camera className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Consejos para mejores fotos:</h4>
                          <ul className="text-sm text-blue-700 mt-1 space-y-1">
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
              <Card>
                <CardHeader>
                  <CardTitle>Información de Contacto</CardTitle>
                  <CardDescription>
                    Necesitamos tus datos para contactarte con la valuación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nombre">Nombre Completo *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        placeholder="Tu nombre completo"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="tu@email.com"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="telefono">Teléfono *</Label>
                      <Input
                        id="telefono"
                        value={formData.telefono}
                        onChange={(e) => handleInputChange('telefono', e.target.value)}
                        placeholder="+54 9 11 1234-5678"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => handleInputChange('ciudad', e.target.value)}
                        placeholder="Buenos Aires, Córdoba, etc."
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="descripcionAdicional">Información Adicional</Label>
                    <Textarea
                      id="descripcionAdicional"
                      value={formData.descripcionAdicional}
                      onChange={(e) => handleInputChange('descripcionAdicional', e.target.value)}
                      placeholder="Contanos cualquier detalle adicional sobre tu dispositivo que consideres importante..."
                      rows={4}
                    />
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
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
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.nombre || !formData.email || !formData.telefono || !formData.ciudad}
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