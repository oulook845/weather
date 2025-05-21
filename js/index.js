/* chart */
/* 24시간 날씨 차트 */
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

/* 날씨 정보 드래그 앤 드랍 */
function weatherInfo_dnd() {
  let elemList = document.querySelector(".elemList");
  new Sortable(elemList, {
    group: "shared", // 여러 column을 하나의 그룹으로 묶음
    animation: 150, // 애니메이션 속도
  });
}
weatherInfo_dnd();

/* 날씨 API */
const temp = document.getElementById("temp"),
  maxTemp = document.getElementById("maxTemp"),
  minTemp = document.getElementById("minTemp"),
  country = document.getElementById("country"),
  city = document.getElementById("city"),
  wind = document.getElementById("wind"),
  humidity = document.getElementById("humidity"),
  des = document.getElementById("des"),
  news = document.getElementById("news"),
  sunSet = document.getElementById("sunset"),
  sunRise = document.getElementById("sunrise"),
  iconImg = document.getElementById("currentIcon");
const todayElem = document.getElementById("today");
const citySurchElem = document.getElementById("citySurch");

let cityname = "seoul";
let lat; // 위도
let lon; // 경도
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  lat = position.coords.latitude;
  lon = position.coords.longitude;
}
function error() {
  lat = 37.566535;
  lon = 126.9779692;
}

let apikey = "86dcc62864235b10b1e698e3a97de179";

// 비동기식 형식
weather = async () => {
  let response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric&lang=kr`
    // `https://api.openweathermap.org/data/2.5/weather?&lat=${lat}&lon=${lon}&appid=${apikey}&units=metric&lang=kr`
  );
  let data = await response.json(); // json 형식으로
  console.log(data)
  /* 잘못된 도시 입력시 오류창 */
  if (!response.ok || data.cod === "404") {
    alert("도시명을 찾을 수 없습니다. 다시 입력해주세요.");
    citySurchElem.value = "";
    citySurchElem.focus();
    return; // 함수 종료
  }

  /* 기온 */
  let data_temp = Math.floor(data.main.temp);
  let data_tempMax = Math.floor(data.main.temp_max);
  let data_tempMin = Math.floor(data.main.temp_min);
  temp.textContent = `${data_temp}`;
  maxTemp.textContent = `${data_tempMax}`;
  minTemp.textContent = `${data_tempMin}`;

  /* 위치 */
  let data_city = data.name;
  city.textContent = data_city;
  let data_country = data.sys.country;
  country.textContent = data_country;

  /* 풍속 */
  let data_wind = (data.wind.speed * 3.6).toFixed(1);
  wind.textContent = `${data_wind}`;

  /* 날씨 설명 */
  let data_des = data.weather[0].main;
  des.textContent = data_des;

  /* 날씨 아이콘 */
  let data_icon = data.weather[0].icon;
  iconImg.setAttribute("src", `https://openweathermap.org/img/wn/${data_icon}@2x.png`);

  /* 일출 */
  let data_sunRise = data.sys.sunrise;
  const sunRise_date = new Date(data_sunRise * 1000); // 밀리초 단위로 변환
  const sunRise_hours = sunRise_date.getHours().toString().padStart(2, "0");
  const sunRise_minutes = sunRise_date.getMinutes().toString().padStart(2, "0");
  sunRise.textContent = `${sunRise_hours} : ${sunRise_minutes}`;

  /* 일몰 */
  let data_sunSet = data.sys.sunset;
  sunSet.textContent = data_sunSet;
  const sunSet_date = new Date(data_sunSet * 1000); // 밀리초 단위로 변환
  const sunSet_hours = sunSet_date.getHours().toString().padStart(2, "0");
  const sunSet_minutes = sunSet_date.getMinutes().toString().padStart(2, "0");
  sunSet.textContent = `${sunSet_hours} : ${sunSet_minutes}`;

  /* 강수확률 */
  let data_humidity = data.main.humidity;
  if (data_humidity == undefined) {
    data_humidity = 0;
  }
  humidity.textContent = data_humidity;

  /* 날짜 입력 */
  const weekElem = document.getElementById("week"),
    yearsElem = document.getElementById("years"),
    monthElem = document.getElementById("month"),
    dayElem = document.getElementById("day");
  const weekList = document.getElementById("weekList"),
    weekList_item = weekList.querySelectorAll("li");

  let date = new Date();
  let year = date.getFullYear(),
    // month = String(date.getMonth() + 1).padStart(2, "0"),
    month = date.getMonth() + 1,
    day = String(date.getDate()).padStart(2, "0"),
    week = date.getDay();
  // let hours = String(date.getHours()).padStart(2, "0"),
  //   minutes = String(date.getMinutes()).padStart(2, "0"),
  //   seconds = String(date.getSeconds()).padStart(2, "0");

  /* 월 구분 */
  switch (month) {
    case 1:
      month = "January";
      break;
    case 2:
      month = "February";
      break;
    case 3:
      month = "March";
      break;
    case 4:
      month = "April";
      break;
    case 5:
      month = "May";
      break;
    case 6:
      month = "June";
      break;
    case 7:
      month = "July";
      break;
    case 8:
      month = "August";
      break;
    case 9:
      month = "September";
      break;
    case 10:
      month = "October";
      break;
    case 11:
      month = "November";
      break;
    case 12:
      month = "December";
      break;
    default:
      "";
  }

  /* 요일 구분 */
  switch (week) {
    case 0:
      weekText = "Sunday";
      break;
    case 1:
      weekText = "Monday";
      break;
    case 2:
      weekText = "Tuesday";
      break;
    case 3:
      weekText = "Wednesday";
      break;
    case 4:
      weekText = "Thursday";
      break;
    case 5:
      weekText = "Friday";
      break;
    case 6:
      weekText = "Saturday";
      break;
    default:
      "";
  }

  yearsElem.textContent = year;
  monthElem.textContent = month;
  dayElem.textContent = day;
  weekElem.textContent = weekText;

  let weekArray = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  let current_weekArray = weekArray.slice(week).concat(weekArray.slice(0, week));

  weekList_item.forEach((week, idx) => {
    let week_list = current_weekArray[idx];
    weekList_item[idx].querySelector(".weekTxt").textContent = week_list;
  });
  weekList_item[0].querySelector(".celTxt").textContent = data_temp;
};
weather();

/* input 도시 검색 */
function searchCity() {
  const citySurchElem = document.getElementById("citySurch");

  citySurchElem.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const usersCity = e.target.value;
      cityname = usersCity;
      weather();
      citySurchElem.value = "";
    }
  });
}
searchCity();
