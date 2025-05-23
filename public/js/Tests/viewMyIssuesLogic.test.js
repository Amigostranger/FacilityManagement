/**
 * @jest-environment jsdom
 */

import { fetchIssues } from '../viewMyIssuesLogic.js';

global.fetch = jest.fn();

describe('fetchIssues', () => {
  let mockUser, tableBody, viewDescription, viewFeedback, viewModal;

  beforeEach(() => {
    // Mock user with getIdToken
    mockUser = {
      getIdToken: jest.fn().mockResolvedValue('fake-token')
    };

    // Create DOM elements
    tableBody = document.createElement('tbody');
    viewDescription = document.createElement('p');
    viewFeedback = document.createElement('p');
    viewModal = document.createElement('div');

    // Mock API response
    fetch.mockResolvedValue({
      json: async () => ({
        issues: [
          {
            id: '1',
            title: 'Broken Net',
            status: 'Pending',
            description: 'The net is torn',
            feedback: ''
          }
        ]
      })
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders issue rows and attaches event listeners', async () => {
    await fetchIssues(mockUser, tableBody, viewDescription, viewFeedback, viewModal);

    // Should append one row
    expect(tableBody.children.length).toBe(1);

    const row = tableBody.children[0];
    expect(row.querySelector('td').textContent).toBe('Broken Net');

    // Simulate click on the View button
    const viewBtn = row.querySelector('button');
    viewBtn.click();

    expect(viewDescription.textContent).toBe('The net is torn');
    expect(viewFeedback.textContent).toBe('No feedback yet.');
    expect(viewModal.hidden).toBe(false);
  });

  test('handles missing description/feedback', async () => {
    fetch.mockResolvedValueOnce({
      json: async () => ({
        issues: [
          {
            id: '2',
            title: 'Lights Out',
            status: 'Resolved'
          }
        ]
      })
    });

    await fetchIssues(mockUser, tableBody, viewDescription, viewFeedback, viewModal);

    const viewBtn = tableBody.querySelector('button');
    viewBtn.click();

    expect(viewDescription.textContent).toBe('No description.');
    expect(viewFeedback.textContent).toBe('No feedback yet.');
  });
});
