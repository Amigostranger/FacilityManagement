import { getPieChartData } from './piechart_issues.js';
import {loadActiveUsers} from './active_users.js';


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

  var chart = new ApexCharts(document.querySelector("#tot_users"), options);
  chart.render();
});

 document.addEventListener("DOMContentLoaded", async function () {
      const stats=await loadActiveUsers();
      const weekly=(stats.lastWeek/stats.totalUsers)*100;
      const monthly=(stats.lastMonth/stats.totalUsers)*100;
      const activeCard=document.querySelector("#median-ratio");
     
      document.getElementById("week-count").textContent = `Last week: ${stats.lastWeek}`;
      document.getElementById("month-count").textContent = `Last month: ${stats.lastMonth}`;
       var options = {
          series: [weekly],
          chart: {
          color:"red",
          height: 250,
          type: 'radialBar',
          offsetY: -30
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 135,
            color:"blue",
            dataLabels: {
              name: {
                fontSize: '16px',
                color: "blue",
                offsetY: 120
              },
              value: {
                offsetY: 76,
                fontSize: '22px',
                color: "blue",
                formatter: function (val) {
                  return val + "%";
                }
              }
            }
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
              shade: 'dark',
              shadeIntensity: 0.9,
              inverseColors: false,
              opacityFrom: 1,
              opacityTo: 0.7,
              stops: [0, 50, 30, 9]
          },
        },
        stroke: {
          dashArray: 4
        },
        labels: ['Active users'],
        };

        var chart = new ApexCharts(activeCard, options);
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