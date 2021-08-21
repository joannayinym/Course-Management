import { Card, Select } from "antd";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import React, { useEffect, useState } from "react";
import apiService from "../../shared/api/apiServices";
import { Statistic } from "../../shared/types/statistics";

export interface ChartProps {
  data: {
    [key: string]: Statistic[];
  };
}

export default function MapChart({ data }: ChartProps) {
  const [option, setOption] = useState<string>("student");
  const [world, setWorld] = useState<any>(null);
  const [chartOptions, setChartOptions] = useState<any>({
    colorAxis: {
      min: 0,
      stops: [
        [0, "#fff"],
        [0.5, Highcharts.getOptions().colors[0]],
        [1, "#1890ff"],
      ],
    },
    legend: {
      layout: "vertical",
      align: "left",
      verticalAlign: "bottom",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    (async () => {
      const response = await apiService.getWorld();

      setWorld(response.data);
      setChartOptions({
        series: [{ mapData: response.data }],
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data || !world) {
      return;
    }

    const mapSource = data[option]?.map((item) => {
      const target = world.features.find(
        (feature) =>
          item.name.toLowerCase() === feature.properties.name.toLowerCase()
      );

      return !!target
        ? {
            "hc-key": target.properties["hc-key"],
            value: item.amount,
          }
        : {};
    });

    const options = {
      title: {
        text: `<span style="text-transform: capitalize">${option}</span>`,
      },
      series: [
        {
          data: mapSource,
          mapData: world,
          name: "Total",
          states: {
            hover: {
              color: "#a4edba",
            },
          },
        },
      ],
    };
    setChartOptions(options);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, option, world]);

  return (
    <Card
      title="Distribution"
      extra={
        <Select
          bordered={false}
          defaultValue={option}
          onChange={(value) => setOption(value)}
        >
          <Select.Option value="student">Student</Select.Option>
          <Select.Option value="teacher">Teacher</Select.Option>
        </Select>
      }
    >
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"mapChart"}
        options={chartOptions}
      />
    </Card>
  );
}
