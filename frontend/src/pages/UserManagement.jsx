import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  KeyOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import api from "../services/api";

const { Title, Text } = Typography;

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/users");

      setUsers(response.data);
    } catch (error) {
      console.error("Failed to load users:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);

    form.setFieldsValue({
      username: user.username,
      role: user.role,
    });

    setModalOpen(true);
  };

  const closeModal = () => {
    form.resetFields();
    setEditingUser(null);
    setModalOpen(false);
  };

  const openPasswordModal = (user) => {
    setResettingUser(user);
    passwordForm.resetFields();
    setPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    passwordForm.resetFields();
    setResettingUser(null);
    setPasswordModalOpen(false);
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);
      setError("");

      if (editingUser) {
        await api.put(
          `/users/${editingUser.id}`,
          {
            username: values.username,
            role: values.role,
          }
        );

        message.success("User updated successfully.");
      } else {
        await api.post("/users", {
          username: values.username,
          password: values.password,
          role: values.role,
        });

        message.success("User created successfully.");
      }

      closeModal();
      await loadUsers();
    } catch (error) {
      console.error("Failed to save user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to save user."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      setSaving(true);
      setError("");

      await api.put(
        `/users/${resettingUser.id}/password`,
        {
          password: values.password,
        }
      );

      message.success(
        `Password updated for ${resettingUser.username}.`
      );

      closePasswordModal();
    } catch (error) {
      console.error(
        "Failed to reset password:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to reset password."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");

      await api.delete(`/users/${id}`);

      message.success("User deleted successfully.");

      await loadUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete user."
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        role === "admin" ? (
          <Tag color="blue">Admin</Tag>
        ) : (
          <Tag>Staff</Tag>
        ),
    },
    {
      title: "Created",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) =>
        new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        const isCurrentUser =
          Number(record.id) === Number(currentUser.id);

        return (
          <Space wrap>
            <Button
              icon={<EditOutlined />}
              onClick={() =>
                openEditModal(record)
              }
            >
              Edit
            </Button>

            <Button
              icon={<KeyOutlined />}
              onClick={() =>
                openPasswordModal(record)
              }
            >
              Reset Password
            </Button>

            <Popconfirm
              title="Delete this user?"
              description={
                isCurrentUser
                  ? "You cannot delete your own account."
                  : "This action cannot be undone."
              }
              okText="Yes"
              cancelText="No"
              disabled={isCurrentUser}
              onConfirm={() =>
                handleDelete(record.id)
              }
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={isCurrentUser}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0 }}>
            User Management
          </Title>

          <Text type="secondary">
            Manage system users and their access roles.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Add User
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
          dataSource={users}
          loading={loading}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Add / Edit User Modal */}
      <Modal
        title={
          editingUser
            ? "Edit User"
            : "Add User"
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
            label="Username"
            name="username"
            rules={[
              {
                required: true,
                message:
                  "Please enter the username.",
              },
            ]}
          >
            <Input
              placeholder="e.g. john"
            />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter the password.",
                },
                {
                  min: 6,
                  message:
                    "Password must be at least 6 characters.",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter password"
              />
            </Form.Item>
          )}

          <Form.Item
            label="Role"
            name="role"
            rules={[
              {
                required: true,
                message:
                  "Please select a role.",
              },
            ]}
          >
            <Select
              options={[
                {
                  value: "admin",
                  label: "Admin",
                },
                {
                  value: "user",
                  label: "Staff",
                },
              ]}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            block
          >
            {editingUser
              ? "Update User"
              : "Create User"}
          </Button>
        </Form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        title={`Reset Password — ${
          resettingUser?.username || ""
        }`}
        open={passwordModalOpen}
        onCancel={closePasswordModal}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleResetPassword}
        >
          <Text
            type="secondary"
            style={{
              display: "block",
              marginBottom: 20,
            }}
          >
            Set a new password for this user.
          </Text>

          <Form.Item
            label="New Password"
            name="password"
            rules={[
              {
                required: true,
                message:
                  "Please enter the new password.",
              },
              {
                min: 6,
                message:
                  "Password must be at least 6 characters.",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              {
                required: true,
                message:
                  "Please confirm the new password.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue("password") ===
                      value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error(
                      "Passwords do not match."
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm new password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            block
          >
            Reset Password
          </Button>
        </Form>
      </Modal>
    </div>
  );
}

export default UserManagement;