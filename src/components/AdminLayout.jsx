import { Layout, Menu, Button } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  CarOutlined,
  LogoutOutlined,
  TagsOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const { Header, Sider, Content } = Layout;

const items = [
  { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/users", icon: <UserOutlined />, label: "İstifadəçilər" },
  { key: "/shops", icon: <ShopOutlined />, label: "Mağazalar" },
  { key: "/ads", icon: <CarOutlined />, label: "Elanlar" },
  { key: "/brands", icon: <TagsOutlined />, label: "Markalar" },
  { key: "/product-models", icon: <AppstoreOutlined />, label: "Modellər" },
  { key: "/car-makes", icon: <ClusterOutlined />, label: "Avtomobillər" },
  { key: "/otp-logs", icon: <KeyOutlined />, label: "OTP Logları" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: "#fff", textAlign: "center", padding: 16, fontWeight: 600 }}>
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[
            items
              .map((i) => i.key)
              .filter((key) => location.pathname.startsWith(key))
              .sort((a, b) => b.length - a.length)[0] ?? "/",
          ]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 12,
            padding: "0 24px",
          }}
        >
          <span>{user?.name || user?.email}</span>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Çıxış
          </Button>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
