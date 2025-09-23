import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyPromotionScore } from "@/store/slices/promotionScoreSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { totalPromotionScore, loading } = useSelector((s) => s.promotionScore);

  const handleEdit = () => {};
  useEffect(() => {
    if (user) {
      dispatch(fetchMyPromotionScore());
    }
  }, [dispatch, user]);
  return (
    <div>
      <form
        onSubmit={handleEdit}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">User Profile</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        <div className="w-full flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="w-full px-3 py-2 border border-gray-800"
              value={user?.name}
              readOnly={!handleEdit}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-3 py-2 border border-gray-800 bg-gray-100 cursor-not-allowed"
              value={user?.email}
              readOnly={true} // Email field is always read-only
            />
          </div>

          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 px-3 py-2">
            <span className="text-sm text-gray-600">Điểm khuyến mãi</span>
            <span className="text-base font-semibold">
              {loading
                ? "..."
                : Number(totalPromotionScore || 0).toLocaleString()}{" "}
              điểm
            </span>
          </div>
        </div>

        <div className="w-full flex flex-col gap-3 mt-4">
          <Link
            to="/my-favorites"
            className="w-full bg-blue-500 text-white font-light px-8 py-2 text-center hover:bg-blue-600 transition-colors"
          >
            My Favorites
          </Link>

          <div className="flex justify-between gap-4">
            {handleEdit ? (
              <>
                <button
                  type="button"
                  onClick={() => handleEdit}
                  className="w-1/2 bg-gray-400 text-white font-light px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-black text-white font-light px-4 py-2"
                >
                  Save
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleEdit}
                className="w-full bg-black text-white font-light px-8 py-2"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Profile;
