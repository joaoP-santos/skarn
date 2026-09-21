import { searchGraph } from './uninformedSearch.js';

// Consistent lower bounds on the remaining cost to G.
const heuristics = { S: 4, A: 3, B: 7, C: 5, D: 2, E: 1, F: 6, H: 4, I: 4, J: 6, K: 3, L: 5, M: 3, G: 0 };
export const aStarGraph = {
  ...searchGraph,
  nodes: searchGraph.nodes.map(node => ({ ...node, heuristic: heuristics[node.id] })),
};

export function traceAStar(graph) {
  const estimates = new Map(graph.nodes.map(node => [node.id, node.heuristic]));
  if (!estimates.has(graph.start) || estimates.get(graph.goal) !== 0 ||
      [...estimates.values()].some(h => !Number.isFinite(h) || h < 0) ||
      graph.edges.some(edge => !estimates.has(edge.from) || !estimates.has(edge.to) || !Number.isFinite(edge.cost) || edge.cost < 0)) {
    throw new Error('A* requires known nodes, finite nonnegative costs and heuristics, and h(goal) = 0');
  }
  const makeEntry = (node, cost, path) => ({ node, cost, path, depth: path.length - 1, heuristic: estimates.get(node), priority: cost + estimates.get(node) });
  const frontier = [makeEntry(graph.start, 0, [graph.start])];
  const reached = new Map([[graph.start, frontier[0]]]);
  const expanded = [];
  const trace = [];
  let current = null;
  const snapshot = (phase, edge = null) => trace.push({
    phase, edge, current, frontier: [...frontier], expanded: [...expanded],
    reached: Object.fromEntries(reached), path: current ? [...current.path] : [],
  });
  snapshot('ready');
  while (frontier.length) {
    current = frontier.shift();
    if (current.node === graph.goal) {
      snapshot('found');
      return trace;
    }
    snapshot('select');
    const edges = graph.edges.filter(edge => edge.from === current.node).sort((a, b) => a.to.localeCompare(b.to));
    for (const edge of edges) {
      const cost = current.cost + edge.cost;
      const previous = reached.get(edge.to);
      if (previous && previous.cost <= cost) {
        snapshot('skip', edge);
        continue;
      }
      const entry = makeEntry(edge.to, cost, [...current.path, edge.to]);
      reached.set(edge.to, entry);
      const index = frontier.findIndex(item => item.node === entry.node);
      if (index >= 0) frontier[index] = entry;
      else frontier.push(entry); // Reopen expanded states if a cheaper path is found.
      frontier.sort((a, b) => a.priority - b.priority); // Stable insertion-order ties.
      snapshot(previous ? 'improve' : 'discover', edge);
    }
    expanded.push(current.node);
    snapshot('expand');
  }
  current = null;
  snapshot('failed');
  return trace;
}
