async function submitBooking(db, admin, uid, bookingData) {
    const { title, description, facility, start, end, who } = bookingData;
  
    if (!title || !description || !facility || !start || !end || !who) {
      return { status: 400, body: { error: "All fields required" } };
    }
  
    try {
      const newStart = admin.firestore.Timestamp.fromDate(new Date(start));
      const newEnd = admin.firestore.Timestamp.fromDate(new Date(end));
  
      const overlapping = await db.collection("bookings")
        .where("facility", "==", facility)
        .where("status", "==", "Approved")
        .where("start", "<", newEnd)
        .where("end", ">", newStart)
        .get();
  
      if (!overlapping.empty) {
        return { status: 409, body: { error: "Booking conflict detected" } };
      }
  
      await db.collection("bookings").add({
        title,
        description,
        facility,
        submittedBy: uid,
        status: "Pending",
        start: newStart,
        end: newEnd,
        who,
      });
  
      return { status: 200, body: { message: "Booking submitted" } };
    } catch (error) {
      console.error("Booking save error:", error);
      return { status: 500, body: { error: "Failed to save Booking" } };
    }
  }
  
  module.exports = submitBooking;
  