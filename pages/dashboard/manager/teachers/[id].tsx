import { HeartFilled } from "@ant-design/icons";
import { Avatar, Card, Col, List, message, Rate, Row, Table, Tabs } from "antd";
import { ColumnType } from "antd/lib/table";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import MainLayout from "../../../../components/layout/layout";
import apiService from "../../../../shared/api/apiServices";
import { gutter } from "../../../../shared/constants/config";
import { Course } from "../../../../shared/types/course";
import { TeacherResponse } from "../../../../shared/types/teacher";

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
  const [data, setData] = useState<TeacherResponse>(null);
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
      // eslint-disable-next-line react/display-name
      render: (value, record) => (
        <Link href={`/dashboard/course/${record.id}`}>{value}</Link>
      ),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
    },
    {
      title: "Create Time",
      dataIndex: "ctime",
    },
    {
      title: "Enjoy",
      dataIndex: "star",
      // eslint-disable-next-line react/display-name
      render: (value) => (
        <Rate
          character={<HeartFilled />}
          defaultValue={value}
          disabled
          style={{ color: "red" }}
        />
      ),
    },
  ];

  useEffect(() => {
    const param = +router.query.id || props.id;
    (async () => {
      try {
        const { data: newData } = await apiService.getTeacherById(param);
        const { profile } = newData;
        if (!!newData) {
          const info = [
            { label: "Name", value: newData.name },
            { label: "Country", value: newData.country },
            { label: "Email", value: newData.email },
            { label: "Phone", value: newData.phone },
          ];
          const about = [
            { label: "Birthday", value: profile?.birthday },
            {
              label: "Gender",
              value: profile.gender === 1 ? "Male" : "Female",
            },
            { label: "Create Time", value: newData.ctime },
            { label: "Update Time", value: newData.updateAt },
          ];
          setData(newData);
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
      <Row gutter={gutter}>
        <Col span={8}>
          <Card
            title={
              <Avatar
                size={{ xs: 40, sm: 60, md: 80, lg: 100, xl: 120, xxl: 150 }}
                src={data?.profile?.avatar}
              />
            }
            style={{ textAlign: "center" }}
          >
            <Row gutter={gutter}>
              {info.map((item) => (
                <Col key={item.label} span={12}>
                  <b>{item.label}</b>
                  <div>{item.value}</div>
                </Col>
              ))}
              <Col span={24}>
                <b>Address</b>
                <div>{data?.profile?.address}</div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <TitleWrapper>Information</TitleWrapper>
                <Row gutter={gutter}>
                  {about.map((item) => (
                    <Col key={item.label} span={24}>
                      <Row gutter={gutter}>
                        <Col span={7}>
                          <b> {item.label}</b>
                        </Col>
                        <Col>{item.value}</Col>
                      </Row>
                    </Col>
                  ))}
                </Row>

                <TitleWrapper>Skills</TitleWrapper>

                {data?.skills.map((item, index) => (
                  <Row key={index} gutter={gutter} align="middle">
                    <Col span={4}>
                      <b>{item.name}:</b>
                    </Col>
                    <Col>
                      <Rate disabled defaultValue={item.level} />
                    </Col>
                  </Row>
                ))}

                <TitleWrapper>Description</TitleWrapper>

                <Row gutter={gutter}>
                  <Col style={{ lineHeight: 2 }}>
                    {data?.profile?.description}
                  </Col>
                </Row>

                <TitleWrapper>Education</TitleWrapper>

                <List>
                  {data?.profile?.education?.map((item, index) => (
                    <List.Item extra={item.degree} key={index}>
                      <List.Item.Meta
                        title={item.startEnd.replace(" ", " To ")}
                        description={item.level}
                      ></List.Item.Meta>
                    </List.Item>
                  ))}
                </List>

                <TitleWrapper>Work Experience</TitleWrapper>

                <List>
                  {data?.profile?.workExperience?.map((item, index) => (
                    <List.Item key={index}>
                      <List.Item.Meta
                        title={item.startEnd.replace(" ", " To ")}
                        description={
                          <Row>
                            <Col span={4}>
                              <b>{item.company}</b>
                            </Col>
                            <Col offset={1}>{item.post}</Col>
                          </Row>
                        }
                      ></List.Item.Meta>
                    </List.Item>
                  ))}
                </List>
              </TabPane>

              <TabPane tab="Courses" key="2">
                <Table
                  dataSource={data?.courses}
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
