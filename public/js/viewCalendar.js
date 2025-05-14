import { db } from '../../utils/firebase.js';
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
    const eventsQuery = query(collection(db, "bookings"), where("status", "==", "Approved"));
    const snapshot = await getDocs(eventsQuery);
    const events = mapDocsToEvents(snapshot.docs);
    successCallback(events);
  }
  catch (error){
    console.error("Error fetching calendar events:",error);
    failureCallback(error);
  }
}

function setupCalendar(calendarEl){
  const calendar = new FullCalendar.Calendar(calendarEl, {
      
    events: fetchEvents,

    height: "auto",


    initialView: 'dayGridMonth',

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },

    eventClick: function(info) {
      const event = info.event;
      const title = event.title;
      const facility = event.extendedProps.facility;
      const description = event.extendedProps.description;
      const start = new Date(event.start).toLocaleString();
      const end = new Date(event.end).toLocaleString();

      alert(
        `🏟️ ${title}\n` +
        `📍 Facility: ${facility}\n` +
        `📅 Start: ${start}\n` +
        `⏱️ End: ${end}\n` +
        `📝 Description: ${description || 'None'}`
      );
    }
  });


  calendar.render()
}


document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');

    setupCalendar(calendarEl);
    
    

})

export { mapDocsToEvents, fetchEvents, setupCalendar};


