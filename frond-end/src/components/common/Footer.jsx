import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Heart, ArrowRight, Github, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Contenido Principal del Footer (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800">
          
          {/* Columna 1: Información de la Marca */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Store className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-wide">
                MultiMarket
              </span>
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              The ultimate multi-vendor marketplace. We connect demanding customers with independent stores and premium products in a secure, fast environment.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors"
                title="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors"
                title="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-colors"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Columna 2: Fast links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  General Catalog
                </Link>
              </li>
              <li>
                <Link to="/shops" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Partner Stores
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: For sellers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Commerce</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/register?role=seller" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Open Your Store
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  Seller Portal
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">Commission Policies</span>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">Merchant Guide</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contact and Support */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Support</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-1" />
                <span>Cyber City, Tech Boulevard, IN</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>support@multimarket.com</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>+91 (800) 555-MARKET</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom section: copyright and legal links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} MultiMarket Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer transition-colors">Cookies</span>
          </div>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" /> for the modern web.
          </p>
        </div>

      </div>
    </footer>
  );
};