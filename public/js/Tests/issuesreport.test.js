import { totalReports, no ,getCurrentMonthIssues} from '../issuesreport';
import fetch from 'node-fetch';
global.fetch = fetch;

jest.mock('node-fetch', () => jest.fn());

describe('Report functions', () => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const createMockTimestamp = (year, month) => {
    const date = new Date(year, month);
    return { _seconds: Math.floor(date.getTime() / 1000) };
  };

  const mockData = [
    { createdAt: createMockTimestamp(currentYear, currentMonth) },
    { createdAt: createMockTimestamp(currentYear, currentMonth) },
    { createdAt: createMockTimestamp(currentYear, currentMonth - 1) },
    { createdAt: createMockTimestamp(currentYear - 1, 5) },
  ];

  beforeEach(() => {
    fetch.mockReset();
  });

  it('getCurrentMonthIssues should return correct count', () => {
    const count = getCurrentMonthIssues(mockData);
    expect(count).toBe(2);
  });

  it('totalReports should update count for current month', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    await totalReports();

    expect(no).toBe(2);
  });

  it('totalReports should return 0 on fetch failure', async () => {
    fetch.mockRejectedValueOnce(new Error('Fetch failed'));

    await totalReports();

    expect(no).toBe(0);
  });

  it('totalReports should return 0 on non-ok response', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => [],
    });

    await totalReports();

    expect(no).toBe(0);
  });
});
