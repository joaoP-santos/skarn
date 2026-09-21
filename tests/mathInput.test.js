import assert from "node:assert/strict";
import { mathInputToLatex } from "../utils/mathInput.js";

assert.equal(mathInputToLatex("sqrt3/2pi"), String.raw`\frac{\sqrt{3}}{2}\pi`);
assert.equal(mathInputToLatex("(1+cos(2x))/2"), String.raw`\frac{\left(1+\cos\left(2x\right)\right)}{2}`);
assert.equal(mathInputToLatex("sin^2(x)+cos^2(x)"), String.raw`\sin^{2}\left(x\right)+\cos^{2}\left(x\right)`);
assert.equal(mathInputToLatex("1/sqrt(2)"), String.raw`\frac{1}{\sqrt{\left(2\right)}}`);
console.log("math input: 4 cases passed");
