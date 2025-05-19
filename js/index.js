/* chart */
/* 24시간 날씨 */
function hourForecast_chart() {
  const ctx = document.getElementById("hourForecast").querySelector("canvas").getContext("2d");

  const data = [26, 24, 22, 24, 22, 20, 22, 24, 26, 26, 24, 20, 18];
  //   const data = [26, 25, 24, 23, 22, 20, 22, 23, 22, 21, 22, 23, 23, 22, 20];
  const hour = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
  //   const hour = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

  const options = {
    responsive: true, // flase 크기 고정
    maintainAspectRatio: false, // true 비율유지
    scales: {
      x: {
        display: false,
        min: 0,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        min: Math.min(...data) + 10, // 최소 기온
        max: Math.max(...data) - 10, // 최대 기온
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 10,
        },
      },
    },
    layout: {
      padding: {
        top: 40, // 상단 여백(px)
        right: 0,
        bottom: 20,
        left: 0,
      },
    },
    plugins: {
      legend: false,

      /* ############### */
      /* ############### */

      tooltips: {
        enabled: false,
      },
      hover: {
        animationDuration: 0,
      },
      animation: {
        duration: 1,
        onComplete: function () {
          var chartInstance = this.chart,
            ctx = chartInstance.ctx;
          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontSize,
            Chart.defaults.global.defaultFontStyle,
            Chart.defaults.global.defaultFontFamily
          );
          //   ctx.fillStyle = "transparent";
          //   ctx.textAlign = "center";
          //   ctx.textBaseline = "bottom";

          this.data.datasets.forEach(function (dataset, i) {
            var meta = chartInstance.controller.getDatasetMeta(i);
            meta.data.forEach(function (bar, index) {
              var data = dataset.data[index];
              ctx.fillText(data, bar._model.x, bar._model.y - 5);
            });
          });
        },
      },

      /* ############### */
      /* ############### */
    },
    interaction: {
      mode: "nearest", // hover 시 가까운 데이터 요소에 반응
      intersect: false,
    },
    // animation: 1000,
  };
  const config = {
    data: {
      labels: hour,
      datasets: [
        {
          type: "line",
          data: data,
          borderColor: "#fff",
          borderWidth: 2,
          tension: 0.4,
          pointRadius: function (context) {
            // context.raw는 해당 데이터 값
            return context.dataIndex === 1 ? 2 : 0;
          },
        },
      ],
    },
    options: options,
  };

  new Chart(ctx, config);
}
hourForecast_chart();

function weatherInfo_dnd() {
  let elemList = document.querySelector(".elemList");
  new Sortable(elemList, {
    group: "shared", // 여러 column을 하나의 그룹으로 묶음
    animation: 150, // 애니메이션 속도
  });
}
weatherInfo_dnd();
