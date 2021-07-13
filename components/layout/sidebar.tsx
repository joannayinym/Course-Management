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
export interface SideNav {
  icon?: JSX.Element;
  label: string;
  path: string;
  subNav?: SideNav[];
  hide?: boolean;
}

const students: SideNav = {
  path: "student",
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
