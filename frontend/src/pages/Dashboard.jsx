import { Card, Col, Row, Statistic, Typography } from "antd";
import { useEffect, useState } from "react";
import api from "../services/api";

const { Title } = Typography;

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const totalProducts = products.length;

  const totalQuantity = products.reduce(
    (total, product) => total + Number(product.quantity || 0),
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
      <Title level={2}>Dashboard</Title>

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