const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface City {
    name: string;
    coordinates: [number, number];
}

export interface RouteSegment {
    from_city: string;
    to_city: string;
    distance: number;
    cost: number;
}

export interface RouteResponse {
    success: boolean;
    path?: string[];
    total_distance?: number;
    total_cost?: number;
    segments?: RouteSegment[];
    error?: string;
}

export interface CitiesResponse {
    cities: City[];
}

export interface RouteData {
    from: string;
    to: string;
    from_coords: [number, number];
    to_coords: [number, number];
    distance: number;
    cost: number;
}

export interface AllRoutesResponse {
    routes: RouteData[];
}

export async function fetchRoute(
    source: string,
    destination: string,
    mode: 'dist' | 'cost'
): Promise<RouteResponse> {
    const response = await fetch(`${API_URL}/api/route`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source, destination, mode }),
    });

    if (!response.ok) {
        throw new Error('Failed to fetch route');
    }

    return response.json();
}

export async function fetchCities(): Promise<CitiesResponse> {
    const response = await fetch(`${API_URL}/api/cities`);

    if (!response.ok) {
        throw new Error('Failed to fetch cities');
    }

    return response.json();
}

export async function fetchAllRoutes(): Promise<AllRoutesResponse> {
    const response = await fetch(`${API_URL}/api/all-routes`);

    if (!response.ok) {
        throw new Error('Failed to fetch routes');
    }

    return response.json();
}
