const Order = require('../models/Order');
const Product = require('../models/Product');
const Shop = require('../models/Shop');

/**
 * @desc    Crear un nuevo pedido (Checkout del cliente)
 * @route   POST /api/v1/orders
 * @access  Private (Customer)
 */
const createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay artículos en el pedido',
      });
    }

    // 1. Validar y obtener los precios reales de los productos desde la base de datos
    // Esto previene que un cliente manipule los precios desde el frontend
    const verifiedOrderItems = [];
    let itemsPrice = 0;

    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product || !product.isActive) {
        return res.status(404).json({
          success: false,
          message: `El producto con ID ${item.product} no existe o no está disponible`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Stock insuficiente para el producto: ${product.name}. Stock disponible: ${product.stock}`,
        });
      }

      verifiedOrderItems.push({
        product: product._id,
        shop: product.shop,
        name: product.name,
        quantity: item.quantity,
        image: product.images[0] || '',
        price: product.price,
      });

      itemsPrice += product.price * item.quantity;
    }

    // 2. Calcular costos adicionales (ej. impuestos fijos del 10% y envío estándar)
    const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
    const shippingPrice = itemsPrice > 100 ? 0 : 10.0; // Envío gratis si supera los $100
    const totalPrice = Number((itemsPrice + taxPrice + shippingPrice).toFixed(2));

    // 3. Crear el pedido
    const order = await Order.create({
      customer: req.user._id,
      orderItems: verifiedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'COD', // Si es pago contra entrega (COD), se marca como no pagado online pero pendiente
    });

    // 4. Descontar el stock de los productos comprados
    for (const item of verifiedOrderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Pedido creado exitosamente',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener los pedidos del cliente autenticado (Historial)
 * @route   GET /api/v1/orders/my-orders
 * @access  Private (Customer)
 */
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate('orderItems.shop', 'name')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un pedido por su ID
 * @route   GET /api/v1/orders/:id
 * @access  Private (Customer, Seller dueño de algún ítem, o Admin)
 */
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email')
      .populate('orderItems.shop', 'name seller');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    // Verificar permisos: El usuario debe ser el cliente, admin, o un vendedor con productos en esta orden
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para ver este pedido',
      });
    }

    if (req.user.role === 'seller') {
      const shop = await Shop.findOne({ seller: req.user._id });
      const hasShopItems = order.orderItems.some(
        (item) => item.shop && item.shop._id.toString() === shop._id.toString()
      );

      if (!hasShopItems) {
        return res.status(403).json({
          success: false,
          message: 'Este pedido no contiene productos de su tienda',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener los pedidos que contienen productos de la tienda del vendedor
 * @route   GET /api/v1/orders/seller/my-shop-orders
 * @access  Private (Seller)
 */
const getSellerOrders = async (req, res, next) => {
  try {
    const shop = await Shop.findOne({ seller: req.user._id });

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: 'Tienda no encontrada para este usuario',
      });
    }

    // Buscar órdenes donde algún ítem pertenezca a la tienda del vendedor
    const orders = await Order.find({ 'orderItems.shop': shop._id })
      .populate('customer', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar el estado del pedido (Vendedor o Admin)
 * @route   PUT /api/v1/orders/:id/status
 * @access  Private (Seller dueño de la tienda / Admin)
 */
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;

    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Estado de pedido no válido',
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado',
      });
    }

    // Si es vendedor, verificar que la orden contenga productos de su tienda
    if (req.user.role === 'seller') {
      const shop = await Shop.findOne({ seller: req.user._id });
      const hasShopItems = order.orderItems.some(
        (item) => item.shop.toString() === shop._id.toString()
      );

      if (!hasShopItems) {
        return res.status(403).json({
          success: false,
          message: 'No tiene permisos para modificar este pedido',
        });
      }
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'Delivered') {
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      message: `El estado del pedido se ha actualizado a: ${orderStatus}`,
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
};