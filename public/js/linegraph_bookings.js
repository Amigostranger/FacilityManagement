async function getBookingsData() {
  try {
    const response = await fetch('https://sports-management.azurewebsites.net/api/get-bookings-per-month');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Full fetch error:', {
      message: error.message,
      stack: error.stack
    });
    return Array(12).fill(0);
  }
}
export { getBookingsData };
