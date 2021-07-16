import { Button, Form, Input, Select } from "antd";
import React from "react";
import styled from "styled-components";
import apiService from "../../shared/api/apiServices";
import { businessAreas } from "../../shared/constants/role";
import { AddStudentRequest, Student } from "../../shared/types/student";

const ModalFormSubmit = styled(Form.Item)`
  position: absolute;
  bottom: 0;
  right: 8em;
  margin-bottom: 10px;
`;

const { Option } = Select;

interface IProps {
  actionType: string;
  student: Student | null;
  onSubmit: (value: Student) => void;
}

export default function AddAndEditStudent(props: IProps) {
  const [form] = Form.useForm();
  const { actionType, student, onSubmit } = props;
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const onFinish = (values: AddStudentRequest) => {
    const response =
      actionType === "Add"
        ? apiService.addStudent(values)
        : apiService.updateStudent({ ...values, id: student!.id });

    response.then((response) => {
      const { data } = response;

      if (onSubmit && data) {
        onSubmit(data);
      }
    });
  };

  return (
    <>
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        initialValues={{
          name: student?.name,
          email: student?.email,
          country: student?.country,
          typeId: student?.type?.id,
        }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: "email", validateTrigger: "onBlur" },
            { required: true },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Area" rules={[{ required: true }]}>
          <Select placeholder="Select a Country">
            {businessAreas.map((item, index) => (
              <Select.Option value={item} key={index}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="typeId"
          label="Student Type"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select the Type">
            <Option value={1}>tester</Option>
            <Option value={2}>developer</Option>
          </Select>
        </Form.Item>
        <ModalFormSubmit>
          <Button type="primary" htmlType="submit">
            {actionType === "Edit" ? "Update" : "Add"}
          </Button>
        </ModalFormSubmit>
      </Form>
    </>
  );
}
