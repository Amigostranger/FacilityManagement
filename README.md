# 🏀 Community Sports Facility Management System

A web-based solution for managing shared sports facilities in local communities. This platform streamlines **facility booking**, **user management**, **maintenance reporting**, **event organization**, and **real-time reporting** using Agile, CI/CD, and Test-Driven Development principles.

---

## 🚀 Features

### ✅ Facility Booking
- Real-time booking and availability tracking
- Role-based access (Residents book, Admins approve/decline)

### ✅ Membership & User Management
- Admin dashboard for onboarding users, revoking access, and assigning roles
- 3 User Roles:  
  - **Resident**: Can book facilities, view events, report issues  
  - **Facility Staff**: Manages maintenance issues  
  - **Admin**: Manages users, creates events, and generates reports

### ✅ Maintenance Reporting
- Users can report issues with facilities
- Facility Staff can update issue status and leave feedback

### ✅ Event Management & Notifications
- Admins can schedule events (e.g., tournaments, community classes)
- Users receive automated notifications about:
  - Upcoming events
  - Maintenance closures
  - (Bonus) Weather disruptions for outdoor venues

### ✅ Reporting Dashboard
- Visual reports for:
  - Facility usage trends
  - Maintenance issue status (open vs closed)
  - Customizable report views
- Exportable reports (CSV / PDF)

---

## 🛠️ Tech Stack

- **Frontend**: Javascript(vanilla)
- **Backend**: Node.js (Express)
- **Database**: MongoDB
- **Authentication**: OAuth 2.0 with Google or GitHub
- **CI/CD**: GitHub Actions / GitLab CI
- **Testing**: Jest, Mocha, Chai (unit + integration tests)
- **Deployment**: (Azure)
---

## 🔐 Authentication & User Roles

Authentication is powered by a **3rd-party identity provider (OAuth2)**. Users are assigned one of the following roles:

| Role          | Description                                   |
|---------------|-----------------------------------------------|
| Resident      | Can book facilities, report issues, attend events |
| Facility Staff| Updates maintenance issues                    |
| Admin         | Manages users, events, and system settings    |

---

## 🧪 Test-Driven Development (TDD)

All features follow a TDD approach:
- Write failing tests
- Implement feature
- Refactor and optimize

Unit and integration tests cover major functionality to ensure reliability and maintainability.

---

## 🔄 Agile Methodology

Development is broken into sprints with frequent standups, retrospectives, and continuous user feedback loops.

---

## 📈 Deployment & CI/CD

- Continuous Integration: Automated testing on pull requests
- Continuous Deployment: Auto-deploy to cloud host
- Environments: Dev, Staging, and Production

---

## 📁 Getting Started (For Devs)

```bash
# Clone repo
git clone https://github.com/your-org/community-sports-facility.git

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Run backend
cd backend && npm run dev

# Run frontend
cd ../frontend && npm run dev
