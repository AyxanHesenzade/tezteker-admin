import api from "./axios";

export const authService = {
  login: async (email, password) => {
    const res = await api.post("/admin/login", { email, password });
    return res.data;
  },
  me: async () => {
    const res = await api.get("/admin/me");
    return res.data;
  },
  logout: async () => {
    const res = await api.post("/admin/logout");
    return res.data;
  },
};

export const dashboardService = {
  stats: async () => {
    const res = await api.get("/admin/dashboard/stats");
    return res.data;
  },
};

export const usersService = {
  list: async (params) => {
    const res = await api.get("/admin/users", { params });
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/users/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};

export const shopsService = {
  list: async (params) => {
    const res = await api.get("/admin/shops", { params });
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/shops/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/shops/${id}`);
    return res.data;
  },
};

export const brandsService = {
  list: async (params) => {
    const res = await api.get("/admin/brands", { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/admin/brands", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/brands/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/brands/${id}`);
    return res.data;
  },
};

export const productModelsService = {
  list: async (params) => {
    const res = await api.get("/admin/product-models", { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/admin/product-models", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/product-models/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/product-models/${id}`);
    return res.data;
  },
};

export const carMakesService = {
  list: async (params) => {
    const res = await api.get("/admin/car-makes", { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/admin/car-makes", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/car-makes/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/car-makes/${id}`);
    return res.data;
  },
};

export const carModelsService = {
  list: async (params) => {
    const res = await api.get("/admin/car-models", { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/admin/car-models", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/car-models/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/car-models/${id}`);
    return res.data;
  },
};

export const carTireSizesService = {
  list: async (params) => {
    const res = await api.get("/admin/car-tire-sizes", { params });
    return res.data;
  },
  create: async (data) => {
    const res = await api.post("/admin/car-tire-sizes", data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/car-tire-sizes/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/car-tire-sizes/${id}`);
    return res.data;
  },
};

export const otpLogsService = {
  list: async (params) => {
    const res = await api.get("/admin/otp-logs", { params });
    return res.data;
  },
};

export const adsService = {
  list: async (params) => {
    const res = await api.get("/admin/ads", { params });
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/admin/ads/${id}`, data);
    return res.data;
  },
  remove: async (id) => {
    const res = await api.delete(`/admin/ads/${id}`);
    return res.data;
  },
};
