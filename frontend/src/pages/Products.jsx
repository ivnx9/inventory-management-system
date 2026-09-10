import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import api from "../services/api";

const { Title } = Typography;

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form] = Form.useForm();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);

      setError(
        error.response?.data?.message || "Failed to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    form.setFieldsValue({
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      unit_price: Number(product.unit_price),
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setEditingProduct(null);
    setModalOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      setError("");

      if (editingProduct) {
        await api.put(
          `/products/${editingProduct.id}`,
          values
        );

        message.success("Product updated successfully.");
      } else {
        await api.post("/products", values);

        message.success("Product created successfully.");
      }

      closeModal();
      await loadProducts();
    } catch (error) {
      console.error("Failed to save product:", error);

      setError(
        error.response?.data?.message || "Failed to save product."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await api.delete(`/products/${id}`);

      message.success("Product deleted successfully.");

      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);

      setError(
        error.response?.data?.message || "Failed to delete product."
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
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
      render: (price) => `₱${Number(price).toFixed(2)}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button onClick={() => openEditModal(record)}>
            Edit
          </Button>

          <Popconfirm
            title="Delete this product?"
            description="This action cannot be undone."
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Products
        </Title>

        <Button
          type="primary"
          onClick={openCreateModal}
        >
          Add Product
        </Button>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => setError("")}
          style={{ marginBottom: 16 }}
        />
      )}

      <Card>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={products}
          loading={loading}
		  scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={
          editingProduct
            ? "Edit Product"
            : "Add Product"
        }
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Product Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Please enter the product name.",
              },
            ]}
          >
            <Input placeholder="e.g. Wireless Mouse" />
          </Form.Item>

          <Form.Item
            label="SKU"
            name="sku"
            rules={[
              {
                required: true,
                message: "Please enter the SKU.",
              },
            ]}
          >
            <Input placeholder="e.g. WM-001" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[
              {
                required: true,
                message: "Please enter the category.",
              },
            ]}
          >
            <Input placeholder="e.g. Accessories" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            initialValue={0}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Unit Price"
            name="unit_price"
            initialValue={0}
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            block
          >
            {editingProduct
              ? "Update Product"
              : "Create Product"}
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default Products;