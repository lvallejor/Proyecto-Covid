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
  const confirmados = await getConfirmed();
  const muertos = await getDeaths();
  const recuperados = await getRecovered();

  situacionChile(confirmados, muertos, recuperados);
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

// Grafico Situacion Chile

const situacionChile = (confirmados, muertos, recuperados) => {
  console.log(recuperados);
  $("#graficoFiltrado").addClass("d-none");
  $("#tablaMundial").addClass("d-none");
  $("#Chile").removeClass("d-none");
  var ctx = document.getElementById("Chile").getContext("2d");
  window.myline = new Chart(ctx, {
    type: "line",
    data: {
      labels: recuperados.map((e) => e.date),
      datasets: [
        {
          label: "recuperados",
          backgroundColor: "blue",
          data: recuperados.map((e) => e.total),
          fill: false,
        },

        {
          label: "fallecidos",
          backgroundColor: "red",
          fill: false,
          data: muertos.map((e) => e.date),
        },
        {
          label: "confirmados",
          fill: false,
          backgroundColor: "yellow",
          data: confirmados.map((e) => e.date),
        },
      ],
    },
    options: {
      responsive: true,
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Situacion Covid10 Chile",
      },
    },
  });
};
