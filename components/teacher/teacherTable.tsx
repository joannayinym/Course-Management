import { Button, message, Modal, Popconfirm, Table } from "antd";
import { ColumnType, TablePaginationConfig } from "antd/lib/table";
import React, { ChangeEvent, useEffect, useState } from "react";
import TextLink from "antd/lib/typography/Link";
import { debounce } from "lodash";
import { PlusOutlined } from "@ant-design/icons";
import styled from "styled-components";
import apiService from "../../shared/api/apiServices";
import {
  Skill,
  Teacher,
  TeacherRequest,
  TeachersResponse,
} from "../../shared/types/teacher";
import Input from "antd/lib/input";
import AddEditTeacher from "./addEdit";
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

export default function TeacherTable() {
  const [query, setQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [actionType, setActionType] = useState<string>("Add");
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const debouncedQuery = debounce(
    (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    1000
  );
  const { paginator, setPaginator, data, setData, total, setTotal } =
    useListEffect<TeacherRequest, TeachersResponse, Teacher>(
      apiService.getTeachers.bind(apiService),
      "teachers",
      true,
      { query }
    );
  const columns: ColumnType<Teacher>[] = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      sortDirections: ["ascend", "descend"],
      sorter: (pre: Teacher, next: Teacher) => {
        const preCode = pre.name.charCodeAt(0);
        const nextCode = next.name.charCodeAt(0);

        return preCode > nextCode ? 1 : preCode === nextCode ? 0 : -1;
      },
      // eslint-disable-next-line react/display-name
      render: (_, record: Teacher) => (
        <Link href={`/dashboard/manager/teachers/${record.id}`} passHref>
          {record.name}
        </Link>
      ),
    },
    {
      title: "Area",
      dataIndex: "country",
      filters: countries.map((item) => ({ text: item.en, value: item.en })),
      onFilter: (value: string | number | boolean, record: Teacher) =>
        record.country.includes(value.toString()),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Skill",
      dataIndex: "skills",
      render: (skills: Skill[]) => skills?.map((skill) => skill.name).join(","),
    },
    {
      title: "Course Amount",
      dataIndex: "courseAmount",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Action",
      render: function showButton(record: Teacher) {
        return (
          <>
            <TextLink
              onClick={() => {
                setShowModal(true);
                setActionType("Edit");
                setSelectedTeacher(record);
              }}
            >
              Edit{" "}
            </TextLink>
            <Popconfirm
              title="Are you sure to delete?"
              onConfirm={async () => {
                try {
                  const { data: isDeleted } = await apiService.deleteTeacher(
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

  const onAddOrEdit = (teacher: Teacher) => {
    if (actionType === "Add") {
      setData([teacher, ...data]);
    } else {
      const index = data.findIndex((item) => item.id === teacher.id);

      data[index] = teacher;
      setData([...data]);
    }
    setShowModal(false);
    setSelectedTeacher(null);
  };
  const onCancel = () => {
    setShowModal(false);
    setSelectedTeacher(null);
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
        title={`${actionType} Teacher`}
        visible={showModal}
        destroyOnClose={true}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
        ]}
      >
        <AddEditTeacher
          actionType={actionType}
          teacher={selectedTeacher}
          countries={countries}
          onSubmit={onAddOrEdit}
        />
      </Modal>
    </>
  );
}
