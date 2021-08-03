import { Breadcrumb } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  deepSearchRecordFactory,
  getSideNavNameByPath,
} from "../../shared/utils/sideNav";
import { sidebar, SideNav } from "./sidebar";
import { Role } from "../../shared/types/user";

export default function AppBreadCrumb({
  userRole,
}: {
  userRole: Role | undefined;
}) {
  const router = useRouter();
  const path = router.pathname;
  const paths = path.split("/").slice(1);
  const root = "/" + paths.slice(0, 2).join("/");
  const role =
    userRole || path.split("/").length > 2 ? path.split("/")[2] : undefined;
  const names = getSideNavNameByPath(sidebar[role], path, role) || [];

  return (
    <Breadcrumb style={{ margin: "0 16px", padding: 16 }}>
      <Breadcrumb.Item key={root}>
        <Link href={root}>{`CMS ${role.toLocaleUpperCase()} SYSTEM`}</Link>
      </Breadcrumb.Item>
      {names.map((name, index) => {
        if (name === "Detail") {
          return <Breadcrumb.Item key={index}>Detail</Breadcrumb.Item>;
        }

        const record = deepSearchRecordFactory(
          (nav: SideNav, value: string) => nav.label === value
        )(sidebar[role], name);

        const isText =
          index === names.length - 1 || record.every((item) => item.hide);

        let subPath = record
          .map((item) => item.path)
          .reduce((acc, cur) => [...acc, cur], [])
          .filter((item) => !!item)
          .join("/");
        subPath = subPath.endsWith("/") ? subPath.slice(0, -1) : subPath;

        return (
          <Breadcrumb.Item key={index}>
            {isText ? name : <Link href={`${root}/${subPath}`}>{name}</Link>}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb>
  );
}
