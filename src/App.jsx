import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, App as AntApp, Spin } from "antd";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AdminLayout from "./components/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Shops from "./pages/Shops";
import Ads from "./pages/Ads";
import PendingAds from "./pages/PendingAds";
import Brands from "./pages/Brands";
import ProductModels from "./pages/ProductModels";
import CarMakes from "./pages/CarMakes";
import CarModels from "./pages/CarModels";
import OtpLogs from "./pages/OtpLogs";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route path="/shops" element={<Shops />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/pending-ads" element={<PendingAds />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/product-models" element={<ProductModels />} />
        <Route path="/car-makes" element={<CarMakes />} />
        <Route path="/car-makes/:makeId/models" element={<CarModels />} />
        <Route path="/otp-logs" element={<OtpLogs />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ConfigProvider>
      <AntApp>
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}
