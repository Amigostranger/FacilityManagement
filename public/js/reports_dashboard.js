import { loadActiveUsers } from './active_users.js';
import { auth } from '../../utils/firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getPieChartData } from './piechart_issues.js';
import { getBookingsData } from './linegraph_bookings.js';
import { totalUsers, getTotalUsers } from './tot_users.js';
import { totalReports, no } from './issuesreport.js';
import { getMonthlyIssueData } from './issuesBargraph.js';
import { updateChart } from './barGraph.js';

let currentUserRole = null;

// Initialize the page
document.addEventListener("DOMContentLoaded", async function () {
  await checkAuthState();
  setupNavigation();
  await initializeCharts();
  await initializeGraphs();
});

// Check authentication state and get user role
async function checkAuthState() {
  try {
    currentUserRole = localStorage.getItem('userRole') || 'staff';
  } catch (error) {
    console.error("Error checking auth state:", error);
    currentUserRole = 'staff';
  }
}

// Navigation setup
function setupNavigation() {
  const navConfig = {
    admin: [
      { id: 'homeBtn', path: './admin_home.html', text: 'Home' },
      { id: 'issuesBtn', path: './staff_admin_issues.html', text: 'Issues' },
      { id: 'manageBtn', path: './list_users.html', text: 'Manage Users' },
      { id: 'bookBtn', path: './staff_admin_booking.html', text: 'Bookings' }
    ],
    staff: [
      { id: 'homeBtn', path: './staff_home.html', text: 'Home' },
      { id: 'issuesBtn', path: './staff_admin_issues.html', text: 'Issues' },
      { id: 'residentsBtn', path: './list_residents.html', text: 'Residents' },
      { id: 'bookBtn', path: './staff_admin_booking.html', text: 'Bookings' }
    ]
  };

  const navbar = document.querySelector('.navbar');
  if (!navbar) {
    console.error("Navbar element not found");
    return;
  }

  navbar.innerHTML = '';
  const role = currentUserRole || 'staff';
  const config = navConfig[role] || navConfig.staff;

  config.forEach(item => {
    const button = document.createElement('button');
    button.id = item.id;
    button.textContent = item.text;

    button.addEventListener('click', () => {
      window.location.href = item.path;
    });

    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        window.location.href = item.path;
      }
    });

    navbar.appendChild(button);
  });

  const currentPage = window.location.pathname.split('/').pop();
  config.forEach(item => {
    const button = document.getElementById(item.id);
    if (button && item.path.includes(currentPage)) {
      button.classList.add('active-nav-button');
    }
  });
}

// Initialize all charts
async function initializeCharts() {
  await getTotalUsers();
  var totUsersOptions = {
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
  new ApexCharts(document.querySelector("#tot_users"), totUsersOptions).render();

  await totalReports();
  document.getElementById("main-heading").textContent = no;

  const stats = await loadActiveUsers();
  const weekly = (stats.lastWeek / stats.totalUsers) * 100;
  const monthly = (stats.lastMonth / stats.totalUsers) * 100;
  const activeCard = document.querySelector("#median-ratio");

  document.getElementById("week-count").textContent = `Last week: ${stats.lastWeek}`;
  document.getElementById("month-count").textContent = `Last month: ${stats.lastMonth}`;

  var activeUsersOptions = {
    series: [weekly],
    chart: {
      color: "red",
      height: 250,
      type: 'radialBar',
      offsetY: -30
    },
    plotOptions: {
      radialBar: {
        startAngle: -135,
        endAngle: 135,
        color: "blue",
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
  new ApexCharts(activeCard, activeUsersOptions).render();

  const monthSelect = document.getElementById("monthSelect");
  var bookingsOptions = {
    chart: {
      height: 300,
      type: 'bar',
    },
    series: [{ name: 'Bookings', data: [] }],
    annotations: {
      points: [{
        x: 'Bananas',
        seriesIndex: 0,
        label: {
          borderColor: '#775DD0',
          offsetY: 0,
          style: {
            color: '#fff',
            background: '#775DD0',
          },
          text: 'Bananas are good',
        }
      }]
    },
    plotOptions: {
      bar: {
        borderRadius: 10,
        columnWidth: '50%',
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      width: 0
    },
    grid: {
      row: {
        colors: ['#fff', '#f2f2f2']
      }
    },
    xaxis: {
      labels: {
        rotate: -45
      },
      categories: ['Soccer Field', 'Basketball Court', 'Cricket Field', 'Netball Court', 'EsportsHall ', 'Chess Hall'],
      tickPlacement: 'on'
    },
    yaxis: {
      title: {
        text: 'Bookings',
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: "horizontal",
        shadeIntensity: 0.25,
        gradientToColors: undefined,
        inverseColors: true,
        opacityFrom: 0.85,
        opacityTo: 0.85,
        stops: [50, 0, 100]
      },
    }
  };

  const bookingsChart = new ApexCharts(document.querySelector("#bookingsChart"), bookingsOptions);
  bookingsChart.render();
  updateChart(bookingsChart, monthSelect.value);

  monthSelect.addEventListener('change', () => {
    updateChart(bookingsChart, monthSelect.value);
  });
}

async function initializeGraphs() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const pieData = await getPieChartData();
        const pieOptions = {
          chart: {
            type: 'pie',
            height: 350,
          },
          series: pieData.series,
          labels: pieData.labels,
          colors: ['#00E396', '#FF4560']
        };
        new ApexCharts(document.querySelector(".piechart"), pieOptions).render();
      } catch (error) {
        console.error("Pie chart failed:", error);
        document.querySelector(".piechart").textContent = "Could not load data";
      }
    } else {
      document.querySelector(".piechart").textContent = "Please log in to view data";
    }
  });

  try {
    const monthlyData = await getBookingsData();
    const lineGraphOptions = {
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
    new ApexCharts(document.querySelector(".line-graph"), lineGraphOptions).render();
  } catch (err) {
    console.error("Error rendering line graph:", err);
  }

  try {
    const { solvedIssues, unsolvedIssues } = await getMonthlyIssueData();
    const barGraphOptions = {
      chart: {
        type: 'bar',
        height: 350
      },
      series: [
        {
          name: 'Solved',
          data: solvedIssues
        },
        {
          name: 'Unsolved',
          data: unsolvedIssues
        }
      ],
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '50%',
          endingShape: 'rounded'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: val => val + " issues"
        }
      }
    };
    new ApexCharts(document.querySelector("#months_bar"), barGraphOptions).render();
  } catch (error) {
    console.error("Error rendering monthly issues chart:", error);
  }
}
