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
  StudentsResponse,
} from "../../shared/types/student";
import Input from "antd/lib/input";
import AddEditStudent from "./addEdit";
import Link from "next/link";
import { Country } from "../../shared/types/others";
import { useListEffect } from "../../shared/utils/listHook";

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("Add");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const debouncedQuery = debounce(
    (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    1000
  );
  const { paginator, setPaginator, data, setData, total, setTotal } =
    useListEffect<StudentsRequest, StudentsResponse, Student>(
      apiService.getStudents.bind(apiService),
      "students",
      true,
      { query }
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
      filters: countries.map((item) => ({ text: item.en, value: item.en })),
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
                    const updatedData = data.filter(
                      (item) => item.id !== record.id
                    );
                    setData(updatedData);
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
      setData([student, ...data]);
    } else {
      const index = data.findIndex((item) => item.id === student.id);

      data[index] = student;
      setData([...data]);
    }
    setShowModal(false);
    setSelectedStudent(null);
  };
  const onCancel = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiService.getCountries();
        if (!!data) {
          setCountries(data);
        }
      } catch (error) {
        message.error("Something Wrong!!!", 10);
      }
    })();
  }, []);

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
        dataSource={data}
        rowKey={"id"}
        pagination={paginationProps}
        loading={!data || data.length === 0}
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
        <AddEditStudent
          actionType={actionType}
          student={selectedStudent}
          countries={countries}
          onSubmit={onAddOrEdit}
        />
      </Modal>
    </>
  );
}
