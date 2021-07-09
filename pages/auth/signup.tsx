import React from "react";
import { Button, Col, Form, Input, Radio, RadioChangeEvent, Row } from "antd";
import styled from "styled-components";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { LoginType } from "../../shared/auth";
import axiosInstance from "../../shared/axiosInstance";
import Link from "next/link";
import storage from "../../shared/storage";

const Title = styled.h1`
  font-size: 1.6em;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
  font-family: "BebasNeue";
  text-transform: uppercase;
  font-weight: 700;
  line-height: 1.5;
`;

export default function Signup() {
  const [form] = Form.useForm();

  const router = useRouter();

  const signup = async (loginParams: LoginType) => {
    const { data } = await axiosInstance.post("/signup", loginParams);

    if (!!data) {
      storage.setUserInfo(data);
      router.push("/");
    }
  };

  const onFinish = (values: any) => {
    const params: LoginType = {
      email: values.email,
      password: values.password,
      remember: values.remember,
      role: values.role,
    };
    if (signup(params)) {
      router.push("/");
    }
  };

  const onChangeUserType = (e: RadioChangeEvent) => {
    form.resetFields();
    form.setFieldsValue({ role: e.target.value });
  };

  return (
    <>
      <Row justify="center">
        <Col span={8}>
          <Title>Sign up your account</Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={8}>
          <Form
            name="signup"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true, role: "student" }}
            onFinish={onFinish}
            form={form}
          >
            <Form.Item label="Role" name="role">
              <Radio.Group onChange={onChangeUserType} buttonStyle="solid">
                <Radio value="student">Student</Radio>
                <Radio value="teacher">Teacher</Radio>
                <Radio value="manager">Manager</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "'email' is required" },
                { type: "email" },
              ]}
            >
              <Input
                placeholder="Please input email"
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "'password' is required" }]}
            >
              <Input.Password
                placeholder="Please input password"
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The two passwords that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                placeholder="Tap password again"
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                Sign up
              </Button>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
              Already have an account? <Link href="/auth">Sign in</Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
