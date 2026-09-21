<script setup>
defineProps({ compact: { type: Boolean, default: false } });
</script>

<template>
  <figure class="coordinate-diagram" :class="{ compact }">
    <svg viewBox="0 0 520 310" role="img" aria-labelledby="coordinate-title coordinate-desc">
      <title id="coordinate-title">Trigonometric coordinate diagram</title>
      <desc id="coordinate-desc">A point P x y joined to the origin by radius r, forming a right triangle with horizontal side x and vertical side y.</desc>
      <defs>
        <marker id="axis-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#71807d" /></marker>
      </defs>
      <line class="axis" x1="36" y1="255" x2="492" y2="255" marker-end="url(#axis-arrow)" />
      <line class="axis" x1="92" y1="286" x2="92" y2="25" marker-end="url(#axis-arrow)" />
      <line class="triangle radius" x1="92" y1="255" x2="390" y2="72" />
      <line class="triangle" x1="92" y1="255" x2="390" y2="255" />
      <line class="triangle vertical" x1="390" y1="255" x2="390" y2="72" />
      <path class="angle" d="M150 255 A58 58 0 0 0 141 225" />
      <path class="right-angle" d="M372 255 L372 237 L390 237" />
      <circle cx="92" cy="255" r="5" /><circle cx="390" cy="72" r="6" />
      <text class="label point" x="401" y="65">P(x, y)</text>
      <text class="label" x="238" y="278">x</text>
      <text class="label" x="409" y="171">y</text>
      <text class="label radius-label" x="226" y="139">r</text>
      <text class="label" x="145" y="232">θ</text>
      <text class="axis-label" x="484" y="278">x</text><text class="axis-label" x="69" y="35">y</text>
    </svg>
    <figcaption><b>Coordinates make the triangle.</b><span>The horizontal leg is <i>x</i>, the vertical leg is <i>y</i>, and the distance from the origin is <i>r = √(x² + y²)</i>.</span></figcaption>
  </figure>
</template>

<style scoped>
.coordinate-diagram{display:grid;grid-template-columns:minmax(280px,1.1fr) minmax(220px,.9fr);align-items:center;gap:24px;margin:0 0 18px;padding:20px 28px;border:1px solid rgba(7,27,32,.13);border-radius:14px;background:#dff5e9}.coordinate-diagram svg{display:block;width:100%;max-height:270px}.axis{stroke:#71807d;stroke-width:1.5}.triangle{stroke:#087b6a;stroke-width:4;stroke-linecap:round}.radius{stroke:#071b20}.vertical{stroke:#e85c49}.angle,.right-angle{fill:none;stroke:#e85c49;stroke-width:2.5}.coordinate-diagram circle{fill:#071b20}.label{fill:#071b20;font:italic 22px Georgia,serif}.point{font-style:normal;font-weight:700}.radius-label{paint-order:stroke;stroke:#dff5e9;stroke-width:9px}.axis-label{fill:#71807d;font:italic 17px Georgia,serif}.coordinate-diagram figcaption{display:flex;flex-direction:column;gap:9px;line-height:1.55}.coordinate-diagram figcaption b{font-size:18px}.coordinate-diagram figcaption span{color:#52635f}.coordinate-diagram.compact{grid-template-columns:1fr;max-width:470px;margin:18px auto 0;padding:9px 18px}.coordinate-diagram.compact svg{max-height:160px}.coordinate-diagram.compact figcaption{display:none}@media(max-width:700px){.coordinate-diagram{grid-template-columns:1fr;padding:14px}.coordinate-diagram svg{max-height:210px}}
</style>
