// Get the elements
const newIssueBtn = document.getElementById('newIssueBtn');
const issueModal = document.getElementById('issueModal');
const cancelBtn = document.getElementById('cancelBtn');

// Show the popup when "Report New Issue" is clicked
newIssueBtn.addEventListener('click', () => {
  issueModal.hidden = false;
});

// Hide the popup when "Cancel" is clicked
cancelBtn.addEventListener('click', () => {
  issueModal.hidden = true;
});
