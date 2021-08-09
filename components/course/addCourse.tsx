import React, { useEffect, useState } from "react";
import ImgCrop from "antd-img-crop";
import TextArea from "antd/lib/input/TextArea";
import { UploadFile } from "antd/lib/upload/interface";
import { InboxOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  Upload,
  InputNumber,
} from "antd";
import { useForm } from "antd/lib/form/Form";
import moment, { Moment } from "moment";
import { DurationUnitType } from "../../shared/constants/course";
import {
  AddCourseRequest,
  Course,
  CourseType,
} from "../../shared/types/course";
import { Teacher } from "../../shared/types/teacher";
import apiService from "../../shared/api/apiServices";
import storage from "../../shared/storage";
import { Role } from "../../shared/types/user";
import { Paginator } from "../../shared/types/type";
import styled from "styled-components";
import { gutter } from "../../shared/constants/config";

const DescriptionWrapper = styled(Form.Item)`
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-form-item-control-input,
  .ant-form-item-control-input-content,
  text-area {
    height: 100%;
  }
`;

const ImageUploadWrapper = styled(Form.Item)`
  .ant-upload.ant-upload-select-picture-card {
    width: 100%;
    margin: 0;
  }
  .ant-form-item-control {
    position: absolute;
    inset: 0;
    top: 37px;
    bottom: 30px;
  }
  .ant-upload-picture-card-wrapper,
  .ant-form-item-control-input,
  .ant-form-item-control-input div {
    height: 100%;
  }
  .ant-upload-picture-card-wrapper img {
    object-fit: cover !important;
  }
  .ant-upload-list-item-progress,
  .ant-tooltip {
    height: auto !important;
    .ant-tooltip-arrow {
      height: 13px;
    }
  }
  .ant-upload-list-picture-card-container {
    width: 100%;
  }
  .ant-upload-list-item-actions {
    .anticon-delete {
      color: red;
    }
  }
`;

const { Option } = Select;

export default function AddCourse({
  course,
  onSuccess,
}: {
  course?: Course;
  onSuccess?: (course: Course) => void;
}) {
  const [form] = useForm();
  const [isAdd, setIsAdd] = useState(course === undefined);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [courseType, setCourseType] = useState<CourseType[]>([]);
  const [fileList, setFileList] = useState<UploadFile<any>[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ limit: 50, page: 1 });
  const role = storage.role;

  const onFinish = async (values: AddCourseRequest) => {
    const params: AddCourseRequest = {
      ...values,
      duration: +values.duration,
      startTime:
        values.startTime && moment(values.startTime).format("YYYY-MM-DD"),
    };

    const response = isAdd
      ? apiService.addCourse(params)
      : apiService.updateCourse({ ...params, id: course.id });

    const { data } = await response;

    if (!!data && !course) {
      setIsAdd(false);
    }
    if (!!data && !!onSuccess) {
      onSuccess(data);
    }
  };

  const onImageChange = ({ fileList: newFileList, file }) => {
    if (file?.response) {
      const { url } = file.response;

      form.setFieldsValue({ cover: url });
    }
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  useEffect(() => {
    if (isAdd) {
      apiService.getCourseCode().then((res) => {
        const { data: uid } = res;

        form.setFieldsValue({ uid });
      });
    }

    if (role === Role.teacher) {
      apiService.getTeacherById(storage.userId).then((res) => {
        const { data } = res;

        if (!!data) {
          setTeachers([data]);
        }
      });
    } else if (role === Role.manager) {
      apiService.getTeachers(paginator).then((res) => {
        const { data } = res;

        if (!!data) {
          setTeachers(data.teachers);
        }
      });
    }

    apiService.getCourseTypes().then((res) => {
      const { data } = res;

      if (!!data) {
        setCourseType(data);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!course) {
      const values = {
        ...course,
        type: course.type.map((item) => item.id),
        teacherId: course.teacherName,
        startTime: moment(course.startTime),
        duration: course.duration,
        durationUnit: course.durationUnit,
      };

      form.setFieldsValue(values);

      setFileList([
        { name: "Cover Image", url: course.cover, uid: course.uid },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  return (
    <Form
      labelCol={{ offset: 1 }}
      wrapperCol={{ offset: 1 }}
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Row gutter={gutter}>
        <Col span={8}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[
              { required: true, message: "Please input your course name!" },
              {
                min: 3,
                max: 100,
                message: "'name' must be between 3 and 100 characters",
                validateTrigger: "onBlur",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>

        <Col span={16}>
          <Row gutter={gutter}>
            <Col span={8}>
              <Form.Item
                label="Teacher"
                name="teacherId"
                rules={[
                  { required: true, message: "Please select teacher name!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select teacher"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {teachers &&
                    teachers.map((item, index) => (
                      <Option key={index} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Type"
                name="type"
                rules={[
                  { required: true, message: "Please input course type!" },
                ]}
              >
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="select types"
                >
                  {courseType.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                label="Course code"
                name="uid"
                rules={[{ required: true }]}
              >
                <Input value="" disabled />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row gutter={gutter}>
        <Col span={8}>
          <Form.Item label="Start Date" name="startTime">
            <DatePicker
              style={{ width: "100%" }}
              disabledDate={(currentDate: Moment) =>
                currentDate < moment(new Date())
              }
            />
          </Form.Item>
          <Form.Item label="Price" name="price" rules={[{ required: true }]}>
            <InputNumber<number>
              formatter={(value) =>
                `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => +value.replace(/\$\s?|(,*)/g, "")}
              min={0}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            label="Student Limit"
            name="maxStudents"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label="Duration">
            <Input.Group compact>
              <Form.Item noStyle name={"duration"} rules={[{ required: true }]}>
                <InputNumber min={0} style={{ width: "80%" }} />
              </Form.Item>
              <Form.Item noStyle name={"durationUnit"}>
                <Select defaultValue={1} style={{ width: "20%" }}>
                  {DurationUnitType.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Input.Group>
          </Form.Item>
        </Col>
        <Col span={8}>
          <DescriptionWrapper
            label="Description"
            name="detail"
            rules={[
              { required: true },
              {
                min: 100,
                max: 1000,
                message:
                  "Description length must between 100 - 1000 characters.",
                validateTrigger: "onBlur",
              },
            ]}
          >
            <TextArea
              placeholder="Course description"
              style={{ height: "100%" }}
            />
          </DescriptionWrapper>
        </Col>
        <Col span={8}>
          <ImageUploadWrapper label="Cover" name="cover">
            <ImgCrop rotate aspect={16 / 9}>
              <Upload
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                listType="picture-card"
                fileList={fileList}
                onChange={onImageChange}
                onPreview={onPreview}
              >
                {fileList.length >= 1 ? null : (
                  <>
                    <InboxOutlined />
                    <p>Click or drag file to this area to upload</p>
                  </>
                )}
              </Upload>
            </ImgCrop>
          </ImageUploadWrapper>
        </Col>
      </Row>

      <Row gutter={gutter}>
        <Col span={8}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isAdd ? "Create Course" : "Update Course"}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
}
