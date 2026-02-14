class Graph:
    def __init__(self):
        self.adj = {}

    def add_city(self, name):
        if name and name not in self.adj:
            self.adj[name] = {}

    def add_route(self, u, v, dist, cost):
        self.add_city(u)
        self.add_city(v)
        data = {'dist': float(dist), 'cost': float(cost), 'base_dist': float(dist), 'traffic': 1.0}
        self.adj[u][v] = data.copy()
        self.adj[v][u] = data.copy()

    def get_neighbors(self, city):
        return self.adj.get(city, {})

    def update_traffic(self, u, v, factor):
        if u in self.adj and v in self.adj[u]:
            self.adj[u][v]['traffic'] = factor
            self.adj[v][u]['traffic'] = factor
            self.adj[u][v]['dist'] = self.adj[u][v]['base_dist'] * factor
            self.adj[v][u]['dist'] = self.adj[v][u]['base_dist'] * factor
            return self.adj[u][v]['dist']
        return None
