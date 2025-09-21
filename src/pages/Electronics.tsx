import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { Button } from '@/components/ui/button';
import { Smartphone, Laptop, Headphones, Camera, Gamepad2, Tablet, ArrowRight, Star, Zap } from 'lucide-react';

const ElectronicsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Zap },
    { id: 'smartphones', name: 'Smartphones', icon: Smartphone },
    { id: 'laptops', name: 'Laptops', icon: Laptop },
    { id: 'tablets', name: 'Tablets', icon: Tablet },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2 },
    { id: 'audio', name: 'Audio', icon: Headphones },
    { id: 'cameras', name: 'Cámaras', icon: Camera },
  ];

  const products = [
    {
      id: 1,
      name: 'Samsung Galaxy S24 Ultra',
      category: 'smartphones',
      price: '$1,199',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      features: ['S Pen incluido', 'Cámara 200MP', 'AI Photography'],
      brand: 'Samsung'
    },
    {
      id: 2,
      name: 'ASUS ROG Strix G16',
      category: 'laptops',
      price: '$1,599',
      image: '/api/placeholder/300/300',
      rating: 4.7,
      features: ['RTX 4070', 'Intel i7-13650HX', '16GB DDR5'],
      brand: 'ASUS'
    },
    {
      id: 3,
      name: 'PlayStation 5',
      category: 'gaming',
      price: '$499',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      features: ['4K Gaming', 'Ray Tracing', 'DualSense Controller'],
      brand: 'Sony'
    },
    {
      id: 4,
      name: 'Sony WH-1000XM5',
      category: 'audio',
      price: '$399',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      features: ['Noise Cancelling', '30h Battery', 'Hi-Res Audio'],
      brand: 'Sony'
    },
    {
      id: 5,
      name: 'Samsung Galaxy Tab S9+',
      category: 'tablets',
      price: '$999',
      image: '/api/placeholder/300/300',
      rating: 4.6,
      features: ['S Pen incluido', 'AMOLED 12.4"', 'IP68 Waterproof'],
      brand: 'Samsung'
    },
    {
      id: 6,
      name: 'Canon EOS R6 Mark II',
      category: 'cameras',
      price: '$2,499',
      image: '/api/placeholder/300/300',
      rating: 4.9,
      features: ['24.2MP Full Frame', '4K 60fps', 'In-Body Stabilization'],
      brand: 'Canon'
    },
    {
      id: 7,
      name: 'Google Pixel 8 Pro',
      category: 'smartphones',
      price: '$999',
      image: '/api/placeholder/300/300',
      rating: 4.7,
      features: ['Google Tensor G3', 'AI Magic Eraser', 'Pure Android'],
      brand: 'Google'
    },
    {
      id: 8,
      name: 'Xbox Series X',
      category: 'gaming',
      price: '$499',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      features: ['4K 120fps', 'Quick Resume', 'Game Pass Ultimate'],
      brand: 'Microsoft'
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50">
      <Navigation />
      
      {/* Hero Section - Electronics Style */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 rounded-full p-4">
              <Zap className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Electrónicos Premium
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Descubrí la última tecnología en smartphones, laptops, gaming y más. 
            Innovación que transforma tu experiencia digital.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold shadow-lg"
            asChild
          >
            <Link to="/trade-in">
              Evaluar tu Trade-In <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-blue-100 border border-gray-200'
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
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl border border-white/50 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:shadow-purple-100/50 hover:-translate-y-1"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl overflow-hidden relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {product.brand}
                  </div>
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
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="space-y-1 mb-4">
                    {product.features.map((feature, index) => (
                      <p key={index} className="text-sm text-gray-600 flex items-center">
                        <span className="w-1 h-1 bg-purple-400 rounded-full mr-2"></span>
                        {feature}
                      </p>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      {product.price}
                    </span>
                    <Button 
                      size="sm" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full px-4 shadow-lg"
                      asChild
                    >
                      <Link to={`/product/${product.id}`}>
                        Ver más
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
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Tenés un dispositivo para intercambiar?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Evaluamos tu equipo actual y te damos el mejor precio como parte de pago para tu nueva compra.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 rounded-full px-8 py-3 font-semibold shadow-lg"
            asChild
          >
            <Link to="/trade-in">
              Evaluar mi dispositivo <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        {/* Animated elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 left-10 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
      </section>

      <Footer />
    </div>
  );
};

export default ElectronicsPage;