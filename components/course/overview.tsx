import { HeartFilled, UserOutlined } from "@ant-design/icons";
import { Card, CardProps, Col, Row } from "antd";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { DurationUnit } from "../../shared/constants/duration";
import { Course } from "../../shared/types/course";

const RowWrapper = styled(Row)`
  position: relative;
  min-height: 35px;
  :after {
    content: "";
    position: absolute;
    bottom: 0;
    background: #f0f0f0;
    width: 100%;
    height: 1px;
  }
`;
const ColWrapper = styled(Col)`
  display: flex;
  align-items: center;
`;

const getDuration = (data: Course): string => {
  const { duration, durationUnit } = data;
  const text = `${duration} ${DurationUnit[durationUnit]}`;

  return duration > 1 ? text + "s" : text;
};

export default function CourseOverview(
  props: React.PropsWithChildren<Course> & { cardProps?: CardProps }
) {
  return (
    <Card
      // eslint-disable-next-line @next/next/no-img-element
      cover={<img src={props.cover} alt="course" style={{ height: 260 }} />}
      {...props.cardProps}
    >
      <Row style={{ height: 35 }}>
        <h3>{props.name}</h3>
      </Row>

      <RowWrapper justify="space-between">
        <Col>{props.startTime}</Col>
        <ColWrapper>
          <HeartFilled style={{ marginRight: 5, fontSize: 16, color: "red" }} />
          <b>{props.star}</b>
        </ColWrapper>
      </RowWrapper>

      <RowWrapper justify="space-between">
        <Col>Duration:</Col>
        <Col>
          <b>{getDuration(props)}</b>
        </Col>
      </RowWrapper>

      <RowWrapper justify="space-between">
        <Col>Teacher:</Col>
        <Col style={{ fontWeight: "bold" }}>
          {props?.teacherName && (
            <Link href="/dashboard/manager">{props.teacherName}</Link>
          )}
        </Col>
      </RowWrapper>

      <Row justify="space-between" style={{ height: 35 }}>
        <Col>
          <UserOutlined
            style={{ marginRight: 5, fontSize: 16, color: "#1890ff" }}
          />
          <span>Student Limit:</span>
        </Col>
        <Col>
          <b>{props.maxStudents}</b>
        </Col>
      </Row>

      {props.children}
    </Card>
  );
}
