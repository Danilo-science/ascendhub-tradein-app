import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { getProductsBySection } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Zap, ArrowRight } from 'lucide-react';

const ElectronicsPage = () => {
  const electronicsProducts = getProductsBySection('electronics');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-purple-900 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 text-center">
          <Zap className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 text-yellow-400" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">Tecnología Premium</h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Descubre los mejores dispositivos electrónicos del mercado. Calidad garantizada y precios competitivos.
          </p>
          <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-300 px-6 sm:px-8 text-sm sm:text-base">
            <span className="hidden sm:inline">Explorar Productos</span>
            <span className="sm:hidden">Explorar</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <ProductGrid 
            products={electronicsProducts}
            section="electronics"
            showFilters={true}
            itemsPerPage={12}
          />
        </div>
      </section>

      {/* Trade-in CTA Section */}
      <section className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 px-4">¿Tienes dispositivos electrónicos?</h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Intercámbialos por modelos más recientes y obtén el mejor valor por tus dispositivos actuales.
          </p>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-6 sm:px-8 text-sm sm:text-base">
            <span className="hidden sm:inline">Evaluar mis dispositivos</span>
            <span className="sm:hidden">Evaluar</span>
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ElectronicsPage;