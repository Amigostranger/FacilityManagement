import { getMonthlyIssueData } from "../issuesBargraph";
import fetch from 'node-fetch';
global.fetch = fetch;

jest.mock('node-fetch', () => jest.fn());

describe('getMonthlyIssueData', () => {
    const currentDate = new Date();
    const mockIssues = [
        { createdAt: currentDate.toISOString(), status: 'solved' },
        { createdAt: currentDate.toISOString(), status: 'unsolved' },
        { createdAt: new Date(currentDate.getFullYear(), 1).toISOString(), status: 'solved' }, // February
        { createdAt: new Date(currentDate.getFullYear() - 1, 6).toISOString(), status: 'solved' }, // Last year
    ];

    it('should return correct monthly solved and unsolved counts', async () => {
        fetch.mockResolvedValueOnce({
            json: async () => ({ issues: mockIssues }),
        });

        const { solvedIssues, unsolvedIssues } = await getMonthlyIssueData();

        const currentMonth = currentDate.getMonth();

        expect(solvedIssues[currentMonth]).toBe(1);
        expect(unsolvedIssues[currentMonth]).toBe(1);
        expect(solvedIssues[1]).toBeGreaterThanOrEqual(1); // Feb
    });

    it('should return empty arrays on fetch failure', async () => {
        fetch.mockRejectedValue(new Error('API error'));

        const { solvedIssues, unsolvedIssues } = await getMonthlyIssueData();

        expect(solvedIssues).toEqual([]);
        expect(unsolvedIssues).toEqual([]);
    });
});