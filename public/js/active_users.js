
export async function loadActiveUsers() {
    try{
        //https://sports-management.azurewebsites.net
        //http://localhost:3000
        const statsDocs = await fetch("https://sports-management.azurewebsites.net/api/activeUsers");
        const stats= await statsDocs.json();
        return stats;
    }catch(error){
         console.error('Error fetching Active users', error);
    }
}