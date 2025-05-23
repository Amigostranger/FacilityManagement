# 🏀 Community Sports Facility Management System

- **Frontend**: Javascript
- **Backend**: Node.js (Express)
- **Database**:Firestore
- **Authentication**: OAuth 2.0 with Google through firebase
- **CI/CD**: GitHub Actions
- **Testing**: Jest(Unit test)
- **Deployment**: Microsoft Azure

---
# How to set up and run application locally

## 1️⃣ Clone the repository
run command : git clone https://github.com/Sports-Facility-Management-Team1/FacilityManagement.git
cd FacilityManagement

## 2️⃣ Install Dependencies
run command : npm install

## 3️⃣ Firebase Service Account Setup
There is a provided file called ./serviceAccountKey.json.
It should be in the same folder as server.js

## 4️⃣ Modify Code for Local Use
### Comment out the environment variable method (used for production):
//constserviceAccount=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
### Uncomment and use the file-based version:
const serviceAccountPath = path.resolve('./serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error(`serviceAccountKey.json not found at ${serviceAccountPath}`);
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

## 4️⃣ Run the Application Locally
run command : node server.js
Backend server should now be running locally at http://localhost:PORT (default is likely 3000).
