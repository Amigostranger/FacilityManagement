



import { totUsers } from './tot_users.js';

document.addEventListener("DOMContentLoaded",async function () {
   //const totalUsers = await getTotalUsers();
  var options = {
    chart: {
      type: 'radialBar',
      height: 250
    },
    series: [75], 
    labels: ['Users'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '16px',
          },
          value: {
            fontSize: '22px',
          },
          total: {
            show: true,
            label: 'Total',
            formatter: function () {
              return 80; 
            }
          }
        }
      }
    }
  };

  var chart = new ApexCharts(document.querySelector("#tot_users"), options);
  chart.render();
});


 document.addEventListener("DOMContentLoaded", function () {
  var options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [{
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70]
    }],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  var chart = new ApexCharts(document.querySelector(".active-users"), options);
  chart.render();
});

 document.addEventListener("DOMContentLoaded", function () {
  var options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [{
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70]
    }],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  var chart = new ApexCharts(document.querySelector(".report"), options);
  chart.render();
});




document.addEventListener("DOMContentLoaded", function () {
  var options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [{
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70]
    }],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  var chart = new ApexCharts(document.querySelector(".facility-bargraph"), options);
  chart.render();
});





document.addEventListener("DOMContentLoaded", function () {
  var options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [{
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70]
    }],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  var chart = new ApexCharts(document.querySelector(".piechart"), options);
  chart.render();
});


document.addEventListener("DOMContentLoaded", function () {
  var options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [{
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70]
    }],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  var chart = new ApexCharts(document.querySelector(".line-graph"), options);
  chart.render();
});


document.addEventListener("DOMContentLoaded", function () {
  var options = {
    chart: {
      type: 'bar',
      height: 350
    },
    series: [{
      name: 'Sales',
      data: [30, 40, 45, 50, 49, 60, 70]
    }],
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    }
  };

  var chart = new ApexCharts(document.querySelector("#months_bar"), options);
  chart.render();
});