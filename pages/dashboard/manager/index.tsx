import { ReadOutlined, SolutionOutlined } from "@ant-design/icons";
import { Card, Col, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import MainLayout from "../../../components/layout/layout";
import LineChart from "../../../components/statistics/lineChart";
import Overview from "../../../components/statistics/overview";
import apiService from "../../../shared/api/apiServices";
import {
  CourseClassTimeStatistic,
  CourseStatistics,
  StatisticsOverviewResponse,
  StudentStatistics,
  TeacherStatistics,
} from "../../../shared/types/statistics";
import { Role } from "../../../shared/types/user";
import { gutter } from "../../../shared/constants/config";
import PieChart from "../../../components/statistics/pieChart";
import BarChart from "../../../components/statistics/barChart";
import HeatMap from "../../../components/statistics/heatMap";

const DistributionWithNoSSR = dynamic(
  () => import("../../../components/statistics/mapChart"),
  {
    ssr: false,
  }
);

export default function Page() {
  const [overview, setOverview] = useState<StatisticsOverviewResponse>(null);
  const [studentStatistics, setStudentStatistics] =
    useState<StudentStatistics>(null);
  const [teacherStatistics, setTeacherStatistics] =
    useState<TeacherStatistics>(null);
  const [courseStatistics, setCourseStatistics] =
    useState<CourseStatistics>(null);
  const [selectedType, setSelectedType] = useState<string>("studentType");

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

      <Row gutter={gutter}>
        <Col span={12}>
          <DistributionWithNoSSR
            data={{
              [Role.student]: studentStatistics?.country,
              [Role.teacher]: teacherStatistics?.country,
            }}
          />
        </Col>
        <Col span={12}>
          <Card
            title="Types"
            extra={
              <Select
                defaultValue={selectedType}
                bordered={false}
                onSelect={setSelectedType}
                style={{ width: 130 }}
              >
                <Select.Option value="studentType">Student Type</Select.Option>
                <Select.Option value="courseType">Course Type</Select.Option>
                <Select.Option value="gender">Gender</Select.Option>
              </Select>
            }
          >
            {selectedType === "studentType" ? (
              <PieChart data={studentStatistics?.type} title={selectedType} />
            ) : selectedType === "courseType" ? (
              <PieChart data={courseStatistics?.type} title={selectedType} />
            ) : (
              <Row gutter={16}>
                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview.student.gender).map(
                      ([name, amount]) => ({
                        name,
                        amount,
                      })
                    )}
                    title="student gender"
                  />
                </Col>

                <Col span={12}>
                  <PieChart
                    data={Object.entries(overview.teacher.gender).map(
                      ([name, amount]) => ({
                        name,
                        amount,
                      })
                    )}
                    title="teacher gender"
                  />
                </Col>
              </Row>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={gutter}>
        <Col span={12}>
          <Card title="Increment">
            <LineChart
              data={{
                [Role.student]: studentStatistics?.ctime,
                [Role.teacher]: teacherStatistics?.ctime,
                course: courseStatistics?.ctime,
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Languages">
            <BarChart
              data={{
                interest: studentStatistics?.interest,
                teacher: teacherStatistics?.skills,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={gutter}>
        <Col span={24}>
          <Card title="Course Schedule">
            <HeatMap
              data={courseStatistics?.classTime}
              title="Course schedule per weekday"
            />
          </Card>
        </Col>
      </Row>
    </MainLayout>
  );
}
