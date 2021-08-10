import MainLayout from "../../../../components/layout/layout";
import { Button, Result, Steps } from "antd";
import React, { useState } from "react";
import AddCourse from "../../../../components/course/addCourse";
import styled from "styled-components";
import { Course } from "../../../../shared/types/course";
import CourseSchedule from "../../../../components/course/schedule";
import { useRouter } from "next/router";
import storage from "../../../../shared/storage";

const ContentWrapper = styled.div`
  margin-top: 20px;
`;

const { Step } = Steps;

export default function Page() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [maxStep, setMaxStep] = useState<number>(0);
  // const [courseId, setCourseId] = useState(null);
  // const [scheduleId, setScheduleId] = useState(null);
  const [success, setSuccess] = useState(false);
  const [course, setCourse] = useState<Course>(undefined);
  const router = useRouter();
  const onStepChange = (current: number) => {
    if (maxStep >= current) {
      setCurrentStep(current);
    }
  };
  const moveToNext = () => {
    if (maxStep < currentStep + 1) {
      setMaxStep(currentStep + 1);
    }
    setCurrentStep(currentStep + 1);
  };
  const steps = [
    {
      title: "Course Detail",
    },
    {
      title: "Course Schedule",
    },
    {
      title: "Success",
    },
  ];

  return (
    <MainLayout>
      <Steps type="navigation" current={currentStep} onChange={onStepChange}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <ContentWrapper>
        {currentStep === 0 ? (
          <AddCourse
            onSuccess={(course: Course) => {
              // setCourseId(course.id);
              // setScheduleId(course.scheduleId);
              setCourse(course);
              moveToNext();
            }}
            course={course}
          />
        ) : currentStep === 1 ? (
          <CourseSchedule
            courseId={course.id}
            scheduleId={course.scheduleId}
            onSuccess={(res: boolean) => {
              setSuccess(true);
              moveToNext();
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
                      `/dashboard/${storage.role}/courses/${course.id}`
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
