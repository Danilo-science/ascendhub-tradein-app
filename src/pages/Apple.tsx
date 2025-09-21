import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/ui/button';
import { Apple, Smartphone, Laptop, Watch, Headphones, ArrowRight, Star } from 'lucide-react';

const ApplePage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Apple },
    { id: 'iphone', name: 'iPhone', icon: Smartphone },
    { id: 'mac', name: 'Mac', icon: Laptop },
    { id: 'ipad', name: 'iPad', icon: Smartphone },
    { id: 'watch', name: 'Apple Watch', icon: Watch },
    { id: 'accessories', name: 'Accesorios', icon: Headphones },
  ];

  const products = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'iphone',
      price: '$999',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      features: ['Titanium Design', 'A17 Pro Chip', 'Pro Camera System']
    },
    {
      id: 2,
      name: 'MacBook Air M3',
      category: 'mac',
      price: '$1,199',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      features: ['M3 Chip', '18-hour Battery', 'Liquid Retina Display']
    },
    {
      id: 3,
      name: 'iPad Pro 12.9"',
      category: 'ipad',
      price: '$1,099',
      image: '/api/placeholder/300/300',
      rating: 4.7,
      features: ['M2 Chip', 'Liquid Retina XDR', 'Apple Pencil Support']
    },
    {
      id: 4,
      name: 'Apple Watch Series 9',
      category: 'watch',
      price: '$399',
      image: '/api/placeholder/300/300',
      rating: 4.6,
      features: ['S9 Chip', 'Double Tap', 'All-Day Battery']
    },
    {
      id: 5,
      name: 'AirPods Pro (2nd gen)',
      category: 'accessories',
      price: '$249',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      features: ['Active Noise Cancellation', 'Spatial Audio', 'MagSafe Case']
    },
    {
      id: 6,
      name: 'iPhone 15',
      category: 'iphone',
      price: '$799',
      image: '/api/placeholder/300/300',
      rating: 4.7,
      features: ['Dynamic Island', 'A16 Bionic', 'Advanced Camera System']
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section - Apple Style */}
      <section className="pt-20 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Apple className="h-16 w-16 text-gray-800" />
          </div>
          <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6">
            Think different.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 font-light">
            Descubrí la experiencia Apple completa. Productos que cambian la forma 
            en que trabajás, jugás y te conectás con el mundo.
          </p>
          <Button 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium"
            asChild
          >
            <Link to="/trade-in">
              Evaluar tu Trade-In <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="font-medium">{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
              >
                <div className="aspect-square bg-gray-50 rounded-t-2xl overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({product.rating})</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    {product.features.map((feature, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        • {feature}
                      </p>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-semibold text-gray-900">
                      {product.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
                      asChild
                    >
                      <Link to={`/product/${product.id}`}>
                        Ver detalles
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trade-In CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-6">
            Intercambiá tu dispositivo actual
          </h2>
          <p className="text-lg text-gray-600 mb-8 font-light">
            Obtené crédito por tu dispositivo Apple actual y aplicalo a tu nueva compra.
          </p>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white rounded-full px-8 py-3"
            asChild
          >
            <Link to="/trade-in">
              Evaluar mi dispositivo
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ApplePage;