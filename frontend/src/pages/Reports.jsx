import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  Col,
  Row,
  Statistic,
  Table,
  Typography,
} from "antd";
import api from "../services/api";

const { Title } = Typography;

function Reports() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");

      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load report:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load inventory report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
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

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      key: "sku",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (price) =>
        `₱${Number(price).toFixed(2)}`,
    },
    {
      title: "Total Value",
      key: "total_value",
      render: (_, record) => {
        const total =
          Number(record.quantity || 0) *
          Number(record.unit_price || 0);

        return `₱${total.toFixed(2)}`;
      },
    },
  ];

  return (
    <div>
      <Title level={2}>Inventory Report</Title>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

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
              title="Total Inventory Value"
              value={totalInventoryValue}
              precision={2}
              prefix="₱"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Inventory Details"
        style={{ marginTop: 24 }}
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          loading={loading}
		  scroll={{ x: 900 }}
        />
      </Card>
    </div>
  );
}

export default Reports;