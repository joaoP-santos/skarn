import assert from 'node:assert/strict';
import { test } from 'node:test';
import { searchGraph, traceSearch } from '../utils/uninformedSearch.js';

test('the same graph separates depth-first, fewest-edge and cheapest paths', () => {
  const expected = { dfs: [['S', 'A', 'C', 'H', 'G'], 16], bfs: [['S', 'B', 'G'], 14], ucs: [['S', 'A', 'D', 'E', 'G'], 5] };
  for (const [algorithm, [path, cost]] of Object.entries(expected)) {
    const trace = traceSearch(searchGraph, algorithm);
    assert.equal(trace.at(-1).phase, 'found');
    assert.deepEqual(trace.at(-1).path, path);
    assert.equal(trace.at(-1).current.cost, cost);
    assert.deepEqual(trace[0].frontier.map(entry => entry.node), ['S']);
  }
});

test('UCS replaces a discovered expensive goal and stops on removal', () => {
  const trace = traceSearch(searchGraph, 'ucs');
  const discovery = trace.find(step => step.phase === 'discover' && step.edge.to === 'G');
  const improvement = trace.find(step => step.phase === 'improve');
  assert.equal(discovery.reached.G.cost, 14);
  assert.equal(improvement.reached.G.cost, 5);
  assert.deepEqual(improvement.reached.G.path, ['S', 'A', 'D', 'E', 'G']);
  assert.equal(trace.at(-1).current.cost, 5);
  for (const step of trace) {
    assert.deepEqual(step.frontier.map(entry => entry.cost), step.frontier.map(entry => entry.cost).sort((a, b) => a - b));
  }
});

test('equal costs make BFS and UCS agree', () => {
  const graph = { ...searchGraph, edges: searchGraph.edges.map(edge => ({ ...edge, cost: 1 })) };
  for (const algorithm of ['bfs', 'ucs']) {
    const result = traceSearch(graph, algorithm).at(-1);
    assert.deepEqual(result.path, ['S', 'B', 'G']);
    assert.equal(result.current.cost, 2);
  }
});

test('cycles, zero-cost edges, stable ties, and unreachable goals terminate', () => {
  const graph = { start: 'S', goal: 'G', edges: [
    { from: 'S', to: 'A', cost: 0 }, { from: 'A', to: 'S', cost: 0 },
    { from: 'S', to: 'B', cost: 0 },
  ] };
  for (const algorithm of ['dfs', 'bfs', 'ucs']) {
    const trace = traceSearch(graph, algorithm);
    assert.equal(trace.at(-1).phase, 'failed');
    assert.deepEqual(trace.at(-1).expanded, ['S', 'A', 'B']);
  }
});

test('start equal to goal succeeds without expansion and invalid costs are rejected', () => {
  for (const algorithm of ['dfs', 'bfs', 'ucs']) {
    const result = traceSearch({ start: 'S', goal: 'S', edges: [] }, algorithm).at(-1);
    assert.equal(result.phase, 'found');
    assert.equal(result.current.cost, 0);
    assert.deepEqual(result.expanded, []);
  }
  assert.throws(() => traceSearch({ ...searchGraph, edges: [{ from: 'S', to: 'G', cost: -1 }] }, 'ucs'));
});


test('the expanded example contains reachable branches, a skipped cycle, and a dead end', () => {
  const ids = new Set(searchGraph.nodes.map(node => node.id));
  assert.equal(ids.size, 14);
  const reached = new Set([searchGraph.start]);
  for (const id of reached) {
    for (const edge of searchGraph.edges.filter(edge => edge.from === id)) {
      assert.ok(ids.has(edge.to));
      reached.add(edge.to);
    }
  }
  assert.deepEqual(reached, ids);
  assert.ok(!searchGraph.edges.some(edge => edge.from === 'M'));
  assert.ok(traceSearch(searchGraph, 'dfs').some(step => step.phase === 'skip' && step.edge.from === 'H' && step.edge.to === 'A'));
});
