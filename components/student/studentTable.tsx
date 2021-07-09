import { Table } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "../../shared/axiosInstance";
import storage from "../../shared/storage";
import { Student, StudentInfo } from "../../shared/types";

const columns = [
  {
    key: "index",
    title: "No.",
    dataIndex: "id",
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
    render: (record: StudentInfo) =>
      record.courses.map((x) => <span key={x.id}>{x.name}</span>),
  },
  {
    title: "Student Type",
    render: (record: StudentInfo) => record.type?.name,
  },
  {
    title: "Jion Time",
    dataIndex: "createdAt",
  },
  {
    title: "Action",
  },
];

export default function StudentTable() {
  const [limit, setLimit] = useState(20);
  const [page, setPage] = useState(1);
  const [currentData, setCurrentData] = useState<Partial<Student>>({});

  useEffect(() => {
    const token = storage.token;
    const fetchData = async () => {
      try {
        console.log("token: ", token);
        const { data } = await axiosInstance.get(
          `/students?limit=${limit}&page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentData(data.data);
      } catch (err) {
        console.log("fetch data error!");
      }
    };

    fetchData();
  }, [limit, page]);

  return <Table columns={columns} dataSource={currentData.students} />;
}