import { Button, Layout, Menu, message, Tooltip } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Link from "next/link";
import { useRouter } from "next/router";
import axiosInstance from "../../shared/axiosInstance";
import storage from "../../shared/storage";
import { sidebar, SideNav } from "./sidebar";
import { Role } from "../../shared/types/user";
import apiService from "../../shared/api/apiServices";

const { Header, Sider, Content } = Layout;

const Title = styled.a`
  display: block;
  font-size: 1.6em;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
  font-family: "monospace";
  text-transform: uppercase;
  font-weight: 700;
  color: white;
  text-shadow: rgb(33, 150, 243) 0px 0px 5px, rgb(33, 150, 243) 0px 0px 15px,
    rgb(33, 150, 243) 0px 0px 20px, rgb(33, 150, 243) 0px 0px 40px,
    rgb(63, 81, 181) 0px 0px 60px, rgb(156, 39, 176) 0px 0px 10px,
    rgb(63, 81, 181) 0px 0px 98px;
`;

const { SubMenu } = Menu;

export default function MainLayout(props: React.PropsWithChildren<any>) {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [login, setLogin] = useState(false);
  const [userRole, setUserRole] = useState<Role | undefined>(undefined);
  const router = useRouter();
  const toggle = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    if (storage.token) {
      setLogin(true);
    }
    setUserRole(storage.role);
  }, []);

  const logout = async () => {
    try {
      await apiService.logout();
    } catch (err) {
      message.error("Something Wrong!!!", 10);
    }
    setLogin(false);
    storage.deleteUserInfo();
    router.push("/");
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Link href="/" passHref>
          <Title>CMS</Title>
        </Link>

        <Menu
          // defaultSelectedKeys={["1"]}
          // defaultOpenKeys={["sub1"]}
          mode="inline"
          theme="dark"
          inlineCollapsed={collapsed}
        >
          {userRole &&
            sidebar[userRole].map((item: SideNav, index: number) => {
              if (!item.subNav) {
                return (
                  <Menu.Item key={item.label + index} icon={item.icon}>
                    <Link href={`/dashboard/${userRole}/${item.path}`}>
                      {item.label}
                    </Link>
                  </Menu.Item>
                );
              } else {
                const subMenu = item.subNav.map(
                  (subItem: SideNav, subIndex: number) => (
                    <Menu.Item
                      key={item.label + subItem.label + subIndex}
                      icon={subItem.icon}
                    >
                      <Link
                        href={`/dashboard/${userRole}/${item.path}/${subItem.path}`}
                      >
                        {subItem.label}
                      </Link>
                    </Menu.Item>
                  )
                );
                return (
                  <SubMenu
                    key={item.label + index}
                    icon={item.icon}
                    title={item.label}
                  >
                    {subMenu}
                  </SubMenu>
                );
              }
            })}
        </Menu>
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
            type="link"
            className="trigger"
            onClick={toggle}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          />
          {login ? (
            <Tooltip title="Logout">
              <Button
                type="dashed"
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
