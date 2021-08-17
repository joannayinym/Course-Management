import { Card, Col, Progress, Row } from "antd";
import React from "react";
import styled from "styled-components";
import { StatisticsOverviewResponse } from "../../shared/types/statistics";

export const OverviewIconCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  .anticon {
    background: #fff;
    padding: 25px;
    border-radius: 50%;
    color: #999;
  }
  @media only screen and (min-width: 601px) and (max-width: 900px) {
    font-size: 24px;
    padding: 0;
    .anticon {
      background: #fff;
      padding: 0px;
      border-radius: 50%;
      color: #999;
    }
  }
  @media only screen and (min-width: 901px) and (max-width: 1400px) {
    font-size: 28px;
    padding: 0;
    .anticon {
      background: #fff;
      padding: 10px;
      border-radius: 50%;
      color: #999;
    }
  }
`;

export const OverviewCol = styled(Col)`
  color: #fff;
  h3 {
    color: #fff;
  }
  h2 {
    color: #fff;
    font-size: 32px;
    margin-bottom: 0;
  }
`;

interface OverviewProps {
  type: string;
  data: StatisticsOverviewResponse;
  style?: React.CSSProperties;
  icon: JSX.Element;
}
export default function Overview({ data, type, icon, style }: OverviewProps) {
  if (!(data && type && data[type])) {
    return null;
  }
  const percentage: number =
    data[type].total > 0
      ? (data[type].lastMonthAdded / data[type].total) * 100
      : 0;

  return (
    <Card
      style={{ borderRadius: 5, cursor: "pointer", ...style, color: "white" }}
    >
      <Row>
        <OverviewIconCol span={6}>{icon}</OverviewIconCol>
        <OverviewCol span={18}>
          <h3>{`TOTAL ${type?.toUpperCase() || ""}`}</h3>
          <h2>{data[type].total}</h2>
          <Progress
            percent={100 - percentage}
            size="small"
            showInfo={false}
            strokeColor="white"
            trailColor="lightgreen"
          />
          <h3>{`${
            percentage > 0 ? percentage.toFixed(1) : 0
          }% Increase in 30 Days `}</h3>
        </OverviewCol>
      </Row>
    </Card>
  );
}
