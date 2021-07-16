import {
  DashboardOutlined,
  DeploymentUnitOutlined,
  EditOutlined,
  FileAddOutlined,
  MessageOutlined,
  ProjectOutlined,
  ReadOutlined,
  SolutionOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Role } from "../../shared/types/user";
export interface SideNav {
  icon?: JSX.Element;
  label: string;
  path: string;
  subNav?: SideNav[];
  hide?: boolean;
}

const students: SideNav = {
  path: "students",
  label: "Student",
  icon: <SolutionOutlined />,
  subNav: [{ path: "", label: "Student List", icon: <TeamOutlined /> }],
};

const courses: SideNav = {
  path: "courses",
  label: "Course",
  icon: <ReadOutlined />,
  subNav: [
    { path: "", label: "All Courses", icon: <ProjectOutlined /> },
    { path: "addCourse", label: "Add Course", icon: <FileAddOutlined /> },
    { path: "editCourse", label: "Edit Course", icon: <EditOutlined /> },
  ],
};

const teachers: SideNav = {
  path: "teachers",
  label: "Teacher",
  icon: <DeploymentUnitOutlined />,
  subNav: [
    {
      path: "",
      label: "Teacher List",
      icon: <TeamOutlined />,
    },
  ],
};

const overview: SideNav = {
  path: "",
  label: "Overview",
  icon: <DashboardOutlined />,
};

const messages: SideNav = {
  path: "message",
  label: "Message",
  icon: <MessageOutlined />,
};

export const sidebar = {
  manager: [overview, students, teachers, courses, messages],
  teacher: [overview, students, courses, messages],
  student: [overview, messages],
};

const { SubMenu } = Menu;

export function MenuGenerator({ userRole }: { userRole: Role | undefined }) {
  let selectedKeys: string[] = [""];
  let openKeys: string[] = [];
  const router = useRouter();
  const path = router.pathname.split("dashboard/");
  if (path && path.length > 1) {
    const menuList = path[1].split("/");
    if (menuList.length > 2) {
      openKeys = [menuList[1]];
      if (menuList[2].includes("[")) {
        selectedKeys = [`${menuList[1]}-`];
      } else {
        selectedKeys = [`${menuList[1]}-${menuList[2]}`];
      }
    } else if (menuList.length > 1) {
      openKeys = [menuList[1]];
      selectedKeys = [`${menuList[1]}-`];
    }
  }

  return (
    <Menu
      defaultSelectedKeys={selectedKeys}
      defaultOpenKeys={openKeys}
      mode="inline"
      theme="dark"
      inlineCollapsed={true}
    >
      {userRole &&
        sidebar[userRole].map((item: SideNav) => {
          if (!item.subNav) {
            return (
              <Menu.Item key={item.path} icon={item.icon}>
                <Link href={`/dashboard/${userRole}/${item.path}`}>
                  {item.label}
                </Link>
              </Menu.Item>
            );
          } else {
            const subMenu = item.subNav.map((subItem: SideNav) => (
              <Menu.Item
                key={`${item.path}-${subItem.path}`}
                icon={subItem.icon}
              >
                <Link
                  href={`/dashboard/${userRole}/${item.path}/${subItem.path}`}
                >
                  {subItem.label}
                </Link>
              </Menu.Item>
            ));
            return (
              <SubMenu key={item.path} icon={item.icon} title={item.label}>
                {subMenu}
              </SubMenu>
            );
          }
        })}
    </Menu>
  );
}
