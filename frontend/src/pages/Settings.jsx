import { useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Typography,
  message,
} from "antd";
import api from "../services/api";

const { Title, Text } = Typography;

function Settings() {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const handleChangePassword = async (values) => {
    try {
      setLoading(true);

      await api.put("/users/me/password", {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });

      message.success("Password changed successfully.");

      form.resetFields();
    } catch (error) {
      console.error("Failed to change password:", error);

      message.error(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Title level={2}>Settings</Title>

      <Card
        title="My Account"
        style={{
          maxWidth: 600,
        }}
      >
        <Text type="secondary">
          Change your account password.
        </Text>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Current Password"
            name="currentPassword"
            rules={[
              {
                required: true,
                message: "Please enter your current password.",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter current password"
            />
          </Form.Item>

          <Form.Item
            label="New Password"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "Please enter your new password.",
              },
              {
                min: 6,
                message: "Password must be at least 6 characters.",
              },
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Enter new password"
            />
          </Form.Item>

          <Form.Item
            label="Confirm New Password"
            name="confirmPassword"
            dependencies={["newPassword"]}
            rules={[
              {
                required: true,
                message: "Please confirm your new password.",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    !value ||
                    getFieldValue("newPassword") === value
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error("Passwords do not match.")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              size="large"
              placeholder="Confirm new password"
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Change Password
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default Settings;