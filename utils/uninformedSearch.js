export const searchGraph = {
  start: 'S', goal: 'G',
  nodes: [
    { id: 'S', x: 60, y: 250 },
    { id: 'A', x: 240, y: 120 }, { id: 'B', x: 240, y: 380 },
    { id: 'C', x: 430, y: 60 }, { id: 'D', x: 430, y: 220 }, { id: 'F', x: 430, y: 390 },
    { id: 'H', x: 630, y: 60 }, { id: 'I', x: 630, y: 320 }, { id: 'J', x: 630, y: 490 },
    { id: 'E', x: 830, y: 200 }, { id: 'K', x: 830, y: 350 }, { id: 'L', x: 830, y: 490 },
    { id: 'G', x: 1050, y: 250 }, { id: 'M', x: 1050, y: 490 },
  ],
  edges: [
    { from: 'S', to: 'A', cost: 1 }, { from: 'S', to: 'B', cost: 2 },
    { from: 'A', to: 'C', cost: 5 }, { from: 'A', to: 'D', cost: 2 },
    { from: 'B', to: 'F', cost: 1 }, { from: 'B', to: 'G', cost: 12, via: { x: 660, y: 1000 } },
    { from: 'C', to: 'H', cost: 2 },
    { from: 'H', to: 'A', cost: 1, via: { x: 440, y: -65 } }, { from: 'H', to: 'G', cost: 8 },
    { from: 'D', to: 'E', cost: 1 }, { from: 'D', to: 'I', cost: 2 },
    { from: 'F', to: 'I', cost: 2 }, { from: 'F', to: 'J', cost: 3 },
    { from: 'I', to: 'E', cost: 3 }, { from: 'I', to: 'K', cost: 1 },
    { from: 'J', to: 'F', cost: 1, via: { x: 470, y: 540 } }, { from: 'J', to: 'L', cost: 1 },
    { from: 'E', to: 'G', cost: 1 }, { from: 'E', to: 'K', cost: 2 },
    { from: 'K', to: 'G', cost: 3 }, { from: 'L', to: 'K', cost: 2 },
    { from: 'L', to: 'M', cost: 3 },
  ],
};

export const searchAlgorithms = {
  dfs: { name: 'Depth-first search', structure: 'Stack · LIFO', rule: 'Take the newest entry. Follow one branch before trying another.', takeaway: 'DFS finds a path, but does not guarantee the fewest edges or the lowest cost.' },
  bfs: { name: 'Breadth-first search', structure: 'Queue · FIFO', rule: 'Take the oldest entry. Explore one depth level at a time.', takeaway: 'BFS guarantees the fewest edges. That is also cheapest only when all edge costs are equal.' },
  ucs: { name: 'Uniform-cost search', structure: 'Priority queue · minimum g(n)', rule: 'Take the entry with the lowest total cost from S.', takeaway: 'UCS guarantees minimum path cost with nonnegative edges on this finite graph. In an infinite search space, completeness needs finite branching and costs bounded above zero.' },
};

// The frontier is always stored in removal order, including stack top first.
// Snapshots are independent, allowing deterministic forward/backward playback.
export function traceSearch(graph, algorithm) {
  if (!searchAlgorithms[algorithm]) throw new Error('Unknown search algorithm');
  if (graph.edges.some(edge => !Number.isFinite(edge.cost) || edge.cost < 0)) {
    throw new Error('Search visualizations require finite nonnegative edge costs');
  }
  let frontier = [{ node: graph.start, cost: 0, depth: 0, path: [graph.start] }];
  const reached = new Map([[graph.start, frontier[0]]]);
  const expanded = [];
  const snapshots = [];
  let current = null;
  const record = (phase, message, edge = null) => snapshots.push({
    phase, message, edge, current,
    frontier: frontier.map(entry => ({ ...entry, path: [...entry.path] })),
    expanded: [...expanded],
    reached: Object.fromEntries([...reached].map(([id, entry]) => [id, { ...entry, path: [...entry.path] }])),
    path: current ? [...current.path] : [],
  });
  record('ready', `Start at ${graph.start}. The frontier contains one path with depth 0 and cost 0.`);
  while (frontier.length) {
    current = frontier.shift();
    if (current.node === graph.goal) {
      record('found', `Remove ${graph.goal} from the frontier: goal found! ${current.depth} edges, total cost ${current.cost}.`);
      return snapshots;
    }
    record('select', `Remove ${current.node}: ${algorithm === 'ucs' ? `lowest total cost g = ${current.cost}` : algorithm === 'bfs' ? `oldest entry, depth ${current.depth}` : 'top of the stack'}. It is not the goal; examine its outgoing edges.`);
    // Reverse pushes make alphabetically first successors sit on top of DFS's stack.
    const neighbors = graph.edges.filter(edge => edge.from === current.node)
      .sort((a, b) => a.to.localeCompare(b.to));
    if (algorithm === 'dfs') neighbors.reverse();
    for (const edge of neighbors) {
      const cost = current.cost + edge.cost;
      const previous = reached.get(edge.to);
      const calculation = `g(${edge.to}) = ${current.cost} + ${edge.cost} = ${cost}`;
      if (previous && (algorithm !== 'ucs' || cost >= previous.cost)) {
        record('skip', `${current.node} → ${edge.to}: ${calculation}. ${algorithm === 'ucs' ? `Keep the existing cost ${previous.cost}; this is not cheaper.` : 'Already discovered; skip this duplicate state.'}`, edge);
        continue;
      }
      const entry = { node: edge.to, cost, depth: current.depth + 1, path: [...current.path, edge.to] };
      reached.set(edge.to, entry);
      if (algorithm === 'dfs') frontier.unshift(entry);
      else if (previous) frontier = frontier.map(item => item.node === edge.to ? entry : item);
      else frontier.push(entry);
      // Stable ties preserve frontier insertion order.
      if (algorithm === 'ucs') frontier.sort((a, b) => a.cost - b.cost);
      record(previous ? 'improve' : 'discover', `${current.node} → ${edge.to}: ${calculation}. ${previous ? `Replace its frontier cost ${previous.cost} with ${cost} and update its path.` : `Add ${edge.to} to the ${algorithm === 'dfs' ? 'top of the stack' : algorithm === 'bfs' ? 'back of the queue' : 'priority queue'}.`}${edge.to === graph.goal ? ' Goal discovered, but stop only when it is removed from the frontier.' : ''}`, edge);
    }
    expanded.push(current.node);
    record('expand', `Finished expanding ${current.node}.${frontier.length ? ` Next to remove: ${frontier[0].node}.` : ' The frontier is empty.'}`);
  }
  current = null;
  record('failed', 'The frontier is empty. No path to the goal exists.');
  return snapshots;
}
