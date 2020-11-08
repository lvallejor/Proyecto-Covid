//Peticion a la api
const getDataMundial = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/total");
    const covidMundial = await response.json();
    console.log(covidMundial);
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

    // const arregloGrafico = {};

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
                                   <td><button type="button" class="btn btn-success" onclick="modalPais(${element.location})">Detalles</button></td>
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

// CanvasJs
const imprimirGrafico = () => {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    title: {
      text: "Paises con Covid19 mayor a 150.000 casos activos",
    },
    axisX: {
      interval: 1,
      intervalType: "year",
      valueFormatString: "YYYY",
    },
    axisY: {
      suffix: "",
    },
    toolTip: {
      shared: true,
    },
    legend: {
      reversed: true,
      verticalAlign: "center",
      horizontalAlign: "right",
    },
    data: [
      {
        type: "stackedColumn100",
        name: "Casos Activos",
        showInLegend: true,
        xValueFormatString: "YYYY",
        yValueFormatString: '#,##0""',
        dataPoints: [
          { x: new Date(2010, 0), y: 40 },
          { x: new Date(2011, 0), y: 50 },
          { x: new Date(2012, 0), y: 60 },
          { x: new Date(2013, 0), y: 61 },
          { x: new Date(2014, 0), y: 63 },
          { x: new Date(2015, 0), y: 65 },
          { x: new Date(2016, 0), y: 67 },
        ],
      },
      {
        type: "stackedColumn100",
        name: "Casos confirmados",
        showInLegend: true,
        xValueFormatString: "YYYY",
        yValueFormatString: '#,##0""',
        dataPoints: [
          { x: new Date(2010, 0), y: 28 },
          { x: new Date(2011, 0), y: 18 },
          { x: new Date(2012, 0), y: 12 },
          { x: new Date(2013, 0), y: 10 },
          { x: new Date(2014, 0), y: 10 },
          { x: new Date(2015, 0), y: 7 },
          { x: new Date(2016, 0), y: 5 },
        ],
      },
      {
        type: "stackedColumn100",
        name: "Casos muertos",
        showInLegend: true,
        xValueFormatString: "YYYY",
        yValueFormatString: '#,##0""',
        dataPoints: [
          { x: new Date(2010, 0), y: 15 },
          { x: new Date(2011, 0), y: 12 },
          { x: new Date(2012, 0), y: 10 },
          { x: new Date(2013, 0), y: 9 },
          { x: new Date(2014, 0), y: 7 },
          { x: new Date(2015, 0), y: 5 },
          { x: new Date(2016, 0), y: 1 },
        ],
      },
      {
        type: "stackedColumn100",
        name: "Recuperados",
        showInLegend: true,
        xValueFormatString: "YYYY",
        yValueFormatString: '#,##0""',
        dataPoints: [
          { x: new Date(2010, 0), y: 17 },
          { x: new Date(2011, 0), y: 20 },
          { x: new Date(2012, 0), y: 18 },
          { x: new Date(2013, 0), y: 20 },
          { x: new Date(2014, 0), y: 20 },
          { x: new Date(2015, 0), y: 23 },
          { x: new Date(2016, 0), y: 27 },
        ],
      },
    ],
  });
  chart.render();
};
imprimirGrafico();

// modal

// const modalPais = (element) => {
//      try {
//     const response = await fetch("http://localhost:3000/api/countries/{country}");
//     const covidPais = await response.json();
//     console.log(covidPais);
//     return covidMundial;
//   } catch (e) {
//     console.log(e);
//   }
// }
