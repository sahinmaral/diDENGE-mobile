const getTodayResultGraphJsCode = (total, spent) => {
  return `
    Highcharts.setOptions({
        colors: ["#0077B6", "#EDF7F6"],
      });
      Highcharts.chart("container", {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          backgroundColor: "#2660A4",
          type: "pie",
        },
        exporting: {
          enabled: false,
        },
        title: {
          text: "${Math.ceil((spent / total) * 100)}%",
          y: 0,
          verticalAlign:'middle',
          style: {
            color: "white",
            fontWeight: "bold",
            fontSize: "30px",
          },
        },
        subtitle: {
          verticalAlign:'middle',
          y: 30,
          text: "${total - spent} dakika kaldı",
          style: {
            color: "white",
            fontWeight: "bold",
            fontSize: "20px",
          },
        },
        legend: {
          enabled: false,
        },
        tooltip: {
          headerFormat: "",
          pointFormat: "{point.name}: <b>{point.y} dk</b>",
        },
        plotOptions: {
          pie: {
            size: '120%',
            allowPointSelect: false,
            cursor: "pointer",
            dataLabels: {
              enabled: false,
            },
            showInLegend: true,
            borderColor: "transparent",
          },
        },
        credits: {
          enabled: false,
        },
        series: [
          {
            name: "",
            colorByPoint: true,
            innerSize: "85%",
            data: [
              {
                name: "Kullanılan",
                y: ${spent},
              },
              {
                name: "Kalan",
                y: ${total - spent},
              },
            ],
          },
        ],
      });
    `
}

export default getTodayResultGraphJsCode