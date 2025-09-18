import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import cartModel from "../models/cartModel.js";

// GET /api/v1/order - Lấy danh sách đơn hàng của user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await orderModel.findAll({
      where: { orderUserId: userId },
      order: [["createdAt", "DESC"]],
    });

    return res.json({ success: true, data: orders });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// POST /api/v1/order - Tạo đơn hàng
// body: { items: [{ productId, quantity }], shippingAddress: {...} }
export const createOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { items, shippingAddress } = req.body || {};
    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Danh sách sản phẩm không hợp lệ" });
    }
    if (!shippingAddress || typeof shippingAddress !== "object") {
      return res
        .status(400)
        .json({ success: false, message: "Địa chỉ giao hàng không hợp lệ" });
    }

    const snapshotItems = [];
    let totalOrderQuantity = 0;
    let totalOrderPrice = 0;

    for (const it of items) {
      const qty = Math.max(1, parseInt(it?.quantity) || 0);
      const pid = Number(it?.productId);
      if (!pid || qty <= 0) continue;

      const product = await productModel.findByPk(pid);
      if (!product) continue;

      // Kiểm tra tồn kho
      const stock = Number(product.productQuantity) || 0;
      if (qty > stock) {
        return res.status(400).json({
          success: false,
          message: `Sản phẩm ${product.productName} chỉ còn ${stock} sản phẩm trong kho`,
        });
      }

      const price = Number(product.productPrice || 0);
      const snapshot = {
        productId: pid,
        name: product.productName,
        price,
        image: product.productImage,
        quantity: qty,
      };
      snapshotItems.push(snapshot);
      totalOrderQuantity += qty;
      totalOrderPrice += price * qty;
    }

    if (snapshotItems.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Không có sản phẩm hợp lệ" });
    }

    const order = await orderModel.create({
      orderUserId: userId,
      items: snapshotItems,
      totalOrderPrice,
      totalOrderQuantity,
      shippingAddress,
    });

    return res.json({
      success: true,
      data: order,
      message: "Tạo đơn hàng thành công",
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// PATCH /api/v1/order/:id/cancel-request
export const requestCancelOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;
    const order = await orderModel.findByPk(id);
    if (!order || order.orderUserId !== userId) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn" });
    }

    const createdAt = new Date(order.createdAt).getTime();
    const diffMin = (Date.now() - createdAt) / (1000 * 60);
    const allowedStatus = ["NEW", "CONFIRMED"];
    if (diffMin > 30 || !allowedStatus.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Không thể hủy ở trạng thái hiện tại",
      });
    }

    await order.update({ cancelRequested: true });
    return res.json({ success: true, message: "Đã gửi yêu cầu hủy đơn" });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};

// PATCH /api/v1/order/:id/status - Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body || {};

    const allowed = [
      "NEW",
      "CONFIRMED",
      "PREPARING",
      "SHIPPING",
      "COMPLETED",
      "CANCELLED",
    ];
    if (!allowed.includes((status || "").toUpperCase())) {
      return res
        .status(400)
        .json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const order = await orderModel.findByPk(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn" });
    }

    if (
      ["COMPLETED", "CANCELLED"].includes((order.status || "").toUpperCase())
    ) {
      return res.status(400).json({
        success: false,
        message: "Đơn đã kết thúc, không thể cập nhật",
      });
    }

    await order.update({ status: status.toUpperCase() });
    return res.json({
      success: true,
      message: "Cập nhật trạng thái thành công",
      data: order,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false, message: e.message });
  }
};
