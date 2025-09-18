import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyCart, addToCart } from "@/store/slices/cartSlice";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalCartPrice, totalCartQuantity, loading } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyCart());
  }, [dispatch, isAuthenticated]);

  const handleIncrease = (productId) => {
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  if (!isAuthenticated) {
    return (
      <div className="py-10 text-center">
        <p className="mb-4">Bạn cần đăng nhập để xem giỏ hàng.</p>
        <Link to="/login" className="underline">
          Đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Giỏ hàng của bạn
        </h2>
        <div className="mt-1 text-gray-500">
          Tổng số lượng: {totalCartQuantity || 0}
        </div>
      </div>

      {loading && (
        <div className="grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-4 border rounded-xl shadow-sm animate-pulse bg-white"
            >
              <div className="h-40 bg-gray-200 rounded-md mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {!loading && (!items || items.length === 0) && (
        <div className="py-16 text-center">
          <div className="text-2xl mb-2">🛒</div>
          <div className="text-gray-600">
            Giỏ hàng trống. Hãy tiếp tục mua sắm nhé!
          </div>
          <Link
            to="/collection"
            className="inline-block mt-4 px-5 py-2 bg-black text-white rounded-md"
          >
            Xem sản phẩm
          </Link>
        </div>
      )}

      {!loading && items && items.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-4">
            {items.map((it, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-4 sm:col-span-3 md:col-span-2">
                    {Array.isArray(it.image) && it.image[0] && (
                      <img
                        src={it.image[0]}
                        alt={it.name}
                        className="w-full h-28 object-cover rounded-md"
                      />
                    )}
                  </div>
                  <div className="col-span-8 sm:col-span-9 md:col-span-6">
                    <div className="font-medium text-base md:text-lg line-clamp-2">
                      {it.name}
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      Đơn giá:{" "}
                      <span className="font-semibold text-gray-800">
                        {it.price?.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 flex items-center justify-start md:justify-center gap-2">
                    <div className="inline-flex items-center border rounded-md overflow-hidden">
                      <button
                        disabled
                        className="px-3 py-1 text-gray-400 border-r"
                      >
                        -
                      </button>
                      <span className="px-3 py-1">{it.quantity}</span>
                      <button
                        onClick={() => handleIncrease(it.productId)}
                        className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-l"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="col-span-6 md:col-span-2 flex items-center justify-end font-semibold">
                    {(
                      Number(it.price || 0) * Number(it.quantity || 0)
                    ).toLocaleString()}{" "}
                    đ
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="p-5 border rounded-xl shadow-sm bg-white sticky top-24">
              <div className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</div>
              <div className="flex justify-between text-sm mb-2">
                <span>Tạm tính</span>
                <span>{Number(totalCartPrice || 0).toLocaleString()} đ</span>
              </div>
              <div className="flex justify-between text-sm mb-4">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="h-px bg-gray-200 mb-4" />
              <div className="flex justify-between text-base font-semibold mb-4">
                <span>Tổng cộng</span>
                <span>{Number(totalCartPrice || 0).toLocaleString()} đ</span>
              </div>
              <Link
                to="/place-order"
                className="block text-center w-full py-3 bg-black text-white rounded-md"
              >
                Thanh toán
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
