//Peticion a la api
const getDataMundial = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/total");
    const covidMundial = await response.json();
    //console.log(covidMundial);
    return covidMundial;
  } catch (e) {
    console.log(e);
  }
};
getDataMundial();

// Funcion de paises e inyeccion en Html
const paises10000 = async () => {
  $(".spiner").removeClass("d-none");
  try {
    const dataMundial = await getDataMundial();

    dataMundial.data.forEach(async (element) => {
      const elementDom = document.getElementsByClassName("tabla-general")[0];
      elementDom.insertAdjacentHTML(
        "beforeEnd",
        `
                          <tr>
                                   <th scope="row">${element.location}</th>
                                   <td>${element.active}</td>
                                   <td>${element.confirmed}</td>
                                   <td>${element.deaths}</td>
                                   <td>${element.recovered}</td>
                                   <td><button type="button" class="btn btn-success" onclick="modalCountry('${element.location}')" data-toggle="modal" data-target="#exampleModal">Detalles</button></td>
                               </tr>
                       `
      );
    });
  } catch (error) {
    console.log(error);
  } finally {
    $(".spiner").addClass("d-none");
  }
};
paises10000();

// Funcion para el grafico y filtrar por paises con mayor a 300.000 casos confirmados

(async () => {
  let response = await fetch("http://localhost:3000/api/total");
  let { data } = await response.json();

  data = data.filter((p) => p.active > 300000);

  const dataGrafico = {
    labels: data.map((p) => p.location),
    datasets: [
      {
        label: "Activos",
        backgroundColor: "red",
        data: data.map((p) => p.active),
      },
      {
        label: "Recuperados",
        backgroundColor: "blue",
        data: data.map((p) => p.recovered),
      },
      {
        label: "Muertos",
        backgroundColor: "green",
        data: data.map((p) => p.deaths),
      },
      {
        label: "Confirmados",
        backgroundColor: "yellow",
        data: data.map((p) => p.confirmed),
      },
    ],
  };

  //   const paises = data.map((p) => p.location);
  //   const recuperados = data.map((p) => p.recovered);
  //   const muertos = data.map((p) => p.deaths);
  //   const confirmados = data.map((p) => p.confirmed);
  //   const activos = data.map((p) => p.active);
  //   console.log(activos);
  //   console.log(confirmados);
  //   console.log(muertos);
  //   console.log(recuperados);
  //   console.log(paises);
  //   console.log(data);
  //   return paises;

  mostrarGrafica(dataGrafico);
})();

// ChartsJs
const mostrarGrafica = (dataGrafico) => {
  var ctx = document.getElementById("canvas").getContext("2d");
  window.myBar = new Chart(ctx, {
    type: "bar",
    data: dataGrafico,
    options: {
      responsive: true,
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Paises con mas de 300.000 casos de Covid19 confirmados",
      },
    },
  });
};

// Modal 2

const modalCountry = async (country) => {
  document.getElementById("chartModalGrafico").innerHTML = "";
  const url = `http://localhost:3000/api/countries/${country}`;
  const response = await fetch(url);
  const data = await response.json();
  var chart = new CanvasJS.Chart("chartModalGrafico", {
    animationEnabled: true,
    title: {
      text: data.data.location,
    },
    data: [
      {
        type: "pie",
        startAngle: 240,
        yValueFormatString: '##0.00"%"',
        indexLabel: "{label} {y}",
        dataPoints: [
          { y: data.data.deaths, label: "Muertos" },
          { y: data.data.confirmed, label: "Confirmados" },
          { y: data.data.recovered, label: "Recuperados" },
          { y: data.data.active, label: "Activos" },
        ],
      },
    ],
  });
  chart.render();
};
modalCountry();

// JWT

$("#covid-form").submit(async (event) => {
  $("#sesionModal").modal("hide");
  event.preventDefault();
  $("#iniciarsesion").hide();
  $("#situacionchile").removeClass("d-none");
  $("#cerrarsesion").removeClass("d-none");

  const email = document.getElementById("email-covid").value;
  const password = document.getElementById("password-covid").value;
  const JWT = await jwtData(email, password);
  localStorage.setItem("token", JWT);
  console.log(email);
  console.log(password);
  const confirmados = await getConfirmed();
  const muertos = await getDeaths();
  const recuperados = await getRecovered();

  console.log(confirmados);
});

const jwtData = async (email, password) => {
  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ email: email, password: password }),
    });
    const { token } = await response.json();
    console.log(token);
    return token;
  } catch (err) {
    console.error(`Error: ${err} `);
  }
};

// Confirmados
const getConfirmed = async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("http://localhost:3000/api/confirmed", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token} `,
      },
    });
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.error(`Error: ${err} `);
  }
};
// Muertos
const getDeaths = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/api/deaths", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token} `,
      },
    });
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.error(`Error: ${err} `);
  }
};
// Recuperados
const getRecovered = async () => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch("http://localhost:3000/api/recovered", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token} `,
      },
    });
    const { data } = await response.json();
    return data;
  } catch (err) {
    console.error(`Error: ${err} `);
  }
};

// Situacion de Chile

const situacionChile = () => {
  $("#graficoFiltrado").addClass("d-none");
  $("#tablaMundial").addClass("d-none");
  $("#Chile").removeClass("d-none");
};

var chart = new CanvasJS.Chart("chartContainer", {
  //theme: "light2", // "light1", "light2", "dark1", "dark2"
  animationEnabled: true,
  title: {
    text: "Internet users",
  },
  subtitles: [
    {
      text: "Try Clicking and Hovering over Legends!",
    },
  ],
  axisX: {
    lineColor: "black",
    labelFontColor: "black",
  },
  axisY2: {
    gridThickness: 0,
    title: "% of Population",
    suffix: "%",
    titleFontColor: "black",
    labelFontColor: "black",
  },
  legend: {
    cursor: "pointer",
    itemmouseover: function (e) {
      e.dataSeries.lineThickness =
        e.chart.data[e.dataSeriesIndex].lineThickness * 2;
      e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize + 2;
      e.chart.render();
    },
    itemmouseout: function (e) {
      e.dataSeries.lineThickness =
        e.chart.data[e.dataSeriesIndex].lineThickness / 2;
      e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize - 2;
      e.chart.render();
    },
    itemclick: function (e) {
      if (typeof e.dataSeries.visible === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      e.chart.render();
    },
  },
  toolTip: {
    shared: true,
  },
  data: [
    {
      type: "spline",
      name: "Sweden",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 47.5 },
        { x: new Date(2005, 00), y: 84.8 },
        { x: new Date(2009, 00), y: 91 },
        { x: new Date(2010, 00), y: 90 },
        { x: new Date(2011, 00), y: 92.8 },
        { x: new Date(2012, 00), y: 93.2 },
        { x: new Date(2013, 00), y: 94.8 },
        { x: new Date(2014, 00), y: 92.5 },
      ],
    },
    {
      type: "spline",
      name: "UK",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 26.8 },
        { x: new Date(2005, 00), y: 70 },
        { x: new Date(2009, 00), y: 83.6 },
        { x: new Date(2010, 00), y: 85 },
        { x: new Date(2011, 00), y: 85.4 },
        { x: new Date(2012, 00), y: 87.5 },
        { x: new Date(2013, 00), y: 89.8 },
        { x: new Date(2014, 00), y: 91.6 },
      ],
    },
    {
      type: "spline",
      name: "UAE",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 23.6 },
        { x: new Date(2005, 00), y: 40 },
        { x: new Date(2009, 00), y: 64 },
        { x: new Date(2010, 00), y: 68 },
        { x: new Date(2011, 00), y: 78 },
        { x: new Date(2012, 00), y: 85 },
        { x: new Date(2013, 00), y: 86 },
        { x: new Date(2014, 00), y: 90.4 },
      ],
    },
    {
      type: "spline",
      showInLegend: true,
      name: "USA",
      markerSize: 5,
      axisYType: "secondary",
      yValueFormatString: '#,##0.0"%"',
      xValueFormatString: "YYYY",
      dataPoints: [
        { x: new Date(2000, 00), y: 43.1 },
        { x: new Date(2005, 00), y: 68 },
        { x: new Date(2009, 00), y: 71 },
        { x: new Date(2010, 00), y: 71.7 },
        { x: new Date(2011, 00), y: 69.7 },
        { x: new Date(2012, 00), y: 79.3 },
        { x: new Date(2013, 00), y: 84.2 },
        { x: new Date(2014, 00), y: 87 },
      ],
    },
    {
      type: "spline",
      name: "Switzerland",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 47.1 },
        { x: new Date(2005, 00), y: 70.1 },
        { x: new Date(2009, 00), y: 81.3 },
        { x: new Date(2010, 00), y: 83.9 },
        { x: new Date(2011, 00), y: 85.2 },
        { x: new Date(2012, 00), y: 85.2 },
        { x: new Date(2013, 00), y: 86.7 },
        { x: new Date(2014, 00), y: 87 },
      ],
    },
    {
      type: "spline",
      name: "Honk Kong",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 27.8 },
        { x: new Date(2005, 00), y: 56.9 },
        { x: new Date(2009, 00), y: 69.4 },
        { x: new Date(2010, 00), y: 72 },
        { x: new Date(2011, 00), y: 72.2 },
        { x: new Date(2012, 00), y: 72.9 },
        { x: new Date(2013, 00), y: 74.2 },
        { x: new Date(2014, 00), y: 74.6 },
      ],
    },
    {
      type: "spline",
      name: "Russia",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 2 },
        { x: new Date(2005, 00), y: 15.2 },
        { x: new Date(2009, 00), y: 29 },
        { x: new Date(2010, 00), y: 43 },
        { x: new Date(2011, 00), y: 49 },
        { x: new Date(2012, 00), y: 63.8 },
        { x: new Date(2013, 00), y: 61.4 },
        { x: new Date(2014, 00), y: 70.5 },
      ],
    },
    {
      type: "spline",
      name: "Ukraine",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 0.7 },
        { x: new Date(2005, 00), y: 3.7 },
        { x: new Date(2009, 00), y: 17.9 },
        { x: new Date(2010, 00), y: 23.3 },
        { x: new Date(2011, 00), y: 28.7 },
        { x: new Date(2012, 00), y: 35.3 },
        { x: new Date(2013, 00), y: 41.8 },
        { x: new Date(2014, 00), y: 43.4 },
      ],
    },
    {
      type: "spline",
      name: "India",
      markerSize: 5,
      axisYType: "secondary",
      xValueFormatString: "YYYY",
      yValueFormatString: '#,##0.0"%"',
      showInLegend: true,
      dataPoints: [
        { x: new Date(2000, 00), y: 0.5 },
        { x: new Date(2005, 00), y: 2.4 },
        { x: new Date(2009, 00), y: 5.1 },
        { x: new Date(2010, 00), y: 7.5 },
        { x: new Date(2011, 00), y: 10.1 },
        { x: new Date(2012, 00), y: 12.6 },
        { x: new Date(2013, 00), y: 15.1 },
        { x: new Date(2014, 00), y: 18 },
      ],
    },
  ],
});
chart.render();

//Home
const home = () => {
  $("#graficoFiltrado").removeClass("d-none");
  $("#tablaMundial").removeClass("d-none");
  $("#Chile").addClass("d-none");
};

// Cerrar sesion

const cerrarSesion = () => {
  $("#graficoFiltrado").removeClass("d-none");
  $("#tablaMundial").removeClass("d-none");
  $("#Chile").addClass("d-none");
  $("#situacionchile").addClass("d-none");
  $("#cerrarsesion").addClass("d-none");
  $("#iniciarsesion").show();
  localStorage.removeItem("token");
};
