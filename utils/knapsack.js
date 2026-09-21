export const supplies = [
  { name: 'Emergency blanket', weight: 2, value: 4 },
  { name: 'First aid kit', weight: 3, value: 2 },
  { name: 'Radio', weight: 4, value: 10 },
  { name: 'Water filter', weight: 5, value: 9 },
  { name: 'Medicine pack', weight: 6, value: 11 },
];

export function solveKnapsack(items, capacity, original = false) {
  const table = Array.from({ length: items.length + 1 }, () => Array(capacity + 1).fill(0));
  for (let i = 1; i <= items.length; i++) {
    const { weight, value } = items[i - 1];
    for (let c = 0; c <= capacity; c++) {
      table[i][c] = weight > c
        ? (original ? 0 : table[i - 1][c])
        : Math.max(table[i - 1][c], value + table[i - 1][c - weight]);
    }
  }
  return table;
}

export function recoverItems(table, items, capacity) {
  const selected = [];
  let c = capacity;
  for (let i = items.length; i > 0; i--) {
    if (table[i][c] !== table[i - 1][c]) {
      selected.unshift(i - 1);
      c -= items[i - 1].weight;
    }
  }
  return selected;
}
