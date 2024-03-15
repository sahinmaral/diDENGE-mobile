const getDailyResultPerHourGraphJsCode = (data) => {
  return `
  Highcharts.chart("container", {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      backgroundColor: "#2660A4",
      type: "column",
    },
    title: {
      text: "Saat bazlı sosyal medya uygulamalarında harcanan süre",
      align: "center",
      style: {
        color: "white",
        fontWeight: "300",
        fontSize: "16px",
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    xAxis: {
      gridLineWidth: 1,
      tickmarkPlacement: "on",
      categories: [
        "00:00",
        "06:00",
        "09:00",
        "12:00",
        "15:00",
        "18:00",
        "21:00",
        "00:00",
      ],
      labels: {
        style: {
          color: "white",
        },
        align: "center",
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      headerFormat: "<b>{point.x}</b><br/>",
      pointFormat: "{point.y} dakika",
    },
    yAxis: {
      min: 0,
      gridLineWidth: 0,
      title: {
        text: "",
      },
      labels: {
        style: {
          color: "white",
        },
      },
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [
      {
        data: ${JSON.stringify(data)},
      },
    ],
  });
    `
}

export default getDailyResultPerHourGraphJsCode