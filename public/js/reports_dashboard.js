

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