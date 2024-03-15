const getDailyResultPerApplicationGraphJsCode = (data) => {
  return `
Highcharts.chart("container", {
  chart: {
    plotBackgroundColor: null,
    plotBorderWidth: null,
    plotShadow: false,
    backgroundColor: "#2660A4",
    type: "bar",
  },
  credits: {
    enabled: false,
  },
  exporting: {
    enabled: false,
  },
  title: {
    text: "Uygulama bazlı sosyal medya uygulamalarında harcanan süre ve uygulama açılma sıklığı",
    style: {
      color: "white",
      fontWeight: "300",
      fontSize: "16px",
    },
  },
  subtitle: {
    text: "*HS : Harcanan süre <br/> *AS : Uygulamanın açılma sıklığı",
    align: "left",
    style: {
      color: "white",
      fontWeight: "300",
      fontSize: "13px",
    },
  },
  xAxis: {
    height: 70,
    visible: false,
    categories: [""],
    labels: {
      style: {
        color: "white",
      },
      align: "center",
    },
  },
  yAxis: {
    visible: false,
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
  tooltip: {
    headerFormat: "<b>{series.name}</b><br/>",
    pointFormat: "{point.y} dakika",
  },
  legend: {
    enabled: false,
    layout: "horizontal",
    itemStyle: {
      color: "white",
    },
  },
  plotOptions: {
    series: {
      borderRadius: "15%",
      stacking: "normal",
      dataLabels: {
        enabled: false,
      },
    },
  },
  series: ${JSON.stringify(data)},
});
`;
}

export default getDailyResultPerApplicationGraphJsCode