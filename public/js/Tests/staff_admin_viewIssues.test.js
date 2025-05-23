/**
 * @jest-environment jsdom
 */

// Mock Firebase imports at the top of the file
jest.mock('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js', () => ({}), { virtual: true });
jest.mock('https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js', () => ({
  doc: jest.fn(),
  getDoc: jest.fn()
}), { virtual: true });

// Mock your local firebase.js utility
jest.mock('../../../utils/firebase.js', () => ({
  db: {}
}));

import { handleView, loadIssues } from '../staff_admin_viewIssues.js';

// Mock global fetch
global.fetch = jest.fn();

describe('staff_admin_viewIssues.js', () => {
  describe('handleView', () => {
    let modal, descriptionPara, statusSelect, feedbackInput, setCurrentIssueId, event;

    beforeEach(() => {
      modal = document.createElement('div');
      modal.hidden = true;
      descriptionPara = document.createElement('p');
      statusSelect = document.createElement('select');
      feedbackInput = document.createElement('textarea');
      setCurrentIssueId = jest.fn();
      
      // Create status options
      ['Pending', 'In Progress', 'Resolved'].forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        statusSelect.appendChild(option);
      });

      event = {
        target: {
          dataset: { id: 'issue123' }
        }
      };
    });

    test('should populate modal with issue data', async () => {
      // Mock Firestore response
      const mockIssue = {
        description: 'Leaking pipe',
        status: 'Pending',
        feedback: 'Will be fixed soon'
      };
      
      require('https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js').getDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockIssue
      });

      await handleView(event, modal, descriptionPara, statusSelect, feedbackInput, setCurrentIssueId);

      expect(setCurrentIssueId).toHaveBeenCalledWith('issue123');
      expect(descriptionPara.textContent).toBe('Leaking pipe');
      expect(statusSelect.value).toBe('Pending');
      expect(feedbackInput.value).toBe('Will be fixed soon');
      expect(modal.hidden).toBe(false);
    });
  });

  describe('loadIssues', () => {
    let tableBody, handleViewWrapper;

    beforeEach(() => {
      tableBody = document.createElement('tbody');
      handleViewWrapper = jest.fn();
      
      fetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          issues: [
            { id: '1', title: 'Broken bench', username: 'Alice', status: 'Pending' }
          ]
        })
      });
    });

    test('should render issues table', async () => {
      await loadIssues(tableBody, handleViewWrapper);

      expect(tableBody.children.length).toBe(1);
      const row = tableBody.children[0];
      expect(row.innerHTML).toContain('Broken bench');
      expect(row.querySelector('button').textContent).toBe('View');
    });
  });
});