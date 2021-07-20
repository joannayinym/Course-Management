import { Avatar, Card, Col, message, Row, Table, Tabs, Tag } from "antd";
import { ColumnType } from "antd/lib/table";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainLayout from "../../../../components/layout/layout";
import apiService from "../../../../shared/api/apiServices";
import { interestSkillsColors } from "../../../../shared/constants/config";
import { Course } from "../../../../shared/types/course";
import { BaseType, StudentProfile } from "../../../../shared/types/student";

const TitleWrapper = styled.h3`
  color: #7356f1;
  margin: 20px 0px;
  font-size: 24px;
`;
const { TabPane } = Tabs;

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: { id },
  };
}

export default function Page(props: { id: number }) {
  const router = useRouter();
  const [student, setStudent] = useState<StudentProfile>(null);
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  );
  const [about, setAbout] = useState<
    { label: string; value: string | number }[]
  >([]);

  const columns: ColumnType<Course>[] = [
    {
      title: "No.",
      key: "index",
      render: (_1, _2, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (type: BaseType[]) => type.map((item) => item.name).join(","),
    },
    {
      title: "Join Time",
      dataIndex: "createdAt",
    },
  ];

  useEffect(() => {
    const param = +router.query.id || props.id;
    (async () => {
      try {
        const { data } = await apiService.getStudentById(param);
        if (!!data) {
          const info = [
            { label: "Name", value: data.name },
            { label: "Age", value: data.age },
            { label: "Email", value: data.email },
            { label: "Phone", value: data.phone },
          ];
          const about = [
            { label: "Eduction", value: data.education },
            { label: "Area", value: data.country },
            { label: "Gender", value: data.gender === 1 ? "Male" : "Female" },
            {
              label: "Member Period",
              value: data.memberStartAt + " - " + data.memberEndAt,
            },
            { label: "Type", value: data.type.name },
            { label: "Create Time", value: data.ctime },
            { label: "Update Time", value: data.updateAt },
          ];
          setStudent(data);
          setInfo(info);
          setAbout(about);
        }
      } catch (err) {
        message.error("Something Wrong!!!", 10);
      }
    })();
  }, [router.query.id, props.id]);

  return (
    <MainLayout>
      <Row gutter={[6, 16]}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                size={{ xs: 40, sm: 60, md: 80, lg: 100, xl: 120, xxl: 150 }}
                src={student?.avatar}
              />
            }
            style={{ textAlign: "center" }}
          >
            <Row gutter={[6, 16]}>
              {info.map((item) => (
                <Col key={item.label} span={12}>
                  <b>{item.label}</b>
                  <div>{item.value}</div>
                </Col>
              ))}
              <Col span={24}>
                <b>Address</b>
                <div>{student?.address}</div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <TitleWrapper>Information</TitleWrapper>
                <Row gutter={[6, 16]}>
                  {about.map((item) => (
                    <Col key={item.label} span={24}>
                      <Row gutter={[6, 16]}>
                        <Col span={7}>
                          <b> {item.label}</b>
                        </Col>
                        <Col>{item.value}</Col>
                      </Row>
                    </Col>
                  ))}
                </Row>

                <TitleWrapper>Information</TitleWrapper>

                <Row gutter={[6, 16]}>
                  <Col>
                    {student?.interest.map((item, index) => (
                      <Tag
                        color={interestSkillsColors[index]}
                        key={item}
                        style={{ padding: "5px 10px" }}
                      >
                        {item}
                      </Tag>
                    ))}
                  </Col>
                </Row>
                <TitleWrapper>Description</TitleWrapper>

                <Row gutter={[6, 16]}>
                  <Col style={{ lineHeight: 2 }}>{student?.description}</Col>
                </Row>
              </TabPane>

              <TabPane tab="Courses" key="2">
                <Table
                  dataSource={student?.courses}
                  columns={columns}
                  rowKey="id"
                />
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}
