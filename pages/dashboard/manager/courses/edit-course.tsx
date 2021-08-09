import MainLayout from "../../../../components/layout/layout";
import { Col, Input, Row, Select, Spin, Tabs } from "antd";
import React, { useCallback, useState } from "react";
import AddCourse from "../../../../components/course/addCourse";

import { Course } from "../../../../shared/types/course";
import CourseSchedule from "../../../../components/course/schedule";
import storage from "../../../../shared/storage";
import { gutter } from "../../../../shared/constants/config";
import { debounce } from "lodash";
import apiService from "../../../../shared/api/apiServices";

const { TabPane } = Tabs;
const { Option } = Select;
export default function Page() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchBy, setSearchBy] = useState<"uid" | "name" | "type">("uid");
  const [searchResult, setSearchResult] = useState<Course[]>([]);
  const [course, setCourse] = useState<Course>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const search = useCallback(
    debounce((value: string, cb?: (courses?: Course[]) => void) => {
      if (!value) {
        return;
      }

      setIsSearching(true);

      apiService
        .getCourses({ [searchBy]: value, userId: storage.userId })
        .then((res) => {
          const { data } = res;

          if (!!data) {
            setSearchResult(data.courses);
            if (!!cb) {
              cb(data.courses);
            }
          }
        })
        .finally(() => setIsSearching(false));
    }, 1000),
    [searchBy]
  );

  return (
    <MainLayout>
      <Row gutter={gutter}>
        <Col span={12} style={{ marginLeft: "1.6%" }}>
          <Input.Group compact size="large" style={{ display: "flex" }}>
            <Select defaultValue="uid" onChange={(value) => setSearchBy(value)}>
              <Option value="uid">Code</Option>
              <Option value="name">Name</Option>
              <Option value="type">Category</Option>
            </Select>
            <Select
              placeholder={`Search course by ${searchBy}`}
              notFoundContent={isSearching ? <Spin size="small" /> : null}
              filterOption={false}
              showSearch
              onSearch={(value) => search(value)}
              style={{ flex: 1 }}
              onSelect={(id) => {
                const course = searchResult.find((item) => item.id === id);

                setCourse(course);
              }}
            >
              {searchResult.map(({ id, name, teacherName, uid }) => (
                <Select.Option key={id} value={id}>
                  {name} - {teacherName} - {uid}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar
            {...props}
            style={{ marginLeft: "1.6%", marginTop: 10 }}
          />
        )}
        type="card"
        size="large"
        animated
      >
        <TabPane tab="Course Detail" key="course">
          <AddCourse course={course} />
        </TabPane>
        <TabPane tab="Course Schedule" key="schedule">
          <CourseSchedule
            courseId={course?.id}
            scheduleId={course?.scheduleId}
            isAdd={false}
          />
        </TabPane>
      </Tabs>
    </MainLayout>
  );
}
