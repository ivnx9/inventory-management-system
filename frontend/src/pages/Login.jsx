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
        error.response?.data?.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "#f5f7fb",
      }}
    >
      {/* Left Branding Section */}
      <div
        style={{
          flex: 1,
          minHeight: "100vh",
          background:
            "linear-gradient(135deg, #071b49 0%, #0b4fba 55%, #18aef0 100%)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: 48,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative shapes */}
        <div
          style={{
            position: "absolute",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            top: -120,
            left: -120,
          }}
        />

        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            bottom: -100,
            right: -100,
          }}
        />

        {/* Brand Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            maxWidth: 520,
          }}
        >
          <Title
            style={{
              color: "white",
              fontSize: 42,
              marginBottom: 8,
            }}
          >
            Stocky
          </Title>

          <Text
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: 18,
            }}
          >
            Your Friendly Inventory Management System
          </Text>

          {/* Stocky Mascot */}
          <div
            style={{
              height: 360,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <img
              src={mascot}
              alt="Stocky mascot"
              style={{
                width: "100%",
                maxWidth: 360,
                maxHeight: 360,
                objectFit: "contain",
                filter:
                  "drop-shadow(0 18px 25px rgba(0, 0, 0, 0.25))",
              }}
            />
          </div>

          <Paragraph
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: 16,
              maxWidth: 420,
              margin: "0 auto",
            }}
          >
            Keep your products organized, track inventory,
            and manage your stock with ease.
          </Paragraph>
        </div>
      </div>

      {/* Right Login Section */}
      <div
        style={{
          width: "45%",
          minWidth: 420,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 40,
        }}
      >
        <Card
          bordered={false}
          style={{
            width: "100%",
            maxWidth: 430,
            borderRadius: 16,
            boxShadow: "0 12px 40px rgba(0, 0, 0, 0.08)",
          }}
          styles={{
            body: {
              padding: 40,
            },
          }}
        >
          <div style={{ marginBottom: 32 }}>
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
                  message: "Please enter your username.",
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
                  message: "Please enter your password.",
                },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter password"
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
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

          <div
            style={{
              textAlign: "center",
              marginTop: 28,
            }}
          >
            <Text type="secondary" style={{ fontSize: 13 }}>
              Stocky Inventory Management System
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Login;