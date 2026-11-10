const Shop = require('../models/Shop');
const User = require('../models/User');
const Product = require('../models/Product');

/**
 * @desc    Crear una tienda para el vendedor autenticado
 * @route   POST /api/v1/shops
 * @access  Private (Seller)
 */
const createShop = async (req, res, next) => {
  try {
    const { name, description, logo, banner, email, phone, address } = req.body;

    // 1. Verificar si el usuario ya tiene una tienda registrada
    const existingShop = await Shop.findOne({ seller: req.user._id });
    if (existingShop) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya cuenta con una tienda registrada',
      });
    }

    // 2. Crear la tienda (por defecto en estado 'pending' y no verificada)
    const shop = await Shop.create({
      seller: req.user._id,
      name,
      description,
      logo,
      banner,
      email,
      phone,
      address,
      status: 'pending',
      isVerified: false,
    });

    // 3. Vincular la tienda recién creada al documento del usuario
    await User.findByIdAndUpdate(req.user._id, { shop: shop._id });

    res.status(201).json({
      success: true,
      message: 'Tienda creada exitosamente. Está pendiente de aprobación por el administrador.',
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener el perfil de la tienda del vendedor autenticado
 * @route   GET /api/v1/shops/seller/me
 * @access  Private (Seller)
 */
const getMyShop = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ seller: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró ninguna tienda asociada a este usuario',
      });
    }

    res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar la información de la tienda del vendedor
 * @route   PUT /api/v1/shops/seller/me
 * @access  Private (Seller)
 */
const updateMyShop = async (req, res, next) => {
  try {
    const { name, description, logo, banner, email, phone, address } = req.body;

    let shop = await Shop.findOne({ seller: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada',
      });
    }

    // Actualizar campos permitidos
    shop.name = name || shop.name;
    shop.description = description || shop.description;
    shop.logo = logo !== undefined ? logo : shop.logo;
    shop.banner = banner !== undefined ? banner : shop.banner;
    shop.email = email || shop.email;
    shop.phone = phone || shop.phone;
    if (address) {
      shop.address = {
        street: address.street || shop.address.street,
        city: address.city || shop.address.city,
        state: address.state || shop.address.state,
        zipCode: address.zipCode || shop.address.zipCode,
        country: address.country || shop.address.country,
      };
    }

    const updatedShop = await shop.save();

    res.status(200).json({
      success: true,
      message: 'Tienda actualizada exitosamente',
      data: updatedShop,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener lista pública de tiendas aprobadas (con paginación)
 * @route   GET /api/v1/shops
 * @access  Public
 */
const getApprovedShops = async (req, res, next) => {
  try {
    const { keyword, page = 1, limit = 10 } = req.query;

    const query = { status: 'approved' };

    if (keyword) {
      query.$text = { $search: keyword };
    }

    const pageSize = Number(limit);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * pageSize;

    const shops = await Shop.find(query)
      .populate('seller', 'name email avatar')
      .skip(skip)
      .limit(pageSize)
      .sort('-createdAt');

    const total = await Shop.countDocuments(query);

    res.status(200).json({
      success: true,
      count: shops.length,
      total,
      pages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      data: shops,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener una tienda específica por su ID junto con sus productos activos
 * @route   GET /api/v1/shops/:id
 * @access  Public
 */
const getShopById = async (req, res, next) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('seller', 'name email avatar');

    if (!shop || shop.status !== 'approved') {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada o no disponible',
      });
    }

    // Obtener también los productos activos de esta tienda
    const products = await Product.find({ shop: shop._id, isActive: true }).sort('-createdAt');

    res.status(200).json({
      success: true,
      data: {
        shop,
        products,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener todas las tiendas (Panel de Administración)
 * @route   GET /api/v1/shops/admin/all
 * @access  Private (Admin)
 */
const getAllShopsAdmin = async (req, res, next) => {
  try {
    const shops = await Shop.find({}).populate('seller', 'name email role').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: shops.length,
      data: shops,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar el estado de verificación/aprobación de una tienda (Admin)
 * @route   PUT /api/v1/shops/admin/:id/status
 * @access  Private (Admin)
 */
const updateShopStatusAdmin = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved', 'rejected', 'suspended', 'pending'

    if (!['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de tienda no válido',
      });
    }

    const shop = await Shop.findById(req.params.id);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada',
      });
    }

    shop.status = status;
    shop.isVerified = status === 'approved'; // Si se aprueba, se marca como verificada

    const updatedShop = await shop.save();

    res.status(200).json({
      success: true,
      message: `El estado de la tienda ha sido cambiado a: ${status}`,
      data: updatedShop,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createShop,
  getMyShop,
  updateMyShop,
  getApprovedShops,
  getShopById,
  getAllShopsAdmin,
  updateShopStatusAdmin,
};