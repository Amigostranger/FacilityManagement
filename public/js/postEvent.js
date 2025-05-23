// postEvent.js
export async function postEvent({ user, title, description, facility, start, end, who }) {
  const idToken = await user.getIdToken();

  const res = await fetch("https://sports-management.azurewebsites.net/api/createEvent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({ title, description, facility, start, end, who })
  });

  const data = await res.json();
  return { res, data };
}
