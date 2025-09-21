import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { Apple, Smartphone, ArrowRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-brand-blue to-primary-glow text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">
              Renovate tu tecnología con <span className="text-yellow-400">AscendHub</span>
            </h1>
            <p className="text-xl md:text-2xl font-body mb-8 text-gray-200 max-w-3xl mx-auto">
              Comprá productos premium, entregá tu equipo viejo como parte de pago 
              y ascendé a la última tecnología sin esfuerzo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="btn-text">
                <Link to="/parte-de-pago">Evaluar mi Trade-In</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-blue btn-text" asChild>
                <Link to="#secciones">Explorar Productos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Sections - Apple World & Premium Electronics */}
      <section id="secciones" className="py-20 bg-brand-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-brand-heading mb-4">
              Explorá nuestras secciones
            </h2>
            <p className="text-brand-body max-w-2xl mx-auto">
              Dos mundos únicos de tecnología premium diseñados para diferentes experiencias
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Apple World Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="text-center">
                <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-gray-200 transition-colors">
                  <Apple className="h-10 w-10 text-gray-700" />
                </div>
                <h3 className="text-brand-subheading mb-4">Mundo Apple</h3>
                <p className="text-brand-body mb-6 leading-relaxed">
                  Descubrí la experiencia Apple completa. iPhone, iPad, Mac, Apple Watch y más. 
                  Diseño minimalista, calidad premium y el ecosistema que ya conocés y amás.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">iPhone</span>
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">iPad</span>
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">Mac</span>
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">Apple Watch</span>
                </div>
                <Button asChild className="w-full btn-text">
                  <Link to="/apple">
                    Explorar Apple <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Premium Electronics Section */}
            <div className="bg-gradient-to-br from-brand-blue to-primary-glow rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group text-white">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:bg-white/30 transition-colors">
                  <Smartphone className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-brand-subheading mb-4">Mundo Gaming</h3>
                <p className="text-brand-body mb-6 leading-relaxed">
                  Sumérgete en el universo gaming. PlayStation, Xbox, Nintendo, PC Gaming y accesorios. 
                  Rendimiento extremo, gráficos increíbles y la adrenalina que buscás.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">PlayStation</span>
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">Xbox</span>
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">Nintendo</span>
                  <span className="px-3 py-1 bg-brand-light-gray text-brand-gray-dark rounded-full text-sm font-body">PC Gaming</span>
                </div>
                <Button asChild className="w-full btn-text">
                  <Link to="/gaming">
                    Explorar Gaming <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-brand-heading mb-4">
              ¿Por qué elegir AscendHub?
            </h2>
            <p className="text-brand-body max-w-2xl mx-auto">
              La forma más inteligente de renovar tu tecnología
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent-green rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">💰</span>
              </div>
              <h3 className="text-brand-subheading mb-2">Trade-In Inteligente</h3>
              <p className="text-brand-body">
                Evaluamos tu equipo actual y te damos el mejor precio como parte de pago
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent-orange rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">🚀</span>
              </div>
              <h3 className="text-brand-subheading mb-2">Productos Premium</h3>
              <p className="text-brand-body">
                Solo trabajamos con las mejores marcas y los productos más innovadores
              </p>
            </div>

            <div className="text-center">
              <div className="bg-accent-purple rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">⚡</span>
              </div>
              <h3 className="text-brand-subheading mb-2">Proceso Rápido</h3>
              <p className="text-brand-body">
                Evaluación instantánea, compra segura y entrega rápida en todo el país
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-blue to-primary-glow text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
            ¿Listo para ascender a la próxima generación?
          </h2>
          <p className="text-xl font-body mb-8 text-gray-200">
            Comenzá tu proceso de trade-in hoy y descubrí cuánto vale tu equipo actual
          </p>
          <Button size="lg" variant="secondary" asChild className="btn-text">
            <Link to="/parte-de-pago">Evaluar mi Trade-In Ahora</Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
