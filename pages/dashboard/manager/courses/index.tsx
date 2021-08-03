import { Button, List, Spin } from "antd";
import Link from "next/link";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import styled from "styled-components";
import BackTop from "../../../../components/common/backTop";
import CourseOverview from "../../../../components/course/overview";
import MainLayout from "../../../../components/layout/layout";
import apiService from "../../../../shared/api/apiServices";
import storage from "../../../../shared/storage";
import {
  Course,
  CourseRequest,
  CourseResponse,
} from "../../../../shared/types/course";
import { useListEffect } from "../../../../shared/utils/listHook";

export const Indicator = styled.div`
  position: relative;
  left: 50%;
  margin-top: 10px;
  transform: translateX(50%);
`;

export function ScrollPage() {
  const { paginator, setPaginator, hasMore, data } = useListEffect<
    CourseRequest,
    CourseResponse,
    Course
  >(apiService.getCourses.bind(apiService), "courses", false);

  return (
    <>
      <InfiniteScroll
        next={() => setPaginator({ ...paginator, page: paginator.page + 1 })}
        hasMore={hasMore}
        loader={
          <Indicator>
            <Spin size="large" />
          </Indicator>
        }
        dataLength={data.length}
        endMessage={<Indicator>No More Course!</Indicator>}
        scrollableTarget="contentLayout"
        style={{ overflow: "hidden" }}
      >
        <List
          id="container"
          grid={{
            gutter: 14,
            xs: 1,
            sm: 2,
            md: 2,
            lg: 4,
            xl: 4,
            xxl: 4,
          }}
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <CourseOverview {...item}>
                <Link
                  href={`/dashboard/${storage.role}/courses/${item.id}`}
                  passHref
                >
                  <Button type="primary">Read More</Button>
                </Link>
              </CourseOverview>
            </List.Item>
          )}
        />
      </InfiniteScroll>
      <BackTop />
    </>
  );
}

export default function Page() {
  return (
    <MainLayout>
      <ScrollPage />
    </MainLayout>
  );
}
