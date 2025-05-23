import { auth } from '../../utils/firebase.js';
import { db } from '../../utils/firebase.js';
import { collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";


export async function fetchBookings(bookingsTable, bookingsTableBody, noBookingsMessage) {
  bookingsTableBody.innerHTML = ""; // Clear old bookings

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      alert("You must be logged in to view bookings.");
      return;
    }

    const submittedBy = user.uid;
    const bookingsRef = collection(db, "bookings");
    const q = query(bookingsRef, where("submittedBy", "==", submittedBy));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        bookingsTable.hidden = true;
        noBookingsMessage.hidden = false;
      } else {
        noBookingsMessage.hidden = true;
        bookingsTable.hidden = false;

        querySnapshot.forEach((doc) => {
          const booking = doc.data();

          const start = booking.start?.toDate?.() ?? new Date(booking.start);
          const end = booking.end?.toDate?.() ?? new Date(booking.end);

          if (isNaN(start) || isNaN(end)) {
            console.warn("Invalid date found in booking:", booking);
            return;
          }

          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${booking.title}</td>
            <td>${booking.facility || '-'}</td>
            <td>${start.toLocaleDateString()}</td>
            <td>${start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
            <td>${end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
          `;
          bookingsTableBody.appendChild(row);
        });
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to fetch bookings. Please try again later.");
    }
  });
}
