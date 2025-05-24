export async function fetchBookings() {
  try {
    const response = await fetch("https://sports-management.azurewebsites.net/api/staff-bookings");
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    return [];
  }
}

export async function updateBookingStatus(bookId, newStatus) {
  try {
    const response = await fetch(`https://sports-management.azurewebsites.net/api/booking-status/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ bookId, status: newStatus })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }

    console.log(`Status changed to ${newStatus}`);
  } catch (err) {
    console.error("Error updating status:", err.message);
  }
}