import streamlit as st
from planner import TravelPlanner
import folium
from streamlit_folium import st_folium

st.set_page_config(page_title="Pakistan's Smart Travel Planner", layout="wide")

COORDS = {
    "Karachi": [24.8607, 67.0011],
    "Hyderabad": [25.3960, 68.3578],
    "Moro": [26.6631, 68.0000],
    "Sukkur": [27.7244, 68.8228],
    "Rahim Yar Khan": [28.4202, 70.2989],
    "Bahawalpur": [29.3544, 71.6911],
    "Multan": [30.1575, 71.5249],
    "Sahiwal": [30.6682, 73.1114],
    "Lahore": [31.5204, 74.3587],
    "Faisalabad": [31.4504, 73.1350],
    "Sargodha": [32.0740, 72.6861],
    "Gujranwala": [32.1877, 74.1945],
    "Jhelum": [32.9328, 73.7257],
    "Rawalpindi": [33.5651, 73.0169],
    "Islamabad": [33.6844, 73.0479],
    "Peshawar": [34.0151, 71.5249],
    "Quetta": [30.1798, 66.9750]
}

ROUTES = [
    ("Karachi", "Hyderabad", 165, 800),
    ("Hyderabad", "Moro", 160, 750),
    ("Moro", "Sukkur", 145, 700),
    ("Sukkur", "Rahim Yar Khan", 180, 950),
    ("Rahim Yar Khan", "Bahawalpur", 200, 1100),
    ("Bahawalpur", "Multan", 100, 500),
    ("Multan", "Sahiwal", 170, 850),
    ("Sahiwal", "Lahore", 175, 900),
    ("Multan", "Faisalabad", 240, 1200),
    ("Faisalabad", "Lahore", 185, 950),
    ("Lahore", "Gujranwala", 100, 450),
    ("Gujranwala", "Jhelum", 100, 500),
    ("Jhelum", "Rawalpindi", 120, 600),
    ("Rawalpindi", "Islamabad", 20, 150),
    ("Faisalabad", "Sargodha", 100, 450),
    ("Sargodha", "Rawalpindi", 200, 1000),
    ("Rawalpindi", "Peshawar", 170, 900),
    ("Karachi", "Quetta", 700, 3500),
    ("Quetta", "Multan", 600, 3000),
    ("Sukkur", "Multan", 440, 2200),
]

if 'tp' not in st.session_state:
    tp = TravelPlanner()
    for r in ROUTES: tp.add_route(*r)
    st.session_state.tp = tp
    st.session_state.current_path = None
    st.session_state.current_val = 0

tp = st.session_state.tp

st.title("Pakistan's Smart Travel Planner")

col_menu, col_map = st.columns([1, 2])

with col_menu:
    st.subheader("Menu")
    cities = sorted(list(COORDS.keys()))
    start = st.selectbox("From", cities)
    end = st.selectbox("To", cities)
    mode = st.radio("Search By", ["Shortest (km)", "Cheapest (PKR)"])
    m_key = 'dist' if "Shortest" in mode else 'cost'
    
    if st.button("Calculate", use_container_width=True):
        if start == end:
            st.warning("Start and End are same")
            st.session_state.current_path = None
        else:
            path, val = tp.get_path(start, end, m_key)
            st.session_state.current_path = path
            st.session_state.current_val = val
            if not path:
                st.error("No path found")
    
    if st.session_state.current_path:
        st.divider()
        st.write(f"Path: {' -> '.join(st.session_state.current_path)}")
        st.metric(label=f"Total {mode}", value=f"{st.session_state.current_val}")
        
        with st.expander("Details"):
            for i in range(len(st.session_state.current_path)-1):
                u, v = st.session_state.current_path[i], st.session_state.current_path[i+1]
                data = tp.graph.adj[u][v]
                st.write(f"{u} to {v}: {data['dist']} km | PKR {data['cost']}")

with col_map:
    m = folium.Map(location=[30.3753, 69.3451], zoom_start=5, tiles="CartoDB positron")
    seen = set()
    for u in tp.graph.adj:
        for v, data in tp.graph.adj[u].items():
            if (v, u) not in seen and u in COORDS and v in COORDS:
                folium.PolyLine([COORDS[u], COORDS[v]], color="#2980b9", weight=1.5, opacity=0.4).add_to(m)
                seen.add((u, v))

    if st.session_state.current_path:
        path_coords = [COORDS[city] for city in st.session_state.current_path if city in COORDS]
        folium.PolyLine(path_coords, color="#e74c3c", weight=6, opacity=1).add_to(m)
        folium.Marker(COORDS[st.session_state.current_path[0]], icon=folium.Icon(color='green')).add_to(m)
        folium.Marker(COORDS[st.session_state.current_path[-1]], icon=folium.Icon(color='red')).add_to(m)

    for city, coord in COORDS.items():
        folium.CircleMarker(location=coord, radius=4, popup=city, color="#34495e", fill=True).add_to(m)

    st_folium(m, width=800, height=600, key="map")

st.markdown("---")
st.info('Developed By M.Anas')
