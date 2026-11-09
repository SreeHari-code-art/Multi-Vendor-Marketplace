const Product = require('../models/Product');
const Shop = require('../models/Shop');

/**
 * @desc    Obtener lista de productos públicos con filtros, búsqueda y paginación
 * @route   GET /api/v1/products
 * @access  Public
 */
const getProducts = async (req, res, next) => {
  try {
    const {
      keyword,
      category,
      page = 1,
      limit = 10,
      sort = '-createdAt',
      minPrice,
      maxPrice,
    } = req.query;

    // Construir objeto de consulta base (solo productos activos)
    const query = { isActive: true };

    // Filtro por búsqueda de texto (nombre o descripción)
    if (keyword) {
      query.$text = { $search: keyword };
    }

    // Filtro por categoría
    if (category) {
      query.category = category;
    }

    // Filtro por rango de precios
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Paginación
    const pageSize = Number(limit);
    const pageNumber = Number(page);
    const skip = (pageNumber - 1) * pageSize;

    // Ejecutar consulta con población de la tienda asociada
    const products = await Product.find(query)
      .populate('shop', 'name logo ratingAverage')
      .sort(sort)
      .skip(skip)
      .limit(pageSize);

    // Contar total de documentos para la paginación en el frontend
    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      pages: Math.ceil(total / pageSize),
      currentPage: pageNumber,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un producto por su ID
 * @route   GET /api/v1/products/:id
 * @access  Public
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'shop',
      'name logo description email phone address ratingAverage'
    );

    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Crear un nuevo producto (Solo para Vendedores con tienda aprobada)
 * @route   POST /api/v1/products
 * @access  Private (Seller/Admin)
 */
const createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, compareAtPrice, stock, images, isFeatured } = req.body;

    // 1. Buscar la tienda asociada al usuario autenticado (si es seller)
    let shopId = req.body.shop;

    if (req.user.role === 'seller') {
      const shop = await Shop.findOne({ seller: req.user._id });
      if (!shop) {
        return res.status(400).json({
          success: false,
          message: 'Debe registrar y tener una tienda creada antes de publicar productos',
        });
      }
      if (shop.status !== 'approved') {
        return res.status(403).json({
          success: false,
          message: `Su tienda se encuentra en estado '${shop.status}'. Debe estar aprobada para publicar productos.`,
        });
      }
      shopId = shop._id;
    } else if (req.user.role === 'admin' && !shopId) {
      return res.status(400).json({
        success: false,
        message: 'El administrador debe especificar el ID de la tienda para el producto',
      });
    }

    // 2. Crear el producto
    const product = await Product.create({
      shop: shopId,
      name,
      description,
      category,
      price,
      compareAtPrice,
      stock,
      images,
      isFeatured,
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar un producto existente
 * @route   PUT /api/v1/products/:id
 * @access  Private (Seller dueño o Admin)
 */
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    // Verificar si el usuario es el vendedor dueño de la tienda o un administrador
    if (req.user.role !== 'admin') {
      const shop = await Shop.findOne({ seller: req.user._id });
      if (!shop || product.shop.toString() !== shop._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tiene permisos para actualizar este producto',
        });
      }
    }

    // Actualizar producto
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Producto actualizado exitosamente',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un producto
 * @route   DELETE /api/v1/products/:id
 * @access  Private (Seller dueño o Admin)
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    // Verificar permisos de propiedad
    if (req.user.role !== 'admin') {
      const shop = await Shop.findOne({ seller: req.user._id });
      if (!shop || product.shop.toString() !== shop._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No tiene permisos para eliminar este producto',
        });
      }
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Producto eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener todos los productos de la tienda del vendedor autenticado
 * @route   GET /api/v1/products/seller/my-products
 * @access  Private (Seller)
 */
const getSellerProducts = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ seller: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada para este usuario',
      });
    }

    const products = await Product.find({ shop: shop._id }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
};