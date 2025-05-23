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
run command : cd FacilityManagement

## 2️⃣ Install Dependencies
npm install

## 3️⃣ Firebase Service Account Setup

• Go to your Firebase Console and generate a new service account key.
• Download the serviceAccountKey.json file.
• Place it in the root directory of your project (same level as server.js).

## 5️⃣ Modify Code for Local Use

✅ Comment out the environment variable version:
constserviceAccount=JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

✅ Use the file-based version:
const serviceAccountPath = path.resolve('./serviceAccountKey.json');
if (!fs.existsSync(serviceAccountPath)) {
  console.error(`serviceAccountKey.json not found at ${serviceAccountPath}`);
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

## 4️⃣ Run the Application Locally
node server.js
🟢 The backend server will be running at :
http://localhost:3000 (or your defined PORT)

🧪 Running Tests
To run unit tests using Jest : npm test
