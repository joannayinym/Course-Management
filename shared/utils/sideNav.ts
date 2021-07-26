import { memoize } from "lodash";
import { SideNav } from "../../components/layout/sidebar";

export const isDetailPath = (path: string): boolean => {
  const paths = path.split("/");
  const length = paths.length;
  const last = paths[length - 1];
  const reg = /\[.*\]/;

  return reg.test(last);
};

export const generateKey = (data: SideNav, index: number): string => {
  return `${data.label}_${index}`;
};

export const getSideNavNameByKey = (key: string): string[] => {
  return key.split("/").map((item) => item.split("_")[0]);
};

const generateFactory = (fn: (data: SideNav, index: number) => string) =>
  function inner(data: SideNav[], current = ""): string[][] {
    const keys = data.map((item, index) => {
      let key = fn(item, index);

      if (current) {
        key = [current, key].join("/");
      }

      if (item.subNav && !!item.subNav.length) {
        return inner(item.subNav, key).map((item) => item.join("/"));
      } else {
        return [key];
      }
    });

    return keys;
  };

const generatePath = (data: SideNav): string => {
  return data.path;
};

const getKeyPathInfo = (
  data: SideNav[],
  userRole: string
): { keys: string[]; paths: string[] } => {
  const getPaths = generateFactory(generatePath);
  const paths = getPaths(data)
    .reduce((acc, cur) => [...acc, ...cur], [])
    .map((item) =>
      ["/dashboard", userRole, item].filter((item) => !!item).join("/")
    );
  const getKeys = generateFactory(generateKey);
  const keys = getKeys(data).reduce((acc, cur) => [...acc, ...cur], []);

  return { keys, paths };
};

const memoizedGetKeyPathInfo = memoize(getKeyPathInfo, (data) =>
  data.map((item) => item.label).join("_")
);

const isPathEqual = (target: string) => (current: string) => {
  current = current.endsWith("/") ? current.slice(0, -1) : current;

  return current === target;
};

export const getActiveKey = (
  data: SideNav[],
  path: string,
  userRole: string
) => {
  const activeRoute = isDetailPath(path)
    ? path.slice(0, path.lastIndexOf("/"))
    : path;
  const { paths, keys } = memoizedGetKeyPathInfo(data, userRole);
  const isEqual = isPathEqual(activeRoute);
  const index = paths.findIndex(isEqual);

  return keys[index] || "";
};

export const getSideNavNameByPath = (
  data: SideNav[],
  path: string,
  userRole: string
): string[] => {
  const isDetail = isDetailPath(path);

  path = isDetail ? path.split("/").slice(0, -1).join("/") : path;

  const { paths, keys } = memoizedGetKeyPathInfo(data, userRole);
  const isEqual = isPathEqual(path);
  const index = paths.findIndex(isEqual);
  const result = getSideNavNameByKey(keys[index]);

  return isDetail ? [...result, "Detail"] : result;
};

type CheckFn = (data: SideNav, value: any) => boolean;

export const deepSearchRecordFactory = (chechFn: CheckFn) => {
  return function search(
    menu: SideNav[],
    node: string,
    record = []
  ): SideNav[] {
    if (!menu || !menu.length) return record;

    const [firstNode, ...restNodes] = menu;

    if (chechFn(firstNode, node)) {
      record.unshift(firstNode);
      return record;
    }

    if (firstNode.subNav) {
      const res = search(firstNode.subNav, node, record);
      if (res) {
        record.unshift(firstNode);
        return record;
      }
    }

    if (restNodes.length) {
      const res = search(restNodes, node, record);
      if (res) return record;
    }

    return null;
  };
};
