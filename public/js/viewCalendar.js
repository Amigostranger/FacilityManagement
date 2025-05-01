import { db } from "./firebase.js";
import { collection, getDocs, query, where  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

function mapDocsToEvents(docs){
  return docs.map(doc => {
    const data = doc.data();
    
    return {
      title: data.title,
      start: data.start.toDate().toISOString(),
      end: data.end.toDate().toISOString(),
      extendedProps: {
        facility: data.facility,
        description: data.description
      }
    };
  });
}

async function fetchEvents(fetchInfo, successCallback, failureCallback){
  try{
    const snapshot = await getDocs(collection(db, "bookings"), where("status", "==", "Approved"));
    const events = mapDocsToEvents(snapshot.docs);
    successCallback(events);
  }
  catch (error){
    console.error("Error fetching calendar events:",error);
    failureCallback(error);
  }
}



document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar')



    const calendar = new FullCalendar.Calendar(calendarEl, {
      
      events: fetchEvents,

      initialView: 'timeGridWeek',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      }

    
   
    });

    calendar.render()
  })

