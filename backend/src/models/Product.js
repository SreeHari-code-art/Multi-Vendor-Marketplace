const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    // Tienda a la que pertenece el producto (Referencia al modelo Shop)
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'El producto debe estar asociado a una tienda'],
    },
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
      maxlength: [100, 'El nombre del producto no puede exceder los 100 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción del producto es obligatoria'],
      maxlength: [2000, 'La descripción no puede exceder los 2000 caracteres'],
    },
    category: {
      type: String,
      required: [true, 'La categoría del producto es obligatoria'],
      trim: true,
      index: true, // Optimiza las consultas por categoría
    },
    price: {
      type: Number,
      required: [true, 'El precio del producto es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    // Precio anterior (opcional, útil para mostrar ofertas o descuentos tachados)
    compareAtPrice: {
      type: Number,
      min: [0, 'El precio de comparación no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    // Array de URLs de imágenes (almacenadas en Cloudinary, S3, etc.)
    images: [
      {
        type: String,
        required: [true, 'El producto debe tener al menos una imagen'],
      },
    ],
    // Atributos de estado o merchandising
    isFeatured: {
      type: Boolean,
      default: false, // Útil para destacar productos en la página principal
    },
    isActive: {
      type: Boolean,
      default: true, // Permite al vendedor ocultar un producto sin eliminarlo
    },
    // Métricas de valoraciones
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10, // Redondea a 1 decimal (ej: 4.5)
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Índices de texto e ID para mejorar drásticamente el rendimiento de búsqueda y filtrado
productSchema.index({ name: 'text', description: 'text', category: 'text' });
productSchema.index({ shop: 1, createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;