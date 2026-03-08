import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from models import RouteRequest, RouteResponse, RouteSegment, CitiesResponse, CityInfo, AllRoutesResponse
from planner import TravelPlanner
from data import COORDS, ROUTES

app = FastAPI(
    title="Pakistan Travel Planner API",
    description="Enterprise-level pathfinding API for 17 Pakistani cities",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tp = TravelPlanner()
for route in ROUTES:
    tp.add_route(*route)

@app.get("/")
async def root():
    return {
        "message": "Pakistan Travel Planner API",
        "version": "2.0.0",
        "endpoints": {
            "route": "/api/route",
            "cities": "/api/cities",
            "all_routes": "/api/all-routes"
        }
    }

@app.post("/api/route", response_model=RouteResponse)
async def calculate_route(request: RouteRequest):
    try:
        if request.source not in COORDS:
            raise HTTPException(status_code=400, detail=f"Source city '{request.source}' not found")
        
        if request.destination not in COORDS:
            raise HTTPException(status_code=400, detail=f"Destination city '{request.destination}' not found")
        
        if request.source == request.destination:
            raise HTTPException(status_code=400, detail="Source and destination cannot be the same")
        
        if request.mode not in ["dist", "cost"]:
            raise HTTPException(status_code=400, detail="Mode must be 'dist' or 'cost'")
        
        path, total_value = tp.get_path(request.source, request.destination, request.mode)
        
        if not path:
            return RouteResponse(
                success=False,
                error="No route found between the specified cities"
            )
        
        segments = []
        total_distance = 0
        total_cost = 0
        
        for i in range(len(path) - 1):
            from_city = path[i]
            to_city = path[i + 1]
            edge_data = tp.graph.adj[from_city][to_city]
            
            segments.append(RouteSegment(
                from_city=from_city,
                to_city=to_city,
                distance=edge_data['dist'],
                cost=edge_data['cost']
            ))
            
            total_distance += edge_data['dist']
            total_cost += edge_data['cost']
        
        return RouteResponse(
            success=True,
            path=path,
            total_distance=round(total_distance, 2),
            total_cost=round(total_cost, 2),
            segments=segments
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/api/cities", response_model=CitiesResponse)
async def get_cities():
    cities = [
        CityInfo(name=city, coordinates=coords)
        for city, coords in COORDS.items()
    ]
    return CitiesResponse(cities=cities)

@app.get("/api/all-routes", response_model=AllRoutesResponse)
async def get_all_routes():
    routes = []
    seen = set()
    
    for u in tp.graph.adj:
        for v, data in tp.graph.adj[u].items():
            if (v, u) not in seen and u in COORDS and v in COORDS:
                routes.append({
                    "from": u,
                    "to": v,
                    "from_coords": COORDS[u],
                    "to_coords": COORDS[v],
                    "distance": data['dist'],
                    "cost": data['cost']
                })
                seen.add((u, v))
    
    return AllRoutesResponse(routes=routes)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

handler = Mangum(app)

