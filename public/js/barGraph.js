export async function updateChart(chart, month) {
  try {
    const response = await fetch(`https://sports-management.azurewebsites.net/api/bookings-per-facility?month=${month}`);
    const data = await response.json();
    const categories = ['Basketball Court','Cricket Field', 'Netball Court','EsportsHall ', 'Chess Hall', 'Soccer Field'];
    const counts = Object.values(data);

    chart.updateOptions({
      xaxis: { categories },
      series: [{ name: 'Bookings', data: counts }]
    });
  } catch (error) {
    console.error("Error loading chart data:", error);
  }
}

