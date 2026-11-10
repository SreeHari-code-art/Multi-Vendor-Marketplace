const User = require('../models/User');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Order = require('../models/Order');

/**
 * @desc    Obtener estadísticas generales del marketplace para el panel de administración
 * @route   GET /api/v1/admin/stats
 * @access  Private (Admin)
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalShops = await Shop.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calcular los ingresos totales sumando el 'totalPrice' de todas las órdenes pagadas
    const paidOrders = await Order.find({ isPaid: true });
    const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalPrice, 0);

    // Conteo por roles de usuario
    const customersCount = await User.countDocuments({ role: 'customer' });
    const sellersCount = await User.countDocuments({ role: 'seller' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    // Conteo por estados de tienda
    const pendingShopsCount = await Shop.countDocuments({ status: 'pending' });
    const approvedShopsCount = await Shop.countDocuments({ status: 'approved' });

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: totalUsers,
          customers: customersCount,
          sellers: sellersCount,
          admins: adminsCount,
          shops: totalShops,
          pendingShops: pendingShopsCount,
          approvedShops: approvedShopsCount,
          products: totalProducts,
          orders: totalOrders,
        },
        financials: {
          totalRevenue: Number(totalRevenue.toFixed(2)),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener lista de todos los usuarios registrados
 * @route   GET /api/v1/admin/users
 * @access  Private (Admin)
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').populate('shop').sort('-createdAt');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar el rol de un usuario (ej. convertir de customer a seller o admin)
 * @route   PUT /api/v1/admin/users/:id/role
 * @access  Private (Admin)
 */
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!['customer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Rol especificado no válido',
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    user.role = role;
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: `El rol del usuario ha sido actualizado a: ${role}`,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un usuario del sistema (y sus recursos asociados)
 * @route   DELETE /api/v1/admin/users/:id
 * @access  Private (Admin)
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Evitar que el administrador se elimine a sí mismo por error
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar tu propia cuenta de administrador',
      });
    }

    // Si el usuario es vendedor, opcionalmente eliminamos su tienda y productos
    if (user.role === 'seller' && user.shop) {
      const shop = await Shop.findById(user.shop);
      if (shop) {
        await Product.deleteMany({ shop: shop._id });
        await shop.deleteOne();
      }
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Usuario y sus recursos asociados eliminados exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener todos los pedidos de todas las tiendas (Panel Admin)
 * @route   GET /api/v1/admin/orders
 * @access  Private (Admin)
 */
const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate('customer', 'name email')
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

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrdersAdmin,
};