import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  TimePicker,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";
import { FormListFieldData } from "antd/lib/form/FormList";
import moment from "moment";
import React, { useState } from "react";
import apiService from "../../shared/api/apiServices";
import { weekDays } from "../../shared/constants/course";
import { UpdateScheduleRequest } from "../../shared/types/course";

interface CourseScheduleProps {
  courseId: number;
  scheduleId: number;
  onSuccess: (res: boolean) => void;
}

const { Option } = Select;

type ChapterFormValue = {
  chapters: {
    name: string;
    content: string;
  }[];
  classTime: {
    weekday: string;
    time: Date;
  }[];
};

export default function CourseSchedule({
  courseId,
  scheduleId,
  onSuccess,
}: CourseScheduleProps) {
  const [form] = useForm();
  const [selectedWeekdays, setSelectedWeekdays] = useState([]);

  const setSelectedDays = (name?: (string | number)[]) => {
    const selected: { weekday: string; time: string }[] = form.getFieldValue(
      "classTime" || []
    );
    let result = selected.map((item) => item?.weekday);

    if (name) {
      const value = form.getFieldValue(name);

      result = result.filter((item) => item !== value);
    }

    setSelectedWeekdays(result);
  };

  const onFinish = async (values: ChapterFormValue) => {
    if (!courseId && !scheduleId) {
      message.error("You must select a course to update!");
      return;
    }

    const { classTime: origin, chapters } = values;
    const classTime = origin.map(
      ({ weekday, time }) => `${weekday} ${moment(time).format("hh:mm:ss")}`
    );

    const params: UpdateScheduleRequest = {
      chapters: chapters.map((item, index) => ({ ...item, order: index + 1 })),
      classTime,
      scheduleId,
      courseId,
    };

    const response = await apiService.updateSchedule(params);
    const { data } = response;

    if (!!onSuccess && data) {
      onSuccess(true);
    }
  };
  const initialValues = {
    chapters: [{ name: "", content: "" }],
    classTime: [{ weekday: "", time: "" }],
  };

  return (
    <>
      <Form
        labelCol={{ offset: 1 }}
        wrapperCol={{ offset: 1 }}
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Row gutter={[6, 16]}>
          <Col span={12}>
            <h2>Chapters</h2>
            <Form.List name="chapters">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={20}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "name"]}
                          fieldKey={[field.fieldKey, "name"]}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" placeholder="Chapter Name" />
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, "content"]}
                          fieldKey={[field.fieldKey, "content"]}
                          rules={[{ required: true }]}
                        >
                          <Input size="large" placeholder="Chapter content" />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <FormItem>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (fields.length > 1) {
                                remove(field.name);
                              } else {
                                message.warn(
                                  "You must set at least one chapter."
                                );
                              }
                            }}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          size="large"
                          onClick={() => add()}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Chapter
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>
          <Col span={12}>
            <Row>
              <h2>Class Times</h2>
            </Row>
            <Form.List name="classTime">
              {(fields: FormListFieldData[], { add, remove }) => (
                <>
                  {fields.map((field) => (
                    <Row key={field.key} gutter={20}>
                      <Col span={8}>
                        <Form.Item
                          {...field}
                          name={[field.name, "weekday"]}
                          fieldKey={[field.fieldKey, "weekday"]}
                          rules={[{ required: true }]}
                        >
                          <Select
                            size="large"
                            onChange={(value: string) =>
                              setSelectedWeekdays([...selectedWeekdays, value])
                            }
                          >
                            {weekDays.map((day) => (
                              <Option
                                key={day}
                                value={day}
                                disabled={selectedWeekdays.includes(day)}
                              >
                                {day}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col span={12}>
                        <Form.Item
                          {...field}
                          name={[field.name, "time"]}
                          fieldKey={[field.fieldKey, "time"]}
                          rules={[{ required: true }]}
                        >
                          <TimePicker size="large" style={{ width: "100%" }} />
                        </Form.Item>
                      </Col>

                      <Col span={2}>
                        <FormItem>
                          <MinusCircleOutlined
                            onClick={() => {
                              if (fields.length > 1) {
                                setSelectedDays([
                                  "classTime",
                                  field.name,
                                  "weekday",
                                ]);
                                remove(field.name);
                              } else {
                                message.warn(
                                  "You must set at least one class time."
                                );
                              }
                            }}
                          />
                        </FormItem>
                      </Col>
                    </Row>
                  ))}

                  <Row>
                    <Col span={20}>
                      <Form.Item>
                        <Button
                          type="dashed"
                          size="large"
                          disabled={fields.length >= 7}
                          onClick={() => {
                            setSelectedDays();
                            add();
                          }}
                          block
                          icon={<PlusOutlined />}
                        >
                          Add Class Time
                        </Button>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form.List>
          </Col>
        </Row>
        <Row gutter={[16, 6]} style={{ marginTop: 20 }}>
          <Form.Item wrapperCol={{ span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </>
  );
}
