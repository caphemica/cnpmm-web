import React, { useEffect, useState } from "react";
import { Steps, Form, Input, Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCart } from "@/store/slices/cartSlice";
import { createOrderApi } from "@/services/api";
import { useNavigate, Link, useLocation } from "react-router-dom";

const { Step } = Steps;

const PlaceOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const buyNow = location.state?.buyNow;
  const { items, totalCartPrice, totalCartQuantity } = useSelector(
    (s) => s.cart
  );
  const { isAuthenticated } = useSelector((s) => s.auth);

  const [current, setCurrent] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!buyNow) dispatch(fetchMyCart());
  }, [dispatch, buyNow]);

  const next = async () => {
    try {
      if (current === 0) {
        await form.validateFields();
      }
      setCurrent((c) => c + 1);
    } catch {}
  };

  const prev = () => setCurrent((c) => c - 1);

  const onFinishOrder = async () => {
    try {
      const shippingAddress = form.getFieldsValue(true);
      const payload = buyNow
        ? {
            shippingAddress,
            items: [{ productId: buyNow.productId, quantity: buyNow.quantity }],
          }
        : {
            shippingAddress,
            items: items.map((it) => ({
              productId: it.productId,
              quantity: it.quantity,
            })),
          };
      const res = await createOrderApi(payload);
      if (res?.success) {
        message.success("Đặt hàng thành công");
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      } else {
        message.error(res?.message || "Đặt hàng thất bại");
      }
    } catch (e) {
      message.error(e?.message || "Đặt hàng thất bại");
    }
  };

  return (
    <div className="py-10">
      <Steps current={current} responsive className="mb-8">
        <Step title="Địa chỉ giao hàng" />
        <Step title="Xác nhận" />
        <Step title="Hoàn tất" />
      </Steps>

      {current === 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          <div className="lg:col-span-2 p-5 border rounded-xl bg-white">
            <Form form={form} layout="vertical">
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Nhập họ tên" }]}
              >
                <Input placeholder="Nguyen Van A" />
              </Form.Item>
              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: "Nhập số điện thoại" }]}
              >
                <Input placeholder="0900000000" />
              </Form.Item>
              <Form.Item
                name="street"
                label="Địa chỉ"
                rules={[{ required: true, message: "Nhập địa chỉ" }]}
              >
                <Input placeholder="Số nhà, đường" />
              </Form.Item>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                  name="ward"
                  label="Phường/Xã"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="district"
                  label="Quận/Huyện"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="city"
                  label="Tỉnh/Thành"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </div>
            </Form>
          </div>

          <div className="lg:col-span-1 p-5 border rounded-xl bg-white h-fit">
            <div className="text-lg font-semibold mb-4">Tóm tắt</div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tổng số lượng</span>
              <span>{buyNow ? buyNow.quantity : totalCartQuantity || 0}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span>Tạm tính</span>
              <span>
                {Number(
                  buyNow ? buyNow.price * buyNow.quantity : totalCartPrice || 0
                ).toLocaleString()}{" "}
                đ
              </span>
            </div>
            <div className="flex justify-between text-sm mb-4">
              <span>Vận chuyển</span>
              <span className="text-green-600">Miễn phí</span>
            </div>
            <div className="flex justify-end">
              <Button type="primary" onClick={next}>
                Tiếp tục
              </Button>
            </div>
          </div>
        </div>
      )}

      {current === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
          <div className="lg:col-span-2 p-5 border rounded-xl bg-white">
            <div className="text-lg font-semibold mb-4">Xác nhận đơn hàng</div>
            <ul className="divide-y">
              {(buyNow ? [buyNow] : items).map((it, idx) => (
                <li
                  key={idx}
                  className="py-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {Array.isArray(it.image) && it.image[0] && (
                      <img
                        src={it.image[0]}
                        alt={it.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-sm text-gray-500">
                        x{it.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">
                    {(
                      Number(it.price || 0) * Number(it.quantity || 0)
                    ).toLocaleString()}{" "}
                    đ
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-1 p-5 border rounded-xl bg-white h-fit">
            <div className="flex justify-between text-base font-semibold mb-4">
              <span>Tổng cộng</span>
              <span>
                {Number(
                  buyNow ? buyNow.price * buyNow.quantity : totalCartPrice || 0
                ).toLocaleString()}{" "}
                đ
              </span>
            </div>
            <div className="flex items-center gap-2 justify-end">
              <Button onClick={prev}>Quay lại</Button>
              <Button
                type="primary"
                onClick={() => setCurrent(2) || onFinishOrder()}
              >
                Đặt hàng
              </Button>
            </div>
          </div>
        </div>
      )}

      {current === 2 && (
        <div className="py-16 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <div className="text-gray-700 mb-6">
            Đơn hàng của bạn đã được tạo!
          </div>
          <Link to="/orders" className="underline">
            Xem đơn mua
          </Link>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
