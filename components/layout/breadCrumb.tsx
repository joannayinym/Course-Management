import { Breadcrumb } from "antd";
import { useRouter } from "next/router";
import React from "react";
import storage from "../../shared/storage";
import { sidebar } from "./sidebar";

export default function AppBreadCrumb() {
  const router = useRouter();
  const userRole = storage?.userInfo?.role;
  let pathInfo: { href: string; label: string }[] = [
    {
      href: `/dashboard/${userRole}`,
      label: `CMS(${userRole?.toLocaleUpperCase()})`,
    },
  ];
  const path = router.pathname.split("dashboard/");
  if (path && path.length > 1) {
    const menuList = path[1].split("/");
    if (menuList.length === 1) {
      pathInfo = [
        ...pathInfo,
        {
          href: `/dashboard/${menuList[0]}`,
          label: "Overview",
        },
      ];
    } else if (menuList.length === 2) {
      sidebar[menuList[0]].forEach((item) => {
        if (item.path === menuList[1]) {
          pathInfo = [
            ...pathInfo,
            {
              href: `/dashboard/${menuList[0]}/${item.path}`,
              label: item.label,
            },
          ];
        }
      });
    } else if (menuList.length === 3) {
      if (menuList[2].includes("[")) {
        sidebar[menuList[0]].forEach((item) => {
          if (item.path === menuList[1]) {
            pathInfo = [
              ...pathInfo,

              {
                href: `/dashboard/${menuList[0]}/${item.path}`,
                label: item.label,
              },
            ];
            pathInfo = [
              ...pathInfo,
              {
                href: "",
                label: "Detail",
              },
            ];
          }
        });
      } else {
        sidebar[menuList[0]].forEach((item) => {
          if (item.path === menuList[1]) {
            pathInfo = [
              ...pathInfo,
              {
                href: `/dashboard/${menuList[0]}/${item.path}`,
                label: item.label,
              },
            ];
            item.subNav.forEach((subItem) => {
              if (subItem.path === menuList[2]) {
                pathInfo = [
                  ...pathInfo,
                  {
                    href: "",
                    label: subItem.label,
                  },
                ];
              }
            });
          }
        });
      }
    }
  }

  return (
    <Breadcrumb separator=">">
      {pathInfo.map((item, index) => (
        <Breadcrumb.Item key={index} href={item.href}>
          {item.label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}
