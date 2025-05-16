import { db } from '../../utils/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

export async function getBookingsData() {
    try {
        const bookingsCollection = collection(db, "bookings");
        const querySnapshot = await getDocs(bookingsCollection);
        
        const monthlyBookings = new Array(12).fill(0);

        querySnapshot.forEach(doc => {
            const bookingData = doc.data();
             console.log("Booking:", bookingData);
            if (bookingData.start) {
                const date = bookingData.start.toDate();
                const month = date.getMonth();
                monthlyBookings[month]++;
            }
        });

        return monthlyBookings;
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        throw error;
    }
}