import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-brand-blue text-brand-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">AscendHub</h3>
            <p className="text-gray-300 mb-4">
              Tu tienda de confianza para tecnología premium. Comprá, vendé y 
              renovate con nuestro sistema de trade-in.
            </p>
            <div className="flex space-x-4">
              {/* Social links can be added here */}
            </div>
          </div>

          {/* Enlaces útiles */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/productos" className="text-gray-300 hover:text-white transition-colors">
                  Productos
                </Link>
              </li>
              <li>
                <Link to="/trade-in" className="text-gray-300 hover:text-white transition-colors">
                  Trade-In
                </Link>
              </li>
              <li>
                <Link to="/nosotros" className="text-gray-300 hover:text-white transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-300 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-300">
              <li>info@ascendhub.com</li>
              <li>+54 11 1234-5678</li>
              <li>Buenos Aires, Argentina</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300">
              © 2024 AscendHub. Todos los derechos reservados.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link to="/terminos" className="text-gray-300 hover:text-white transition-colors">
                Términos y Condiciones
              </Link>
              <Link to="/privacidad" className="text-gray-300 hover:text-white transition-colors">
                Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}