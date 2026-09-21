export function manhattanDistance(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

const start = { x: 1, y: 4 };
const goal = { x: 9, y: 4 };
const walls = new Set([
  ...Array.from({ length: 7 }, (_, y) => `4,${y}`),
  ...Array.from({ length: 6 }, (_, y) => `7,${y + 3}`),
  '1,2', '2,2', '8,6', '9,6',
]);
const cells = Array.from({ length: 99 }, (_, index) => {
  const x = index % 11, y = Math.floor(index / 11);
  return { id: `${x},${y}`, x, y, heuristic: manhattanDistance({ x, y }, goal), wall: walls.has(`${x},${y}`) };
});
const nodes = cells.filter(cell => !cell.wall);
const open = new Set(nodes.map(node => node.id));

export const manhattanGraph = {
  start: `${start.x},${start.y}`, goal: `${goal.x},${goal.y}`,
  grid: { columns: 11, rows: 9, cells },
  nodes,
  edges: nodes.flatMap(node => [[1, 0], [-1, 0], [0, 1], [0, -1]]
    .map(([dx, dy]) => `${node.x + dx},${node.y + dy}`)
    .filter(id => open.has(id))
    .map(to => ({ from: node.id, to, cost: 1 }))),
};
