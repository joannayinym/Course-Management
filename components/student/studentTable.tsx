import { Button, message, Modal, Popconfirm, Table } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/lib/table";
import React, { ChangeEvent, useEffect, useState } from "react";
import TextLink from "antd/lib/typography/Link";
import { debounce } from "lodash";
import { formatDistanceToNow } from "date-fns";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import apiService from "../../shared/api/apiServices";
import {
  BaseType,
  Student,
  StudentCourse,
  StudentsRequest,
} from "../../shared/types/student";
import { Paginator } from "../../shared/types/type";
import Input from "antd/lib/input";
import { businessAreas } from "../../shared/constants/role";
import AddAndEditStudent from "./addAndEditStudent";
import Link from "next/link";

const TableHeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Search = styled(Input.Search)`
  width: 300px;
  display: block;
`;

export default function StudentTable() {
  const [query, setQuery] = useState<string>("");
  const [paginator, setPaginator] = useState<Paginator>({ limit: 20, page: 1 });
  const [currentData, setCurrentData] = useState<Student[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("Add");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const debouncedQuery = debounce(
    (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    1000
  );
  const columns: ColumnType<Student>[] = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sortDirections: ["ascend", "descend"],
      sorter: (pre: Student, next: Student) => {
        const preCode = pre.name.charCodeAt(0);
        const nextCode = next.name.charCodeAt(0);
        return preCode > nextCode ? 1 : preCode === nextCode ? 0 : -1;
      },
      // eslint-disable-next-line react/display-name
      render: (_, record: Student) => (
        <Link href={`/dashboard/manager/students/${record.id}`} passHref>
          {record.name}
        </Link>
      ),
    },
    {
      title: "Area",
      dataIndex: "country",
      filters: businessAreas.map((item) => ({ text: item, value: item })),
      onFilter: (value: string | number | boolean, record: Student) =>
        record.country.includes(value.toString()),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Selected Curriculum",
      dataIndex: "courses",
      render: (courses: StudentCourse[]) =>
        courses?.map((course) => course.name).join(","),
    },
    {
      title: "Student Type",
      dataIndex: "type",
      filters: [
        { text: "developer", value: "developer" },
        { text: "tester", value: "tester" },
      ],
      onFilter: (value: string | number | boolean, record: Student) =>
        record.type.name === value,
      render: (type: BaseType) => type?.name,
    },
    {
      title: "Join Time",
      render: (record: Student) =>
        formatDistanceToNow(new Date(record.createdAt), { addSuffix: true }),
    },
    {
      title: "Action",
      render: function showButton(record: Student) {
        return (
          <>
            <TextLink
              onClick={() => {
                setShowModal(true);
                setActionType("Edit");
                setSelectedStudent(record);
              }}
            >
              Edit{" "}
            </TextLink>
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={async () => {
                try {
                  const { data: isDeleted } = await apiService.deleteStudent(
                    record.id
                  );
                  if (isDeleted) {
                    const updatedData = currentData.filter(
                      (item) => item.id !== record.id
                    );
                    setCurrentData(updatedData);
                    setTotal(total - 1);
                  }
                } catch (Error) {
                  message.error("Something Wrong with deleting!!!", 10);
                }
              }}
              okText="Confirm"
              cancelText="Cancel"
            >
              <TextLink>Delete</TextLink>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  useEffect(() => {
    (async () => {
      const params: StudentsRequest = query
        ? { ...paginator, query }
        : paginator;
      try {
        const { data } = await apiService.getStudents(params);
        setCurrentData(data?.students || []);
        setTotal(data?.total || 0);
      } catch (err) {
        message.error("Something Wrong!!!", 10);
      }
    })();
  }, [paginator, query]);

  const paginationProps: TablePaginationConfig = {
    current: paginator.page,
    pageSize: paginator.limit,
    total: total,
    showSizeChanger: true,
    showTotal: (total: number) => `Total ${total} items`,
    onChange: (page: number, pageSize?: number | undefined) => {
      setPaginator({ page, limit: pageSize || 20 });
    },
  };

  const onAddOrEdit = (student: Student) => {
    if (actionType === "Add") {
      setCurrentData([student, ...currentData]);
    } else {
      const index = currentData.findIndex((item) => item.id === student.id);

      currentData[index] = student;
      setCurrentData([...currentData]);
    }
    setShowModal(false);
    setSelectedStudent(null);
  };
  const onCancel = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  return (
    <>
      <TableHeaderWrapper>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setShowModal(true);
            setActionType("Add");
          }}
        >
          Add
        </Button>
        <Search
          placeholder="Search by name"
          onSearch={(value) => setQuery(value)}
          onChange={debouncedQuery}
        />
      </TableHeaderWrapper>
      <Table
        columns={columns}
        dataSource={currentData}
        rowKey={"id"}
        pagination={paginationProps}
      />
      <Modal
        title={`${actionType} Student`}
        visible={showModal}
        destroyOnClose={true}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
        ]}
      >
        <AddAndEditStudent
          actionType={actionType}
          student={selectedStudent}
          onSubmit={onAddOrEdit}
        />
      </Modal>
    </>
  );
}
