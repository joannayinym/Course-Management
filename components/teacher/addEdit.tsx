import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, message, Row, Select, Slider } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { FormListFieldData } from "antd/lib/form/FormList";
import React from "react";
import styled from "styled-components";
import apiService from "../../shared/api/apiServices";
import { SkillLevels } from "../../shared/constants/config";
import { Country } from "../../shared/types/others";
import { AddTeacherRequest, Teacher } from "../../shared/types/teacher";

const ModalFormSubmit = styled(Form.Item)`
  position: absolute;
  bottom: 0;
  right: 8em;
  margin-bottom: 10px;
`;

const { Option } = Select;

interface AddEditTeacherProps {
  actionType: string;
  teacher: Teacher | null;
  countries: Country[];
  onSubmit: (value: Teacher) => void;
}

export default function AddEditTeacher(props: AddEditTeacherProps) {
  const [form] = Form.useForm();
  const { actionType, teacher, countries, onSubmit } = props;
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { offset: 1 },
  };
  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }} defaultValue="86">
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  const onFinish = (values: AddTeacherRequest) => {
    const response =
      actionType === "Add"
        ? apiService.addTeacher(values)
        : apiService.updateTeacher({ ...values, id: teacher!.id });

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
          name: teacher?.name,
          email: teacher?.email,
          country: teacher?.country,
          phone: teacher?.phone,
          skills: teacher?.skills || [{ name: "", level: 2 }],
        }}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          validateFirst
          rules={[
            { type: "email", validateTrigger: "onBlur" },
            { required: true },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="country" label="Area" rules={[{ required: true }]}>
          <Select placeholder="Select a Country">
            {countries?.map((item) => (
              <Select.Option value={item.en} key={item.en}>
                {item.en}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[
            { required: true, message: "Please input your phone number!" },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label={<b>Skills</b>}> </Form.Item>

        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Row key={field.key} align="middle" justify="space-between">
                  <Col span={7}>
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      fieldKey={[field.fieldKey, "name"]}
                      rules={[{ required: true }]}
                    >
                      <Input
                        placeholder="Skill Name"
                        style={{ width: "100%", textAlign: "right" }}
                      />
                    </Form.Item>
                  </Col>

                  <Col span={13}>
                    <Form.Item
                      {...field}
                      name={[field.name, "level"]}
                      fieldKey={[field.fieldKey, "level"]}
                      rules={[{ required: true }]}
                    >
                      <Slider
                        step={1}
                        min={1}
                        max={5}
                        tipFormatter={(value: number) => SkillLevels[value]}
                        style={{ width: "100%" }}
                      />
                    </Form.Item>
                  </Col>

                  <Col style={{ alignSelf: "stretch" }}>
                    <FormItem>
                      <MinusCircleOutlined
                        onClick={() => {
                          if (fields.length > 1) {
                            remove(field.name);
                          } else {
                            message.warn("You must set at least one skill.");
                          }
                        }}
                      />
                    </FormItem>
                  </Col>
                </Row>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Skill
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <ModalFormSubmit>
          <Button type="primary" htmlType="submit">
            {actionType === "Edit" ? "Update" : "Add"}
          </Button>
        </ModalFormSubmit>
      </Form>
    </>
  );
}
