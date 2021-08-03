import { Table } from "antd";
import { ColumnType } from "antd/lib/table";
import React from "react";

const weekDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function ClassTime({ data }: { data: string[] }) {
  if (!data) {
    return <></>;
  }
  const columns: ColumnType<{ title: string; time: string }>[] = weekDays.map(
    (day, index) => {
      const target =
        data.find((item) =>
          item.toLocaleLowerCase().includes(day.toLocaleLowerCase())
        ) || "";
      const time = target.split(" ")[1];
      return {
        title: day,
        key: index,
        align: "center",
        render: () => time,
      };
    }
  );

  const dataSource = new Array(1).fill({ id: 0 });

  return (
    <Table
      rowKey="id"
      size="small"
      bordered
      pagination={false}
      dataSource={dataSource}
      columns={columns}
    />
  );
}
