import MainLayout from "../../../../components/layout/layout";
import { Button, Result, Steps } from "antd";
import React, { useState } from "react";
import AddCourse from "../../../../components/course/addCourse";
import styled from "styled-components";
import { Course } from "../../../../shared/types/course";
import CourseSchedule from "../../../../components/course/schedule";
import router from "next/router";
import storage from "../../../../shared/storage";

const ContentWrapper = styled.div`
  margin-top: 20px;
`;

const { Step } = Steps;
const steps = [
  {
    title: "Course Detail",
    content: "First-content",
  },
  {
    title: "Course Schedule",
    content: "Second-content",
  },
  {
    title: "Success",
    content: "Last-content",
  },
];

export default function Page() {
  const [current, setCurrent] = useState(0);
  const [courseId, setCourseId] = useState(null);
  const [scheduleId, setScheduleId] = useState(null);
  const [success, setSuccess] = useState(false);

  return (
    <MainLayout>
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <ContentWrapper>
        {current === 0 ? (
          <AddCourse
            onSuccess={(course: Course) => {
              setCourseId(course.id);
              setScheduleId(course.scheduleId);
              setCurrent(current + 1);
            }}
          />
        ) : current === 1 ? (
          <CourseSchedule
            courseId={courseId}
            scheduleId={scheduleId}
            onSuccess={(res: boolean) => {
              setSuccess(true);
              setCurrent(current + 1);
            }}
          />
        ) : (
          success && (
            <Result
              status="success"
              title="Successfully Create Course!"
              extra={[
                <Button
                  type="primary"
                  key="detail"
                  onClick={() =>
                    router.push(
                      `/dashboard/${storage.role}/courses/${courseId}`
                    )
                  }
                >
                  Go Course
                </Button>,
                <Button
                  key="buy"
                  onClick={() => {
                    router.reload();
                  }}
                >
                  Create Again
                </Button>,
              ]}
            />
          )
        )}
      </ContentWrapper>
    </MainLayout>
  );
}
