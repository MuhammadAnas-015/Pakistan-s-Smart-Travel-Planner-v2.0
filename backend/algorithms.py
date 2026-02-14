import heapq

def dijkstra(graph, start, end, mode='dist'):
    pq = [(0, start, [start])]
    visited = {}

    while pq:
        (total_weight, curr, path) = heapq.heappop(pq)

        if curr == end:
            return path, total_weight

        if curr in visited and visited[curr] <= total_weight:
            continue
        
        visited[curr] = total_weight

        for neighbor, data in graph.get_neighbors(curr).items():
            weight = data.get(mode, float('inf'))
            if neighbor not in visited or visited[neighbor] > total_weight + weight:
                heapq.heappush(pq, (total_weight + weight, neighbor, path + [neighbor]))

    return None, float('inf')

def bfs(graph, start):
    visited = {start}
    queue = [start]
    result = []
    while queue:
        curr = queue.pop(0)
        result.append(curr)
        for neighbor in graph.get_neighbors(curr):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return result
