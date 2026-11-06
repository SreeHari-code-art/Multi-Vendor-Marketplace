const Shop = require('../models/Shop');

// Create Shop Profile (For Sellers)
exports.createShop = async (req, res) => {
  try {
    const { shopName, description, address } = req.body;

    // Check if seller already has a shop
    const existingShop = await Shop.findOne({ seller: req.user.id });
    if (existingShop) {
      return res.status(400).json({ message: 'You already have a registered shop' });
    }

    const shop = await Shop.create({
      seller: req.user.id,
      shopName,
      description,
      address,
      verificationStatus: 'pending' // New shops start as pending verification
    });

    res.status(201).json({
      message: 'Shop profile created successfully and is pending admin verification',
      shop
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin verifies a shop
exports.updateVerificationStatus = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { verificationStatus } = req.body; // 'approved' or 'rejected'

    if (!['approved', 'rejected', 'pending'].includes(verificationStatus)) {
      return res.status(400).json({ message: 'Invalid verification status' });
    }

    const shop = await Shop.findByIdAndUpdate(
      shopId,
      { verificationStatus },
      { new: true }
    );

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.json({
      message: `Shop status updated to ${verificationStatus}`,
      shop
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};