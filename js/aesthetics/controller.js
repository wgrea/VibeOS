// js/aesthetics/controller.js

import "../../aesthetics/ui-history/index.js";
import "../canvas/aero.js";
import "../canvas/vaporwave.js";
import "../canvas/comfort.js";
import "../canvas/kidcore.js";
import "../canvas/gaming.js";
import "../canvas/world.js";
import "../canvas/dark.js";
import "../canvas/lab.js";
import "../canvas/y2k.js";
import "../canvas/sci-fi.js";
import "../canvas/webcore.js";
import "../canvas/academia.js";
import "../canvas/glam.js";
import "../canvas/indie-sleaze.js";

// 1. Toggle-close when clicking an already-open family card
document.addEventListener("htmx:beforeRequest", (e) => {
  const card = e.target.closest(".family-card");
  if (!card) return;

  const drawer = card.closest(".family-item")?.querySelector(".family-drawer");
  if (drawer && drawer.innerHTML.trim() !== "") {
    e.preventDefault();
    drawer.innerHTML = "";
  }
});

// 2. Close other open drawers & scroll newly opened family card to the top
document.addEventListener("htmx:afterSwap", (e) => {
  const drawer = e.target.closest(".family-drawer");
  if (!drawer) return;

  const currentItem = drawer.closest(".family-item");

  document.querySelectorAll(".family-drawer").forEach((otherDrawer) => {
    if (otherDrawer !== drawer && otherDrawer.innerHTML.trim() !== "") {
      otherDrawer.innerHTML = "";
    }
  });

  currentItem?.scrollIntoView({ behavior: "smooth", block: "start" });
});