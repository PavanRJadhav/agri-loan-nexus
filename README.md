# 🌱 Agri Loan Nexus  

An AI-enabled agricultural credit management system designed to bridge the loan access gap for small and marginal farmers. This platform empowers rural communities with **transparent loan applications, AI-powered credit scoring, multilingual support, and real-time loan tracking**.  

---

## ✨ Overview  

Agri Loan Nexus is a **full-stack web application** built with a **React + Vite frontend** and a **Node.js backend**.  
It digitizes the loan lifecycle—from **application to disbursement**—with features like credit scoring, subsidy integration, and AI chatbot assistance.  

This platform simplifies institutional credit access for farmers, reduces dependency on moneylenders, and aligns with national missions like **Digital India** and **Atmanirbhar Bharat**.  

---

## 📑 Table of Contents  
- [Features](#-features)  
- [Tech Stack](#-tech-stack)  
- [Project Structure](#-project-structure)  
- [Setup Instructions](#-setup-instructions)  
- [Environment Variables](#-environment-variables)  
- [Scripts](#-scripts)  
- [API Endpoints](#-api-endpoints)  
- [Contribution Guidelines](#-contribution-guidelines)  
- [Troubleshooting](#-troubleshooting)  
- [License](#-license)  
- [Authors](#-authors)  

---

## 🔑 Features  
- **User Authentication** – Farmers, verifiers, and admins with role-based access.  
- **AI-Powered Credit Scoring** – ML models to assess eligibility & assign credit limits.  
- **Loan Management** – Apply, track, and manage loans in real-time.  
- **Smart Credit Card Module** – Virtual QR/NFC-enabled e-credit cards for purchases.  
- **Subsidy Integration** – Auto-apply eligible subsidies during transactions.  
- **Multilingual Support** – Regional language & chatbot assistance.  
- **Dashboards** – Farmers, Verifiers, and Admin dashboards with analytics.  
- **Payment & Transactions** – Secure payments via UPI/e-RUPI APIs.  
- **Responsive Design** – Built with React + Tailwind CSS for mobile and desktop.  

---

## 🛠️ Tech Stack  

### Frontend  
- React (Vite)  
- Tailwind CSS  
- React Router DOM  
- Axios  
- Dialogflow/OpenAI (Chatbot)  

### Backend  
- Node.js + Express  
- Supabase (Auth + Realtime DB)  
- PostgreSQL  
- Firebase (sync)  
- Aadhaar API (eKYC)  
- UPI/e-RUPI APIs  
- Jest & Postman (testing)  

---

## 📂 Project Structure  

```bash
Agri-Loan-Nexus/
├── client/            # React frontend (Vite + Tailwind)
│   ├── src/
│   ├── public/
│   └── package.json
└── server/            # Node.js backend
    ├── config/
    ├── controllers/
    ├── routes/
    ├── models/
    ├── server.js
    └── package.json
```

⚙️ Setup Instructions  
```
# Clone the repository
git clone https://github.com/PavanRJadhav/agri-loan-nexus.git

# Move into the project folder
cd agri-loan-nexus

# Backend (Server)
cd server
npm install
npm run start   # or: npm run dev (with nodemon)

# Frontend (Client)
cd ../client
npm install
npm run dev
```
## 🔐 Environment Variables  

```env
PORT=5000
DATABASE_URL=your_postgres_url
SUPABASE_KEY=your_supabase_key
AADHAAR_API_KEY=your_aadhaar_key
UPI_API_KEY=your_upi_key
JWT_SECRET=your_secret
```

---

### Client  
Handled via Vite environment variables.  

---

## 📜 Scripts  

### Backend  
- `npm run start` – Start the server  
- `npm run dev` – Start with nodemon  

### Frontend  
- `npm run dev` – Start Vite dev server  
- `npm run build` – Build for production  
- `npm run preview` – Preview production build  

---

## 📡 API Endpoints  

| Endpoint       | Method | Description                   |
|----------------|--------|-------------------------------|
| `/api/farmers` | CRUD   | Farmer registration & profile |
| `/api/loans`   | CRUD   | Loan application & tracking   |
| `/api/verifier`| CRUD   | Verifier actions              |
| `/api/admin`   | CRUD   | Admin dashboard + analytics   |
| `/api/chatbot` | POST   | AI chatbot responses          |

---

## 🤝 Contribution Guidelines  
1. Fork the repo  
2. Create your branch (`git checkout -b feature/new-feature`)  
3. Commit changes (`git commit -m 'Add feature'`)  
4. Push branch (`git push origin feature/new-feature`)  
5. Open a Pull Request  

---

## 🐞 Troubleshooting  
- **Database not connecting** → Check `DATABASE_URL` in `.env`  
- **API errors** → Ensure Aadhaar/UPI API keys are correct  
- **Auth issues** → Verify Supabase keys  
- **Port in use** → Change `PORT` in `.env`  

---

## 📜 License  
This project is licensed under the **ISC License**.  

---

## 👨‍💻 Authors  
      GitHub:@PavanRJadhav
-     
