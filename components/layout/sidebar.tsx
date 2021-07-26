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
import { generateKey, getActiveKey } from "../../shared/utils/sideNav";
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
  hide: true,
  icon: <SolutionOutlined />,
  subNav: [{ path: "", label: "Student List", icon: <TeamOutlined /> }],
};

const courses: SideNav = {
  path: "courses",
  label: "Course",
  hide: true,
  icon: <ReadOutlined />,
  subNav: [
    { path: "", label: "All Courses", icon: <ProjectOutlined /> },
    { path: "add-course", label: "Add Course", icon: <FileAddOutlined /> },
    { path: "edit-course", label: "Edit Course", icon: <EditOutlined /> },
  ],
};

const teachers: SideNav = {
  path: "teachers",
  label: "Teacher",
  hide: true,
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

function renderMenuItems(
  data: SideNav[],
  parent: string = "",
  userRole: string = "student"
): JSX.Element[] {
  return data.map((item, index) => {
    const key = generateKey(item, index);

    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={key} title={item.label} icon={item.icon}>
          {renderMenuItems(item.subNav, item.path + "/", userRole)}
        </Menu.SubMenu>
      );
    } else {
      return (
        <Menu.Item key={key} title={item.label} icon={item.icon}>
          {item.label.toLocaleLowerCase() === "overview" ? (
            <Link href={`/dashboard/${userRole}/${parent}`}>{item.label}</Link>
          ) : (
            <Link href={`/dashboard/${userRole}/${parent}${item.path}`}>
              {item.label}
            </Link>
          )}
        </Menu.Item>
      );
    }
  });
}

export function MenuGenerator({ userRole }: { userRole: Role | undefined }) {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split("/");
  const role = userRole || paths.length > 2 ? paths[2] : undefined;
  const key = getActiveKey(sidebar[role], path, role);
  const defaultSelectedKeys = [key.split("/").pop()];
  const defaultOpenKeys = key.split("/").slice(0, -1);
  const menuItems = renderMenuItems(sidebar[role], "", role);

  return (
    <Menu
      defaultOpenKeys={defaultOpenKeys}
      defaultSelectedKeys={defaultSelectedKeys}
      mode="inline"
      theme="dark"
      inlineCollapsed={true}
    >
      {menuItems}
    </Menu>
  );
}
