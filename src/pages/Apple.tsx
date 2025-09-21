import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { getProductsBySection } from '@/lib/products';
import { Apple, ArrowRight } from 'lucide-react';

const ApplePage = () => {
  const appleProducts = getProductsBySection('apple');

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Apple Style */}
      <section className="pt-16 sm:pt-20 pb-12 sm:pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <Apple className="h-12 w-12 sm:h-16 sm:w-16 text-gray-800" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-4 sm:mb-6 px-4">
            Think different.
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 font-light px-4">
            Descubrí la experiencia Apple completa. Productos que cambian la forma 
            en que trabajás, jugás y te conectás con el mundo.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium text-sm sm:text-base"
            asChild
          >
            <Link to="/trade-in">
              <span className="hidden sm:inline">Evaluar tu Trade-In</span>
              <span className="sm:hidden">Trade-In</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-light text-gray-900 mb-3 sm:mb-4 px-4">
              Productos Apple
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explorá nuestra colección completa de productos Apple con la última tecnología
            </p>
          </div>
          
          <ProductGrid 
            products={appleProducts}
            section="apple"
            showFilters={true}
            itemsPerPage={12}
          />
        </div>
      </section>

      {/* Trade-In CTA */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-gray-900 mb-4 sm:mb-6 px-4">
            ¿Tenés un dispositivo Apple para intercambiar?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Evaluá tu equipo actual y usalo como parte de pago para tu próximo producto Apple
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 rounded-full font-medium text-sm sm:text-base"
            asChild
          >
            <Link to="/trade-in">
              <span className="hidden sm:inline">Comenzar Trade-In</span>
              <span className="sm:hidden">Trade-In</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApplePage;