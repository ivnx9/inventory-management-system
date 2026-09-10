import {
  AppstoreOutlined,
  BarChartOutlined,
  LogoutOutlined,
  ProductOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

import {
  Button,
  Layout as AntLayout,
  Menu,
  Typography,
} from "antd";

import {
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import logo from "../assets/logo.png";

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
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },

    ...(user.role === "admin"
      ? [
          {
            key: "/users",
            icon: <TeamOutlined />,
            label: "User Management",
          },
        ]
      : []),
  ];

  return (
    <AntLayout style={{ minHeight: "100vh" }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <div
          style={{
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: "0 12px",
          }}
        >
          <img
            src={logo}
            alt="Stocky"
            style={{
              width: 36,
              height: 36,
              objectFit: "contain",
            }}
          />

          <Text
            strong
            style={{
              color: "white",
              fontSize: 18,
            }}
          >
            Stocky
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
            gap: 16,
            minWidth: 0,
          }}
        >
          {/* Desktop title / mobile title */}
          <div
            style={{
              minWidth: 0,
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Text
              strong
              style={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              <span className="desktop-header-title">
                Stocky — Your Friendly Inventory Management System
              </span>

              <span className="mobile-header-title">
                Stocky
              </span>
            </Text>
          </div>

          {/* User / Logout */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 0,
            }}
          >
            <Text
              strong
              style={{
                maxWidth: 120,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.username || "User"}
            </Text>

            <Button
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              <span className="logout-text">
                Logout
              </span>
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: 24,
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <Outlet />
        </Content>
      </AntLayout>
    </AntLayout>
  );
}

export default Layout;