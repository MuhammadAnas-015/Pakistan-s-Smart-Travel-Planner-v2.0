import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from models import AllRoutesResponse
from planner import TravelPlanner
from data import COORDS, ROUTES

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tp = TravelPlanner()
for r in ROUTES:
    tp.add_route(*r)


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


handler = Mangum(app, lifespan="off")
