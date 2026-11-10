import React from 'react';
import { Link } from 'react-router-dom';
import { Store, Mail, Phone, MapPin, Heart, ArrowRight, Github, Twitter, Instagram } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-dark text-secondary pt-5 pb-5 border-top border-secondary-subtle">
      <div className="container mx-auto px-3 px-sm-4 px-lg-5">
        
        {/* Contenido Principal del Footer (Grid) */}
        <div className="row g-5 pb-5 border-bottom border-secondary-subtle">
          
          {/* Columna 1: Información de la Marca */}
          <div className="col-12 col-md-6 col-lg-5 d-flex flex-column gap-3">
            <Link to="/" className="d-flex align-items-center gap-2">
              <div className="rounded-3 bg-primary p-2 d-flex align-items-center justify-content-center text-white shadow">
                <Store className=" " />
              </div>
              <span className="fs-4 fw-bold text-white ">
                MultiMarket
              </span>
            </Link>
            <p className="small text-secondary mw-100 lh-lg">
              The ultimate multi-vendor marketplace. We connect demanding customers with independent stores and premium products in a secure, fast environment.
            </p>
            <div className="d-flex align-items-center gap-3 pt-2">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="  rounded-3 bg-dark d-flex align-items-center justify-content-center text-secondary text-white bg-primary "
                title="GitHub"
              >
                <Github className=" " />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="  rounded-3 bg-dark d-flex align-items-center justify-content-center text-secondary text-white bg-primary "
                title="Twitter"
              >
                <Twitter className=" " />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="  rounded-3 bg-dark d-flex align-items-center justify-content-center text-secondary text-white bg-primary "
                title="Instagram"
              >
                <Instagram className=" " />
              </a>
            </div>
          </div>

          {/* Columna 2: Fast links */}
          <div className="col-12 col-md-6 col-lg d-flex flex-column gap-3">
            <h3 className="small fw-semibold text-white text-uppercase ">Explore</h3>
            <ul className="vstack gap-2 small">
              <li>
                <Link to="/" className="text-secondary text-primary ">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-secondary text-primary ">
                  General Catalog
                </Link>
              </li>
              <li>
                <Link to="/shops" className="text-secondary text-primary ">
                  Partner Stores
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-secondary text-primary ">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: For sellers */}
          <div className="col-12 col-md-6 col-lg d-flex flex-column gap-3">
            <h3 className="small fw-semibold text-white text-uppercase ">Commerce</h3>
            <ul className="vstack gap-2 small">
              <li>
                <Link to="/register?role=seller" className="text-secondary text-primary ">
                  Open Your Store
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-secondary text-primary ">
                  Seller Portal
                </Link>
              </li>
              <li>
                <span className="text-secondary ">Commission Policies</span>
              </li>
              <li>
                <span className="text-secondary ">Merchant Guide</span>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contact and Support */}
          <div className="col-12 col-md-6 col-lg d-flex flex-column gap-3">
            <h3 className="small fw-semibold text-white text-uppercase ">Support</h3>
            <ul className="vstack gap-3 small text-secondary">
              <li className="d-flex align-items-start gap-2">
                <MapPin className="  text-primary flex-shrink-0 mt-1" />
                <span>Cyber City, Tech Boulevard, IN</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail className="  text-primary flex-shrink-0" />
                <span>support@multimarket.com</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone className="  text-primary flex-shrink-0" />
                <span>+91 (800) 555-MARKET</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom section: copyright and legal links */}
        <div className="pt-5 d-flex flex-column flex-sm-row align-items-center justify-content-between gap-3 small text-secondary">
          <p>© {new Date().getFullYear()} MultiMarket Inc. All rights reserved.</p>
          <div className="d-flex align-items-center gap-4">
            <span className="text-secondary  ">Privacy</span>
            <span className="text-secondary  ">Terms of Service</span>
            <span className="text-secondary  ">Cookies</span>
          </div>
          <p className="d-flex align-items-center gap-1">
            Made with <Heart className="  text-danger " /> for the modern web.
          </p>
        </div>

      </div>
    </footer>
  );
};