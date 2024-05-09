const getApplicationBasedResultGraphJsCode = (categories, data) => {

  return `
    Highcharts.chart("container", {
        chart: {
          type: "column",
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "#2660A4",
        },
        exporting: {
          enabled: false,
        },
        xAxis: {
          categories: ${JSON.stringify(categories)},
          labels: {
            style: {
              color: "white",
            },
          },
        },
        title: {
          text: "",
        },
        yAxis: {
          min: 0,
          title: {
            text: "",
          },
          labels: {
            style: {
              color: "white",
            },
          },
        },
        legend: {
          enabled: false,
          layout: "horizontal",
          itemStyle: {
            color: "white",
          },
        },
        tooltip: {
          headerFormat: "<b>{point.x}</b><br/>",
          pointFormat:
            "{series.name}: {point.y} dakika",
        },
        credits: {
          enabled: false,
        },
        plotOptions: {
          column: {
            stacking: "normal",
            dataLabels: {
              enabled: false,
              format: "{point.y} dakika",
              style: {
                color: "white",
              },
            },
          },
        },
        series: ${JSON.stringify(data)},
      });
      `;
};

export default getApplicationBasedResultGraphJsCode;
