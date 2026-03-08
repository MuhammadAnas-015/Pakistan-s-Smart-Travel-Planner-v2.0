from pydantic import BaseModel, Field
from typing import List, Optional

class RouteRequest(BaseModel):
    source: str = Field(..., description="Starting city name")
    destination: str = Field(..., description="Destination city name")
    mode: str = Field(default="dist", description="Search mode: 'dist' for shortest or 'cost' for cheapest")

class RouteSegment(BaseModel):
    from_city: str
    to_city: str
    distance: float
    cost: float

class RouteResponse(BaseModel):
    success: bool
    path: Optional[List[str]] = None
    total_distance: Optional[float] = None
    total_cost: Optional[float] = None
    segments: Optional[List[RouteSegment]] = None
    error: Optional[str] = None

class CityInfo(BaseModel):
    name: str
    coordinates: List[float]

class CitiesResponse(BaseModel):
    cities: List[CityInfo]

class AllRoutesResponse(BaseModel):
    routes: List[dict]
