// barGraph.test.js
import { updateChart } from '../barGraph';

global.fetch = jest.fn(); // Mock fetch globally

describe('updateChart', () => {
  const mockChart = {
    updateOptions: jest.fn()
  };

  const mockData = {
    "Basketball Court": 4,
    "Cricket Field": 2,
    "Netball Court": 5,
    "EsportsHall ": 3,
    "Chess Hall": 1,
    "Soccer Field": 6
  };

  const mockResponse = {
    json: jest.fn().mockResolvedValue(mockData)
  };

  beforeEach(() => {
    fetch.mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetches booking data and updates chart with correct options', async () => {
    const month = '2025-05';

    await updateChart(mockChart, month);

    expect(fetch).toHaveBeenCalledWith(
      `https://sports-management.azurewebsites.net/api/bookings-per-facility?month=${month}`
    );

    expect(mockChart.updateOptions).toHaveBeenCalledWith({
      xaxis: {
        categories: [
          'Basketball Court',
          'Cricket Field',
          'Netball Court',
          'EsportsHall ',
          'Chess Hall',
          'Soccer Field'
        ]
      },
      series: [{
        name: 'Bookings',
        data: [4, 2, 5, 3, 1, 6]
      }]
    });
  });

  
});
