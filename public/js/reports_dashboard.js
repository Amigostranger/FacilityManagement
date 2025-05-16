



import { getPieChartData } from './piechart_issues.js';



import { totalUsers,getTotalUsers } from './tot_users.js';

document.addEventListener("DOMContentLoaded",async function () {
   
  await getTotalUsers()
  var options = {
    chart: {
      type: 'radialBar',
      height: 250
    },
    series: [100],
    labels: ['Users'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '20px',
          },
          value: {
            fontSize: '25px',
          },
          total: {
            show: true,
            label: 'Total Users ',
            formatter: function () {
              return totalUsers.toString(); 
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





document.addEventListener("DOMContentLoaded", function() {
  initializePieChart().catch(error => {
    console.error("Pie chart failed:", error);
    document.querySelector(".piechart").textContent = "Could not load data";
  });
});

async function initializePieChart() {
  const pieData = await getPieChartData();
  
  const options = {
    chart: {
      type: 'pie',
      height: 350,
    },
    series: pieData.series,
    labels: pieData.labels,
    colors: ['#00E396', '#FF4560']
  };

  new ApexCharts(document.querySelector(".piechart"), options).render();
}


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