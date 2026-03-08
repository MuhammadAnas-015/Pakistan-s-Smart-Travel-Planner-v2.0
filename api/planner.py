from .graph import Graph
from .algorithms import dijkstra, bfs

class TravelPlanner:
    def __init__(self):
        self.graph = Graph()

    def add_city(self, name):
        self.graph.add_city(name)

    def add_route(self, c1, c2, d, c):
        self.graph.add_route(c1, c2, d, c)

    def get_path(self, start, end, type='dist'):
        return dijkstra(self.graph, start, end, type)

    def all_cities(self):
        return sorted(list(self.graph.adj.keys()))

    def set_traffic(self, c1, c2, factor):
        return self.graph.update_traffic(c1, c2, factor)
