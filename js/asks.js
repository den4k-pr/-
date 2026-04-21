document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".asksContainer-item");
  
  items.forEach((item) => {
    const top = item.querySelector(".asksContainer-item-top");
    const bottom = item.querySelector(".asksContainer-item-bottom");
    const arrow = item.querySelector(".q-arrow");
    const q = item.querySelector(".q");

    bottom.style.maxHeight = "0";
    bottom.style.overflow = "hidden";
    bottom.style.transition = "max-height 0.4s ease";

    top.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      items.forEach((el) => {
        el.classList.remove("active");
        el.querySelector(".asksContainer-item-bottom").style.maxHeight = "0";
        el.querySelector(".q-arrow").style.transform = "rotate(0deg)";
        el.querySelector(".q").style.color = "#8F8F8F";
      });

      if (!isActive) {
        item.classList.add("active");
        bottom.style.maxHeight = bottom.scrollHeight + "px";
        arrow.style.transform = "rotate(180deg)";
        q.style.color = "#97ff74";
      }
    });
  });
})