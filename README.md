# 🌍 Pakistan Routes - Enterprise Travel Planner

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-cyan.svg)

A modern, high-performance web application for planning travel routes across major cities in Pakistan. Built with industry-standard technologies to demonstrate advanced Data Structures & Algorithms concepts.

## ✨ Key Features

### 🎨 Modern UI/UX
- **Premium Dark Theme**: Cyberpunk-inspired aesthetic with cyan/blue gradients.
- **Glassmorphism**: Advanced frosted glass effects for a sleek look.
- **Interactive Map**: Custom-styled Leaflet map with glowing routes and markers.
- **Responsive Design**: Fully responsive layout that works on all devices.

### 🚀 Advanced Routing
- **Dijkstra's Algorithm**: Real-time shortest path calculation.
- **Multi-Mode Optimization**: 
  - ⚡ **Shortest Path**: Minimize travel distance.
  - 💰 **Cheapest Route**: Minimize travel cost.
- **Instant Calculation**: Sub-millisecond response times powered by FastAPI.

### 📊 Rich Data Visualization
- **Dynamic Route Rendering**: Glowing polylines showing the exact path.
- **Smart Markers**: Color-coded markers for Start (Green), End (Red), and Waypoints (Cyan).
- **Detailed Itinerary**: Step-by-step breakdown of the journey with distance and cost.
- **PDF Export**: Generate professional travel itineraries in PDF format.

## 🛠️ Tech Stack

### Backend (Python)
- **Framework**: FastAPI
- **Validation**: Pydantic
- **Performance**: Uvicorn
- **Architecture**: RESTful API

### Frontend (TypeScript)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Custom Animations
- **State Management**: TanStack Query (React Query)
- **Maps**: React-Leaflet
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/pakistan-routes.git
cd pakistan-routes
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
Backend will be available at `http://localhost:8000`

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at `http://localhost:3000`

## 📚 API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for the interactive Swagger UI documentation.

### Endpoints
- `GET /api/cities`: Get list of all available cities.
- `GET /api/all-routes`: Get all connections in the network.
- `POST /api/route`: Calculate optimal route between two cities.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Developed with ❤️ by [Your Name]
