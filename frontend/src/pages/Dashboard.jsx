import {
  Button,
  Card,
  Col,
  Row,
  Statistic,
  Typography,
  message,
} from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import api from "../services/api";

const { Title } = Typography;

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async (showMessage = false) => {
    try {
      setLoading(true);

      const response = await api.get("/products");

      setProducts(response.data);

      if (showMessage) {
        message.success("Dashboard refreshed.");
      }
    } catch (error) {
      console.error("Failed to load dashboard data:", error);

      message.error(
        error.response?.data?.message ||
          "Failed to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (total, product) =>
      total + Number(product.quantity || 0),
    0
  );

  const totalInventoryValue = products.reduce(
    (total, product) =>
      total +
      Number(product.quantity || 0) *
        Number(product.unit_price || 0),
    0
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Dashboard
        </Title>

        <Button
          icon={<ReloadOutlined />}
          onClick={() => loadProducts(true)}
          loading={loading}
        >
          Refresh
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalProducts}
              loading={loading}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Total Quantity"
              value={totalQuantity}
              loading={loading}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Inventory Value"
              value={totalInventoryValue}
              precision={2}
              prefix="₱"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;