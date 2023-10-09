import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";


const LineColumnAreaData = {
  // series: [
  //   {
  //     name: "Expenses",
  //     type: "column",
  //     data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 18],
  //   },
  //   {
  //     name: "Maintenance",
  //     type: "area",
  //     data: [44, 55, 41, 42, 22, 43, 21, 41, 56, 27, 43, 27],
  //   },
  //   {
  //     name: "Profit",
  //     type: "line",
  //     data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
  //   },
  // ],
  options: {
    chart: {
      stacked: false,
      toolbar: {
        show: true,
      },
    },
    stroke: {
      width: [0, 0.5, 1],
      curve: "smooth",
      dashArray: [0, 8, 5]
    },
    plotOptions: {
      bar: {
        columnWidth: "18%",
      },
    },
    colors: ["#4747A1", "rgba(212, 218, 221, 0.18)", "rgb(251, 77, 83)"],

    fill: {
      opacity: [0.85, 0.25, 1],
      gradient: {
        inverseColors: false,
        shade: "light",
        type: "vertical",
        opacityFrom: 0.85,
        opacityTo: 0.55,
        stops: [0, 100, 100, 100],
      },
    },
    labels: [],
    markers: {
      size: 0,
    },
    legend: {
      offsetY: 60,
    },
    xaxis: {
      type: "month",
    },
    yaxis: {
      title: {
        text: "INR",
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: function (y) {
          if (typeof y !== "undefined") {
            return y.toFixed(0) + " INR"
          }
          return y
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
  },
}

const LineColumnArea = (props) => {
  const [loading, setLoading] = React.useState(true);
  const latestConfig = {
    ...LineColumnAreaData
  }
  latestConfig.series = props.drawDownMetrics.series;
  latestConfig.options.labels = [...props.drawDownMetrics.labels];
  latestConfig.options.legend.offsetY =   latestConfig.options.labels.length;
  useEffect(() => {
    setLoading(false);
  }, []);
  return(
    <React.Fragment>
        {!loading && <ReactApexChart
          options={latestConfig.options}
          series={latestConfig.series}
          type="line"
          height="350"
          stacked= "false"
          className="apex-charts"
        />}
      </React.Fragment>
  )
}

export default LineColumnArea;