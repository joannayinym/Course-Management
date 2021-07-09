import React, { useEffect } from "react";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Radio,
  RadioChangeEvent,
  Row,
} from "antd";
import styled from "styled-components";
import crypto from "crypto-js";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { LoginType } from "../../shared/auth";
import axiosInstance from "../../shared/axiosInstance";
import storage from "../../shared/storage";

const Title = styled.h1`
  font-size: 1.6em;
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
  font-family: "BebasNeue";
  text-transform: uppercase;
  font-weight: 700;
`;

const userOptions = [
  { label: "Student", value: "student" },
  { label: "Teacher", value: "teacher" },
  { label: "Manager", value: "manager" },
];

export default function Login() {
  const [form] = Form.useForm();

  const router = useRouter();

  useEffect(() => {
    const userInfo = storage.userInfo;
    if (!!userInfo) {
      router.push("/dashboard");
    }
  }, [router]);

  const login = async (loginParams: LoginType) => {
    try {
      const { data } = await axiosInstance.post("/login", loginParams);
      if (!!data) {
        storage.setUserInfo(data.data);
        router.push("/dashboard");
      }
    } catch (err) {
      message.error(
        "Something Wrong!! Please check your password or email",
        10
      );
    }
  };

  const onFinish = (values: any) => {
    var encryptedPassword = crypto.AES.encrypt(
      values.password,
      "cms"
    ).toString();
    const params: LoginType = {
      email: values.email,
      password: encryptedPassword,
      remember: values.remember,
      role: values.role,
    };
    login(params);
  };

  const onChangeUserType = (e: RadioChangeEvent) => {
    form.resetFields();
    form.setFieldsValue({ role: e.target.value });
  };

  return (
    <>
      <Row justify="center">
        <Col lg={8} md={16} sm={20} xs={23}>
          {/* <Title>Course Management Assistant</Title> */}
          <Title>课程管理助手</Title>
        </Col>
      </Row>
      <Row justify="center">
        <Col lg={8} md={16} sm={20} xs={23}>
          <Form
            name="login"
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true, role: "student" }}
            onFinish={onFinish}
            form={form}
          >
            <Form.Item name="role">
              <Radio.Group
                options={userOptions}
                onChange={onChangeUserType}
                optionType="button"
                buttonStyle="outline"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "请输入您的邮箱" },
                { type: "email" },
              ]}
            >
              <Input
                placeholder="请输入您的邮箱"
                prefix={<UserOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入您的密码" },
                {
                  min: 4,
                  max: 16,
                  message: "密码需要4-16个字符",
                  validateTrigger: "onBlur",
                },
              ]}
            >
              <Input.Password
                placeholder="请输入密码"
                prefix={<LockOutlined className="site-form-item-icon" />}
              />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>记住我</Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                登录
              </Button>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 0, span: 24 }}>
              No account? <Link href="/auth/signup">Sign up</Link>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
