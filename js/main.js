const api_key = "{your-api-key}";
const url =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&appid=" +
  api_key;

const checkByCity = document.getElementById("checkbycity");
const checkByLocation = document.getElementById("checkbyloc");
const fiveDays = document.getElementById("fivedays");
const city = document.getElementById("city");
const result = document.getElementById("result");
const loader = document.getElementById("loader");
const main = document.getElementById("main");

// Get data by city entered by user
checkByCity.addEventListener("click", function() {
  // Start loading
  loader.style.display = "block";
  main.style.display = "none";

  if (city.value === "") {
    loader.style.display = "none";
    main.style.display = "block";
    M.toast({
      html: "Please enter valid city",
      classes: "red darken-3 white-text center"
    });
    return;
  }

  fetch(url + "&q=" + city.value)
    .then(response => response.json())
    .then(d => {
      console.log(d);
      handleResponse(d);
    })
    .catch(err => {
      console.log("Some error occured", err);
      loader.style.display = "none";
      main.style.display = "block";
      M.toast({
        html: "An error occured ! " + err.message,
        classes: "red darken-3 white-text center"
      });
    });
});

// Get data from current location
checkByLocation.addEventListener("click", function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      getDataByLocation,
      showErrorForLocation
    );
    loader.style.display = "block";
    main.style.display = "none";
  } else {
    M.toast({
      html: "Geolocation is not supported by this browser.",
      classes: "red darken-3 white-text center"
    });
    return;
  }
});

/* Function for handling location success */

function getDataByLocation(pos) {
  let lat = pos.coords.latitude,
    lon = pos.coords.longitude;

  console.log(lat, lon);

  // Start loading
  //   loader.style.display = "block";
  //   main.style.display = "none";

  fetch(url + "&lat=" + lat + "&lon=" + lon)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      handleResponse(data);
    })
    .catch(err => {
      loader.style.display = "none";
      main.style.display = "block";
      M.toast({
        html: "Some error has occured!",
        classes: "red darken-3 white-text center"
      });
    });
}

/* Location Error function */

function showErrorForLocation(error) {
  loader.style.display = "none";
  main.style.display = "block";

  switch (error.code) {
    case error.PERMISSION_DENIED:
      M.toast({
        html: "User denied the request for Geolocation.",
        classes: "red darken-3 white-text center"
      });
      break;
    case error.POSITION_UNAVAILABLE:
      M.toast({
        html: "Location information is unavailable.",
        classes: "red darken-3 white-text center"
      });
      break;
    case error.TIMEOUT:
      M.toast({
        html: "The request to get user location timed out.",
        classes: "red darken-3 white-text center"
      });
      break;
    case error.UNKNOWN_ERROR:
      M.toast({
        html: "An unknown error occurred.",
        classes: "red darken-3 white-text center"
      });
      break;
  }
}

/* Function for handling response from API */

function handleResponse(data) {
  // Check whether the data is found or not
  if (data.cod == "404") {
    console.log("City not found");
    loader.style.display = "none";
    main.style.display = "block";
    M.toast({
      html: "City not found!",
      classes: "red darken-3 white-text center"
    });
  } else if (data.cod == "200") {
    var sunrise = new Date(data.sys.sunrise * 1000);
    var sunset = new Date(data.sys.sunset * 1000);

    let output = `
        <h3>Weather in <span class="blue-text">${data.name}, ${
      data.sys.country
    }</span></h3>
    <h3>${data.main.temp} &#8451</h3>
    
    <img src="https://openweathermap.org/img/w/${
      data.weather[0].icon
    }.png" alt="icon">  
    <span><p class="flow-text">${data.weather[0].main}</p>
    </span>
        <ul class="collection">
            <li class="collection-item"><b>Humidity : </b>${
              data.main.humidity
            } %</li>
            <li class="collection-item"><b>Pressure : </b>${
              data.main.pressure
            } hPa</li>
            <li class="collection-item"><b>Visibility : </b>${
              data.visibility
            } m</li>
            <li class="collection-item"><b>Wind : </b>${
              data.wind.speed
            } m/s</li>
            <li class="collection-item"><b>Cloudiness : </b>${
              data.clouds.all
            } %</li>
            <li class="collection-item"><b>Sunrise : </b>${sunrise.getHours()} : ${sunrise.getMinutes()} </li>
            <li class="collection-item"><b>Sunset : </b>${sunset.getHours()} : ${sunset.getMinutes()} </li>
        </ul>
  `;

    loader.style.display = "none";
    main.style.display = "block";
    result.innerHTML = output;
    result.style.display = "block";
  } else {
    loader.style.display = "none";
    main.style.display = "block";
    M.toast({
      html: "An error has occured! " + data.message,
      classes: "red darken-3 white-text center"
    });
  }
}

fiveDays.addEventListener("click", function() {
  let d = new Date(1548061200 * 1000);
  console.log(d.getDate());

  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=lucknow&units=metric&appid=65a4296e3d6fd7f8f8709785cea0bdad"
  )
    .then(response => response.json())
    .then(data => {
      console.log(data);
      displayChart(data);
    })
    .catch(err => console.log(err));
});

function displayChart(data) {
  let forecast = document.getElementById("forecast");
  var ctx = forecast.getContext("2d");

  // let dates = [];
  // for(let i=6; i<=33; i++){
  //   let d = new Date((data.list[i].dt)*1000);
  //   dates.push(d.getHours()+':00');
  // }
  // console.log();

  var forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["9:00", "12;00", "15:00", "18:00", "21:00"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 3],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1,
          fill: false
        },
        {
          label: "# of Votes",
          data: [1, 9, 13, 15, 20, 23],
          borderColor: [
            "rgba(255,99,132,1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1,
          fill: false
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: false
            }
          }
        ]
      },
      animation: {
        duration: 2000 // general animation time
      },
      responsive: true
    },
    hover: {
      animationDuration: 0 // duration of animations when hovering an item
    },
    responsiveAnimationDuration: 0
  });

  forecast.style.display = "block";
}
