// submitBooking.js
export async function submitBooking(bookingData, idToken) {
  try {
    const res = await fetch("https://sports-management.azurewebsites.net/api/submit-bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`,
      },
      body: JSON.stringify(bookingData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to submit booking.");
    }

    return { success: true, data };
  } catch (err) {
    console.error("Booking submission failed:", err);
    return { success: false, error: err.message };
  }
}
