import assert from 'node:assert/strict';
import { test } from 'node:test';
import { aStarGraph, traceAStar } from '../utils/aStar.js';
import { traceSearch } from '../utils/uninformedSearch.js';

test('A* follows minimum f, reaches the optimal path, and avoids the expensive branch', () => {
  const trace = traceAStar(aStarGraph);
  const end = trace.at(-1);
  assert.equal(end.phase, 'found');
  assert.equal(end.current.cost, 5);
  assert.deepEqual(end.path, ['S', 'A', 'D', 'E', 'G']);
  assert.deepEqual(end.expanded, ['S', 'A', 'D', 'E']);
  for (const state of trace) {
    const scores = state.frontier.map(entry => entry.priority);
    assert.deepEqual(scores, [...scores].sort((a, b) => a - b));
    for (const entry of Object.values(state.reached)) assert.equal(entry.priority, entry.cost + entry.heuristic);
  }
  assert.deepEqual(trace[0].frontier.map(entry => entry.node), ['S']);
  const h = Object.fromEntries(aStarGraph.nodes.map(node => [node.id, node.heuristic]));
  for (const edge of aStarGraph.edges) assert.ok(h[edge.from] <= edge.cost + h[edge.to]);
});

test('zero heuristic reproduces UCS including its goal cost improvement', () => {
  const graph = { ...aStarGraph, nodes: aStarGraph.nodes.map(node => ({ ...node, heuristic: 0 })) };
  const astar = traceAStar(graph);
  const ucs = traceSearch(graph, 'ucs');
  assert.deepEqual(astar.map(s => [s.phase, s.current?.node]), ucs.map(s => [s.phase, s.current?.node]));
  assert.equal(astar.find(s => s.phase === 'discover' && s.edge.to === 'G').reached.G.cost, 14);
  assert.equal(astar.find(s => s.phase === 'improve').reached.G.cost, 5);
});

test('an admissible inconsistent heuristic reopens an expanded state', () => {
  const graph = { start: 'S', goal: 'G', nodes: [
    { id: 'S', heuristic: 0 }, { id: 'A', heuristic: 0 }, { id: 'B', heuristic: 3 }, { id: 'G', heuristic: 0 },
  ], edges: [
    { from: 'S', to: 'A', cost: 3 }, { from: 'S', to: 'B', cost: 1 },
    { from: 'B', to: 'A', cost: 1 }, { from: 'A', to: 'G', cost: 3 },
  ] };
  const trace = traceAStar(graph);
  assert.deepEqual(trace.at(-1).expanded, ['S', 'A', 'B', 'A']);
  assert.deepEqual(trace.at(-1).path, ['S', 'B', 'A', 'G']);
  assert.equal(trace.at(-1).current.cost, 5);
  assert.equal(trace.find(s => s.phase === 'discover' && s.edge.to === 'G').reached.G.cost, 6);
});

test('cycles, unreachable goals, start at goal and invalid inputs', () => {
  const graph = { start: 'S', goal: 'G', nodes: [{ id: 'S', heuristic: 0 }, { id: 'G', heuristic: 0 }], edges: [{ from: 'S', to: 'S', cost: 0 }] };
  assert.equal(traceAStar(graph).at(-1).phase, 'failed');
  assert.equal(traceAStar({ ...graph, goal: 'S' }).at(-1).current.cost, 0);
  assert.throws(() => traceAStar({ ...graph, nodes: [{ id: 'S', heuristic: NaN }] }));
  assert.throws(() => traceAStar({ ...graph, edges: [{ from: 'S', to: 'G', cost: -1 }] }));
});
