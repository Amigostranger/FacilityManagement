import { auth } from '../../utils/firebase.js';

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";




import { getPieChartData } from './piechart_issues.js';
import { getBookingsData } from './linegraph_bookings.js';



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




document.addEventListener("DOMContentLoaded", function () {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
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
      } catch (error) {
        console.error("Pie chart failed:", error);
        document.querySelector(".piechart").textContent = "Could not load data";
      }
    } else {
      console.warn("User not logged in yet");
      document.querySelector(".piechart").textContent = "Please log in to view data";
    }
  });
});



document.addEventListener("DOMContentLoaded", async function () {
  try {
    const monthlyData = await getBookingsData();

    const options = {
      series: [{
        name: "Bookings",
        data: monthlyData
      }],
      chart: {
        height: 350,
        type: 'line',
        zoom: { enabled: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'straight' },
      title: {
        text: 'Overall Bookings per Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      }
    };

    const chart = new ApexCharts(document.querySelector(".line-graph"), options);
    chart.render();

  } catch (err) {
    console.error("Error rendering chart:", err);
  }
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