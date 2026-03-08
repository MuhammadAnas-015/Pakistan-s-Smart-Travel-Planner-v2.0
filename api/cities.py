import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from models import RouteRequest, RouteResponse, RouteSegment, CitiesResponse, CityInfo, AllRoutesResponse
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
for route in ROUTES:
    tp.add_route(*route)


@app.get("/api/cities", response_model=CitiesResponse)
async def get_cities():
    cities = [
        CityInfo(name=city, coordinates=coords)
        for city, coords in COORDS.items()
    ]
    return CitiesResponse(cities=cities)


handler = Mangum(app, lifespan="off")
