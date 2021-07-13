import { message, Table, Pagination } from "antd";
import { ColumnType } from "antd/lib/table";
import { useEffect, useState } from "react";
import TextLink from "antd/lib/typography/Link";
import apiService from "../../shared/api/apiServices";
import { Student, StudentResponse } from "../../shared/types/student";
import styled from "styled-components";

const Divider = styled.div`
  height: 20px;
`;

export default function StudentTable() {
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [currentData, setCurrentData] = useState<StudentResponse | null>(null);
  const columns: ColumnType<Student>[] = [
    {
      title: "No.",
      key: "index",
      render: (_1: any, _2: any, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Area",
      dataIndex: "country",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      render: (record: Student) =>
        record.courses.map((x) => <span key={x.id}>{x.name}</span>),
    },
    {
      title: "Student Type",
      render: (record: Student) => record.type?.name,
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
    },
    {
      title: "Action",
      render: function show() {
        return (
          <>
            <TextLink>Edit </TextLink>
            <TextLink>Delete</TextLink>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiService.getStudents({ limit, page });
        setCurrentData(data || null);
      } catch (err) {
        message.error("Something Wrong!!!", 10);
      }
    })();
  }, [limit, page]);

  const handlePageChange = (current: number, size: number | undefined) => {
    setPage(current);
  };

  const handleSizeChange = (current: number, size: number | undefined) => {
    if (size) {
      current = 1;
      setLimit(size);
      handlePageChange(current, size);
    }
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={currentData?.students}
        rowKey={"id"}
        pagination={false}
      />
      <Divider />
      <Pagination
        total={currentData?.total}
        pageSize={limit}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        onChange={handlePageChange}
        onShowSizeChange={handleSizeChange}
      />
    </>
  );
}
