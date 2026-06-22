// frontend/src/services/orderTrackingService.js
// Drop this into your existing services/ folder.

import axios from "axios";

const BASE_URL = "/api/order-tracking";

// Helper to attach auth token (matches common MERN pattern)
const authConfig = () => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  return {
    headers: {
      Authorization: userInfo?.token ? `Bearer ${userInfo.token}` : "",
    },
  };
};

// ── User ──────────────────────────────────────────────────────────────────────

export const fetchOrderTracking = async (orderId) => {
  const { data } = await axios.get(`${BASE_URL}/${orderId}`, authConfig());
  return data;
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const fetchAllOrdersTracking = async () => {
  const { data } = await axios.get(`${BASE_URL}/admin/all`, authConfig());
  return data;
};

export const updateOrderStatus = async (orderId, status, note = "") => {
  const { data } = await axios.put(
    `${BASE_URL}/${orderId}/status`,
    { status, note },
    authConfig()
  );
  return data;
};