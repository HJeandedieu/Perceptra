# PERCEPTRA

**AI-Powered Surveillance & Threat Detection System**  
Submitted to: TechRobotics Competition Rwanda | Implementation Period: 3 Months

---

## 📋 Project Overview

Perceptra is an intelligent, AI-powered surveillance and threat detection system that uses computer vision, machine learning, and real-time data analytics to autonomously identify threats, detect anomalous behavior, and generate actionable alerts.

---

## 🏗️ Architecture

```
Perceptra/
├── frontend/       # React + Tailwind dashboard (Dorcas & Niel)
├── backend/        # Node.js + Express API (Albert)
├── ai/             # Python + YOLOv8 inference (Hashimweyesu Jean de Dieu)
├── docs/           # Documentation
├── README.md
└── TEAM_COLLABORATION_GUIDE.md
```

---

## 👥 Team

| Member | Role |
|--------|------|
| Hashimweyesu Jean de Dieu | Project Lead & AI Engineer |
| Dorcas | Frontend Developer (Live Feed + Alerts) |
| Albert | Backend API Developer |
| Isabelle | Database + Alert System |
| Niel | Frontend Developer (Auth + Analytics) + Documentation |

---

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5174

### Backend
```bash
cd backend
npm install
# Copy .env.example to .env and configure
npm run dev
```
Runs on http://localhost:8000

### AI Engine
```bash
cd ai
pip install -r requirements.txt
# Copy .env.example to .env and configure
python src/main.py
```

---

## 📚 Documentation

- [Team Collaboration Guide](./TEAM_COLLABORATION_GUIDE.md)
- [Frontend README](./frontend/README.md)
