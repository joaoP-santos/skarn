import assert from 'node:assert/strict';
import { test } from 'node:test';
import { manhattanDistance, manhattanGraph } from '../utils/manhattanGrid.js';
import { traceAStar } from '../utils/aStar.js';

test('Manhattan values are coordinate-derived and every move is orthogonal with unit cost', () => {
  const nodes = Object.fromEntries(manhattanGraph.nodes.map(node => [node.id, node]));
  assert.equal(nodes[manhattanGraph.start].heuristic, 8);
  assert.equal(nodes[manhattanGraph.goal].heuristic, 0);
  for (const node of manhattanGraph.nodes) assert.equal(node.heuristic, Math.abs(node.x - 9) + Math.abs(node.y - 4));
  for (const edge of manhattanGraph.edges) {
    assert.equal(edge.cost, 1);
    assert.equal(manhattanDistance(nodes[edge.from], nodes[edge.to]), 1);
    assert.ok(nodes[edge.from].heuristic <= 1 + nodes[edge.to].heuristic);
    assert.ok(!nodes[edge.from].wall && !nodes[edge.to].wall);
  }
});

test('A* takes the optimal wall detour, independently checked with BFS', () => {
  const distances = new Map([[manhattanGraph.goal, 0]]);
  const queue = [manhattanGraph.goal];
  for (let i = 0; i < queue.length; i++) {
    for (const edge of manhattanGraph.edges.filter(edge => edge.from === queue[i])) {
      if (distances.has(edge.to)) continue;
      distances.set(edge.to, distances.get(edge.from) + 1);
      queue.push(edge.to);
    }
  }
  for (const node of manhattanGraph.nodes) assert.ok(node.heuristic <= distances.get(node.id));
  const result = traceAStar(manhattanGraph).at(-1);
  assert.equal(result.phase, 'found');
  assert.equal(result.current.cost, distances.get(manhattanGraph.start));
  assert.equal(result.current.cost, 18);
  assert.equal(result.path.length, 19);
  for (let i = 1; i < result.path.length; i++) {
    assert.ok(manhattanGraph.edges.some(edge => edge.from === result.path[i - 1] && edge.to === result.path[i]));
  }
});
