import {
  AppstoreOutlined,
  BarChartOutlined,
  LogoutOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import {
  Button,
  Layout as AntLayout,
  Menu,
  Typography,
} from "antd";
import { useNavigate, useLocation, Outlet } from "react-router-dom";

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  const menuItems = [
    {
      key: "/dashboard",
      icon: <AppstoreOutlined />,
      label: "Dashboard",
    },
    {
      key: "/products",
      icon: <ProductOutlined />,
      label: "Products",
    },
    {
      key: "/reports",
      icon: <BarChartOutlined />,
      label: "Reports",
    },
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            strong
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            Inventory
          </Text>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <AntLayout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text strong>
            Inventory Management System
          </Text>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Text>
              {user.username || "User"}
            </Text>

            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: 24,
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}

export default Layout;