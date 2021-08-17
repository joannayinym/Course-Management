import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layout/layout";
import LineChart from "../../../components/statistics/lineChart";
import Overview from "../../../components/statistics/overview";
import apiService from "../../../shared/api/apiServices";
import {
  CourseStatistics,
  Statistic,
  StatisticsOverviewResponse,
  StudentStatistics,
  TeacherStatistics,
} from "../../../shared/types/statistics";
import { Role } from "../../../shared/types/user";

export default function Page() {
  const [overview, setOverview] = useState<StatisticsOverviewResponse>(null);
  const [studentStatistics, setStudentStatistics] =
    useState<StudentStatistics>(null);
  const [teacherStatistics, setTeacherStatistics] =
    useState<TeacherStatistics>(null);
  const [courseStatistics, setCourseStatistics] =
    useState<CourseStatistics>(null);

  useEffect(() => {
    apiService.getStatisticsOverview().then((res) => {
      const { data } = res;

      setOverview(data);
    });

    apiService.getStatistics<StudentStatistics>(Role.student).then((res) => {
      const { data } = res;

      setStudentStatistics(data);
    });

    apiService.getStatistics<TeacherStatistics>(Role.teacher).then((res) => {
      const { data } = res;

      setTeacherStatistics(data);
    });

    apiService.getStatistics<CourseStatistics>("course").then((res) => {
      const { data } = res;

      setCourseStatistics(data);
    });
  }, []);
  return (
    <MainLayout>
      {overview && (
        <Row align="middle" gutter={[24, 16]}>
          <Col span={8}>
            <Overview
              data={overview}
              type="student"
              style={{ background: "#1890ff" }}
              icon={<SolutionOutlined />}
            />
          </Col>
          <Col span={8}>
            <Overview
              data={overview}
              type="teacher"
              style={{ background: "#673bb7" }}
              icon={<ReadOutlined />}
            />
          </Col>
          <Col span={8}>
            <Overview
              data={overview}
              type="course"
              style={{ background: "#ffaa16" }}
              icon={<SolutionOutlined />}
            />
          </Col>
        </Row>
      )}
      <Row>
        <LineChart
          data={{
            [Role.student]: studentStatistics?.ctime,
            [Role.teacher]: teacherStatistics?.ctime,
            course: courseStatistics?.ctime,
          }}
        />
      </Row>
    </MainLayout>
  );
}
