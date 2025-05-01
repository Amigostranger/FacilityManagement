// approveBooking.js
async function approveBooking(db, bookId, status) {
    try {
      
      if (!bookId || !status || !["Approved", "Declined"].includes(status)) {
        return { status: 400, body: { error: "Invalid status provided" } };
      }
  
      const bookingRef = db.collection("bookings").doc(bookId);
  
      
      const bookingDoc = await bookingRef.get();
      if (!bookingDoc.exists) {
        return { status: 404, body: { error: "Booking not found" } };
      }
  
      // Update the booking status
      await bookingRef.update({ status: status });
  
      return {
        status: 200,
        body: { message: `Booking ${bookId} status updated to ${status}`, status: status },
      };
    } catch (error) {
      console.error(error);
      return { status: 500, body: { error: "Server error" } };
    }
  }
  
  module.exports = approveBooking;
  