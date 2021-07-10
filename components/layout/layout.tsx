import { Button, Layout, Menu, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import axiosInstance from "../../shared/axiosInstance";
import storage from "../../shared/storage";
import Sidebar from "./sidebar";

const { Header, Sider, Content } = Layout;

const Title = styled.h1`
  font-size: 1.6em;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
  font-family: "BebasNeue";
  text-transform: uppercase;
  font-weight: 700;
  color: white;
`;

export default function MainLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [login, setLogin] = useState(false);

  const router = useRouter();

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const userInfo = storage.userInfo;

    if (!!userInfo) {
      setLogin(true);
    }
  }, []);

  const logout = async () => {
    try {
      await axiosInstance.post("/logout");
    } catch (err) {}
    setLogin(false);
    storage.deleteUserInfo();
    router.push("/");
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Title>
          <Link href="/">CMS</Link>
        </Title>
        <Sidebar />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            paddingLeft: 20,
            paddingRight: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="primary"
            className="trigger"
            onClick={toggle}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          {login ? (
            <Tooltip title="Logout">
              <Button
                type="primary"
                shape="circle"
                onClick={logout}
                icon={<UserOutlined />}
              />
            </Tooltip>
          ) : null}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 1000,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
