// weather.test.js
//import { loadWeather } from '../public/js/weather';
import { loadWeather } from '../weather';

global.fetch = jest.fn();

describe('loadWeather', () => {
  beforeEach(() => {
    fetch.mockClear();
    document.body.innerHTML = '<section id="weather-forecast"></section>';
  });

  it('calls fetch and awaits response', async () => {
    const mockWeather = {
      date: '2025-05-23',
      icon: 'icon.png',
      description: 'sunny',
      condition: 'Clear',
      temp: { min: 15, max: 28 }
    };

    fetch.mockResolvedValueOnce({
      json: async () => mockWeather
    });

    await loadWeather();

    expect(fetch).toHaveBeenCalledWith('https://sports-management.azurewebsites.net/api/weather');
  });
});
