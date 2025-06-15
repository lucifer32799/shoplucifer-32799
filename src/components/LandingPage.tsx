
import React, { useState } from 'react';
import { useEdit } from '@/contexts/EditContext';
import EditableText from './EditableText';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(false);
  const { isAuthenticated } = useEdit();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-600">AVIATOR NATION</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-orange-600">SHOP</a>
              <a href="#" className="text-gray-700 hover:text-orange-600">ABOUT</a>
              <a href="#" className="text-gray-700 hover:text-orange-600">CONTACT</a>
            </nav>
            {!isAuthenticated && (
              <Button
                onClick={() => setShowLogin(true)}
                variant="outline"
                size="sm"
                className="ml-4"
              >
                Admin
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-400 to-red-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            contentKey="heroTitle"
            element="h1"
            className="text-5xl md:text-7xl font-bold mb-4"
          />
          <EditableText
            contentKey="heroSubtitle"
            element="p"
            className="text-xl md:text-2xl mb-8 opacity-90"
          />
          <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
            <EditableText
              contentKey="heroButtonText"
              element="span"
              className="font-semibold"
            />
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <EditableText
              contentKey="aboutTitle"
              element="h2"
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            />
            <EditableText
              contentKey="aboutDescription"
              element="p"
              className="text-lg text-gray-600 max-w-3xl mx-auto"
              multiline
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Product 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-orange-200 to-orange-300 rounded-t-lg"></div>
              <CardContent className="p-6">
                <EditableText
                  contentKey="product1Title"
                  element="h3"
                  className="text-xl font-bold mb-2"
                />
                <EditableText
                  contentKey="product1Description"
                  element="p"
                  className="text-gray-600 mb-4"
                  multiline
                />
                <EditableText
                  contentKey="product1Price"
                  element="p"
                  className="text-2xl font-bold text-orange-600"
                />
              </CardContent>
            </Card>

            {/* Product 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-red-200 to-red-300 rounded-t-lg"></div>
              <CardContent className="p-6">
                <EditableText
                  contentKey="product2Title"
                  element="h3"
                  className="text-xl font-bold mb-2"
                />
                <EditableText
                  contentKey="product2Description"
                  element="p"
                  className="text-gray-600 mb-4"
                  multiline
                />
                <EditableText
                  contentKey="product2Price"
                  element="p"
                  className="text-2xl font-bold text-orange-600"
                />
              </CardContent>
            </Card>

            {/* Product 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-t-lg"></div>
              <CardContent className="p-6">
                <EditableText
                  contentKey="product3Title"
                  element="h3"
                  className="text-xl font-bold mb-2"
                />
                <EditableText
                  contentKey="product3Description"
                  element="p"
                  className="text-gray-600 mb-4"
                  multiline
                />
                <EditableText
                  contentKey="product3Price"
                  element="p"
                  className="text-2xl font-bold text-orange-600"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EditableText
            contentKey="footerText"
            element="p"
            className="opacity-80"
          />
        </div>
      </footer>

      {/* Admin Components */}
      <AdminLogin isOpen={showLogin} onClose={() => setShowLogin(false)} />
      <AdminPanel />
    </div>
  );
};

export default LandingPage;
