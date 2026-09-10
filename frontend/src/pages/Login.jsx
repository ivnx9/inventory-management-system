import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  message,
  Typography,
} from "antd";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import mascot from "../assets/mascot.png";

import "../App.css";

const { Title, Text, Paragraph } = Typography;

function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        username: values.username,
        password: values.password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      message.success("Login successful!");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      message.error(
        error.response?.data?.message ||
          "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Branding Section */}
      <div className="login-brand">
        <div className="login-brand-decoration login-decoration-one" />
        <div className="login-brand-decoration login-decoration-two" />

        <div className="login-brand-content">
          <Title
            className="login-brand-title"
          >
            Stocky
          </Title>

          <Text className="login-brand-subtitle">
            Your Friendly Inventory Management System
          </Text>

          <div className="login-mascot-container">
            <img
              src={mascot}
              alt="Stocky mascot"
              className="login-mascot"
            />
          </div>

          <Paragraph className="login-brand-description">
            Keep your products organized, track inventory,
            and manage your stock with ease.
          </Paragraph>
        </div>
      </div>

      {/* Login Section */}
      <div className="login-form-section">
        <Card
          bordered={false}
          className="login-card"
          styles={{
            body: {
              padding: 40,
            },
          }}
        >
          <div className="login-heading">
            <Title
              level={2}
              style={{
                marginBottom: 8,
              }}
            >
              Welcome back
            </Title>

            <Text type="secondary">
              Sign in to continue to Stocky.
            </Text>
          </div>

          <Form
            layout="vertical"
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter your username.",
                },
              ]}
            >
              <Input
                size="large"
                placeholder="Enter username"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message:
                    "Please enter your password.",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter password"
              />
            </Form.Item>

            <Form.Item
              style={{
                marginBottom: 0,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                block
                style={{
                  height: 48,
                  borderRadius: 8,
                  fontWeight: 600,
                }}
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Text
              type="secondary"
              style={{
                fontSize: 13,
              }}
            >
              Stocky Inventory Management System
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;