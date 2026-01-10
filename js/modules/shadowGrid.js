
export function initShadowRecipeGrid(hostEl, {
  cssUrl = "/css/shadowGrid.css",
  placeholderHtml = '<p class="placeholder-text">Write an ingredient or select a random recipe!</p>',
} = {}) {
  if (!hostEl) throw new Error("initShadowRecipeGrid: hostEl is required");

  const shadow = hostEl.shadowRoot ?? hostEl.attachShadow({ mode: "open" });

  hostEl.classList.remove("grid-container");

  shadow.innerHTML = `
  <style>
    @import url("${cssUrl}");
    @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css");
  </style>
  <div id="grid" class="grid-container">
    <p class="placeholder-text">Write an ingredient or select a random recipe!</p>
  </div>
  `;

  const gridContainer = shadow.querySelector("#grid");
  if (!gridContainer) throw new Error("initShadowRecipeGrid: #grid not found");

  return { shadowRoot: shadow, gridContainer };
}
