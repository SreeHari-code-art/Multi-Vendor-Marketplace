const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    // Propietario de la tienda (Referencia al modelo User con rol 'seller')
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La tienda debe pertenecer a un usuario vendedor'],
      unique: true, // Por lo general, un vendedor tiene una sola tienda principal
    },
    name: {
      type: String,
      required: [true, 'El nombre de la tienda es obligatorio'],
      unique: true,
      trim: true,
      maxlength: [50, 'El nombre de la tienda no puede exceder los 50 caracteres'],
    },
    description: {
      type: String,
      required: [true, 'La descripción de la tienda es obligatoria'],
      maxlength: [500, 'La descripción no puede exceder los 500 caracteres'],
    },
    logo: {
      type: String,
      default: '', // URL de la imagen (ej: Cloudinary o S3)
    },
    banner: {
      type: String,
      default: '', // URL de la imagen de banner
    },
    email: {
      type: String,
      required: [true, 'El correo de contacto de la tienda es obligatorio'],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor, introduce un correo electrónico válido',
      ],
    },
    phone: {
      type: String,
      required: [true, 'El teléfono de contacto es obligatorio'],
      trim: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    // Estado de verificación y aprobación por el Administrador
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'suspended'],
        message: 'Estado no válido: {VALUE}',
      },
      default: 'pending', // Las tiendas nuevas requieren aprobación del admin
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Métricas o estadísticas básicas opcionales
    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Índice para mejorar las búsquedas por nombre de tienda
shopSchema.index({ name: 'text', description: 'text' });

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;