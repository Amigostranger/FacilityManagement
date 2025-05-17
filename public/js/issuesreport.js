let no=0
async function totalReports() {
  try {
    const response = await fetch('https://sports-management.azurewebsites.net/api/get-reports')

    if (!response.ok) {

      //totalUsers= 0;
    }

    const data = await response.json();
    const allisues = data.map(item => item.createdAt);
    no=getCurrentMonthIssues(data)
    console.log(allisues);
  } catch (error) {
    console.error('Fetch error:', error);
    no= 0;
  }
}

function getCurrentMonthIssues(data) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthIssues = data.filter(item => {
    const createdDate = new Date(item.createdAt._seconds * 1000); 
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
  });

  return currentMonthIssues.length;
}
export {totalReports,no}