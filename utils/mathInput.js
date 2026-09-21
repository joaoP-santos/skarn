const functions = new Set(["sin", "cos", "tan", "sec", "csc", "cot"]);

function tokenize(source) {
  const tokens = [];
  const clean = source.replaceAll("θ", "theta").replaceAll("π", "pi").replaceAll("²", "^2").replace(/\s+/g, "").toLowerCase();
  for (let i = 0; i < clean.length;) {
    const rest = clean.slice(i); const word = rest.match(/^[a-z]+/); const number = rest.match(/^\d+(?:\.\d+)?/);
    if (word) { tokens.push(word[0]); i += word[0].length; }
    else if (number) { tokens.push(number[0]); i += number[0].length; }
    else { tokens.push(clean[i]); i++; }
  }
  return tokens;
}

export function mathInputToLatex(source) {
  const tokens = tokenize(source); let at = 0;
  const peek = () => tokens[at]; const take = () => tokens[at++];
  const beginsAtom = (token) => token && !["+", "-", "/", "*", "^", ")", "="].includes(token);

  function expression() {
    let value = term();
    while (["+", "-", "="].includes(peek())) { const op = take(); value += op + term(); }
    return value;
  }
  function term() {
    let value = power();
    while (at < tokens.length && (peek() === "/" || peek() === "*" || beginsAtom(peek()))) {
      if (peek() === "/") { take(); value = `\\frac{${value}}{${power() || "\\square"}}`; }
      else { if (peek() === "*") take(); value += power(); }
    }
    return value;
  }
  function power() {
    let value = atom();
    while (peek() === "^") { take(); value += `^{${atom() || "\\square"}}`; }
    return value;
  }
  function atom() {
    const token = take();
    if (!token) return "";
    if (token === "(") { const inside = expression(); if (peek() === ")") take(); return `\\left(${inside}\\right)`; }
    if (token === "sqrt") return `\\sqrt{${atom() || "\\square"}}`;
    if (token === "pi") return "\\pi";
    if (token === "theta") return "\\theta";
    if (functions.has(token)) {
      if (peek() === "(") { take(); const inside = expression(); if (peek() === ")") take(); return `\\${token}\\left(${inside}\\right)`; }
      return `\\${token}`;
    }
    if (token === "-") return "-" + atom();
    return token.replace(/[^a-z0-9.]/g, "");
  }
  return expression();
}
