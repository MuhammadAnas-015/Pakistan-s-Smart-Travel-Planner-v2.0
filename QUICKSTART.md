# Quick Start Guide

## 🚀 Running the Application (Recommended)

To start both the Backend (FastAPI) and Frontend (Next.js) with a single action:

1.  **Double-click** `start.bat` in the project root.
2.  Wait for the browser to open automatically at `http://localhost:3000`.

---

## 🛠️ Manual Startup (Terminal)

### Terminal 1: Backend (FastAPI)
```bash
cd backend
..\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

### Terminal 2: Frontend (Next.js)
```bash
cd frontend
npm run dev
```

## 🎯 Testing the App

1. **Open** `http://localhost:3000` in your browser
2. **Select** a source city (e.g., "Karachi")
3. **Select** a destination city (e.g., "Islamabad")
4. **Choose** search mode: "Shortest (km)" or "Cheapest (PKR)"
5. **Click** "Calculate Route"
6. **View** the route on the map and details in the sidebar
7. **Export** as PDF using the button at the bottom

## 📁 Project Structure

```
travel_planner/
├── backend/          # FastAPI server (Python)
├── frontend/         # Next.js app (TypeScript)
└── legacy/           # Original Streamlit app
```

## 🛠️ Technologies

- **Backend**: FastAPI, Uvicorn, Pydantic
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, React Query
- **Maps**: React-Leaflet with dark theme
- **Algorithm**: Dijkstra's shortest path
- **Export**: jsPDF

## 📖 Documentation

- Full details: [README.md](file:///d:/projects/Dsa%20Project/travel_planner/README.md)
- Implementation: [implementation_plan.md](file:///C:/Users/anass/.gemini/antigravity/brain/6c74d82d-ee9f-4dd1-bf54-fc4167ba2050/implementation_plan.md)
- Walkthrough: [walkthrough.md](file:///C:/Users/anass/.gemini/antigravity/brain/6c74d82d-ee9f-4dd1-bf54-fc4167ba2050/walkthrough.md)

---

**Developed by M.Anas**
