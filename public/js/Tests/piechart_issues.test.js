// tests/getPieChartData.test.js
import { getPieChartData } from '../piechart_issues.js'; // adjust path as needed
import { auth } from '../../../utils/firebase.js';

jest.mock('../../../utils/firebase.js', () => ({
    auth: {
        currentUser: {
            getIdToken: jest.fn()
        }
    }
}));

global.fetch = jest.fn();

describe('getPieChartData', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return correct series and labels from valid API response', async () => {
        auth.currentUser.getIdToken.mockResolvedValue('mockToken');

        const mockData = {
            series: [10, 20, 30],
            labels: ['Pending', 'In Progress', 'Resolved']
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const result = await getPieChartData();

        expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
            headers: expect.objectContaining({
                Authorization: expect.stringContaining('Bearer ')
            })
        }));
        expect(result).toEqual(mockData);
    });

    it('should return fallback values when user is not logged in', async () => {
        auth.currentUser = null; // simulate logged-out user

        const result = await getPieChartData();

        expect(result).toEqual({ series: [], labels: [] });
    });

    it('should return fallback values on fetch failure', async () => {
        auth.currentUser = {
            getIdToken: jest.fn().mockResolvedValue('mockToken')
        };

        fetch.mockRejectedValueOnce(new Error('Fetch failed'));

        const result = await getPieChartData();

        expect(result).toEqual({ series: [], labels: [] });
    });

    it('should handle alternate API structure with result.data', async () => {
        auth.currentUser.getIdToken.mockResolvedValue('mockToken');

        const mockData = {
            data: {
                series: [5, 15],
                labels: ['Open', 'Closed']
            }
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const result = await getPieChartData();

        expect(result).toEqual(mockData.data);
    });
});
