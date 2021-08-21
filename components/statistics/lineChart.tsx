import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Statistic } from "../../shared/types/statistics";

export interface LineChartProps {
  data: {
    [key: string]: Statistic[];
  };
}

export default function LineChart({ data }: LineChartProps) {
  const [options, setOptions] = useState<any>({
    title: {
      text: "",
    },
    yAxis: {
      title: { text: "Increment" },
    },
    xAxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    credits: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const series = Object.entries(data)
      .filter(([_, data]) => !!data && data.length)
      .map(([title, data]) => ({
        name: title,
        data: new Array(12).fill(0).map((_, index) => {
          const month = index + 1;
          const name = month > 9 ? month.toString() : "0" + month;
          // const target = data.find((item) => item.name.split("-")[1] === name);
          const amount = data.reduce((acc, cur) => {
            if (cur.name.split("-")[1] === name) {
              acc += cur.amount;
            }
            return acc;
          }, 0);

          return amount;
        }),
      }));

    setOptions({ series });
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options} />;
}
