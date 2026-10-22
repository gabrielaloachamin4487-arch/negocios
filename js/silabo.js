"use strict";

const unitPanels = [...document.querySelectorAll(".syllabus-accordion .accordion-collapse")];

document.querySelectorAll("[data-accordion-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const shouldExpand = button.dataset.accordionAction === "expand";
    unitPanels.forEach((panel) => {
      const collapse = bootstrap.Collapse.getOrCreateInstance(panel, { toggle: false });
      if (shouldExpand) collapse.show();
      else collapse.hide();
    });
  });
});