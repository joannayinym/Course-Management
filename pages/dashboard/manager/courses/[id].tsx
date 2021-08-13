import { Badge, Card, Col, Collapse, Row, Steps, Tag } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ClassTime from "../../../../components/course/classTime";
import CourseOverview from "../../../../components/course/overview";
import MainLayout from "../../../../components/layout/layout";
import apiService from "../../../../shared/api/apiServices";
import { gutter } from "../../../../shared/constants/config";
import {
  CourseStatusBadge,
  CourseStatusColor,
  CourseStatusText,
} from "../../../../shared/constants/course";
import { CourseDetail, Schedule } from "../../../../shared/types/course";

const RowWrapper = styled(Row)`
  width: calc(100% + 48px);
  margin: 0 0 0 -24px !important;
`;

const ColWrapper = styled(Col)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: relative;
  border: 1px solid #f0f0f0;
  border-left: none;
  border-bottom: none;
  :last-child {
    border-right: none;
  }
  p {
    margin-bottom: 0;
  }
  b {
    color: #7356f1;
    font-size: 24px;
  }
`;

const Title = styled.h2`
  color: #7356f1;
`;

const SubTitle = styled.h3`
  margin: 1em 0;
`;

const StepsRow = styled(Row)`
  overflow-x: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
  .ant-steps-item-title {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 6em;
  }
`;

export async function getServerSideProps(context) {
  const { id } = context.params;

  return {
    props: { id },
  };
}

export default function Page(props: { id: number }) {
  const [courseData, setCourseData] = useState<CourseDetail>();
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  );
  const router = useRouter();

  const getChapterExtra = (source: Schedule, index: number) => {
    const activeIndex = source.chapters.findIndex(
      (item) => item.id === source.current
    );
    const status = index === activeIndex ? 1 : index < activeIndex ? 0 : 2;

    return (
      <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>
    );
  };

  useEffect(() => {
    (async () => {
      const id = +router.query.id || props.id;
      const { data } = await apiService.getCourseById(id);

      if (data) {
        setCourseData(data);
        const sales = data.sales;
        const itemInfo = [
          { label: "Price", value: sales.price },
          { label: "Batches", value: sales.batches },
          { label: "Students", value: sales.studentAmount },
          { label: "Earings", value: sales.earnings },
        ];
        setInfo(itemInfo);
        setActiveChapterIndex(
          data.schedule.chapters.findIndex(
            (item) => item.id === data.schedule.current
          )
        );
      }
    })();
  }, [props.id, router.query.id]);

  return (
    <MainLayout>
      <Row gutter={gutter}>
        <Col span={8}>
          <CourseOverview
            {...courseData}
            cardProps={{ bodyStyle: { paddingBottom: 0 } }}
          >
            <RowWrapper gutter={gutter} justify="space-between" align="middle">
              {info.map((item, index) => (
                <ColWrapper key={index} span={6}>
                  <b>{item.value}</b>
                  <p>{item.label}</p>
                </ColWrapper>
              ))}
            </RowWrapper>
          </CourseOverview>
        </Col>
        <Col offset={1} span={15}>
          <Card>
            <Title>Course Detail</Title>

            <SubTitle>Create Time</SubTitle>
            <Row>{courseData?.ctime}</Row>

            <SubTitle>Start Time</SubTitle>
            <Row>{courseData?.startTime}</Row>

            <Badge
              status={CourseStatusBadge[courseData?.status] as any}
              offset={[5, 24]}
            >
              <SubTitle>Status</SubTitle>
            </Badge>
            <StepsRow>
              <Steps
                size="small"
                current={activeChapterIndex}
                style={{ width: "auto" }}
              >
                {courseData?.schedule?.chapters.map((item) => (
                  <Steps.Step title={item.name} key={item.id} />
                ))}
              </Steps>
            </StepsRow>

            <SubTitle>Course Code</SubTitle>
            <Row>{courseData?.uid}</Row>

            <SubTitle>Class Time</SubTitle>
            <ClassTime data={courseData?.schedule?.classTime} />

            <SubTitle>Category</SubTitle>
            <Row>
              {courseData?.type?.map((item, index) => (
                <Tag
                  key={index}
                  color="geekblue"
                  style={{ padding: "5px 10px" }}
                >
                  {item.name}
                </Tag>
              ))}
            </Row>

            <SubTitle>Description</SubTitle>
            {courseData?.detail !== "no" ? (
              <Row>{courseData?.detail}</Row>
            ) : (
              <Row>
                An open source programming language created by Google. As one of
                the fastest growing languages in terms of popularity, its a
                great time to pick up the basics of it
              </Row>
            )}

            <SubTitle>Chapter</SubTitle>
            {courseData?.schedule && (
              <Collapse
                bordered={false}
                defaultActiveKey={courseData.schedule.current}
              >
                {courseData.schedule.chapters.map((item, index) => (
                  <Collapse.Panel
                    header={item.name}
                    key={item.id}
                    extra={getChapterExtra(courseData.schedule, index)}
                  >
                    {item.content}
                  </Collapse.Panel>
                ))}
              </Collapse>
            )}
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}
