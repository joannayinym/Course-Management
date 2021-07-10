import { Menu, Button } from "antd";
import {
  AppstoreOutlined,
  PieChartOutlined,
  DesktopOutlined,
  ContainerOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";

const { SubMenu } = Menu;

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Menu
      // defaultSelectedKeys={["1"]}
      // defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
      inlineCollapsed={collapsed}
    >
      <Menu.Item key="1" icon={<PieChartOutlined />}>
        Overview
      </Menu.Item>
      <SubMenu key="sub1" icon={<MailOutlined />} title="Student">
        <Menu.Item key="student">
          <Link href="/dashboard/student">Student</Link>
        </Menu.Item>
      </SubMenu>
      <SubMenu key="sub2" icon={<MailOutlined />} title="Teacher">
        <Menu.Item key="5">Teacher</Menu.Item>
      </SubMenu>
      <SubMenu key="sub3" icon={<MailOutlined />} title="Course">
        <Menu.Item key="course">Course</Menu.Item>
      </SubMenu>
      <Menu.Item key="message" icon={<PieChartOutlined />}>
        Message
      </Menu.Item>
    </Menu>
  );
}
