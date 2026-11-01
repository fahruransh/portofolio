export function setupCarousel() {
  const track = document.querySelector("#cert-slider");
  if (!track) return;
  const cards = [...track.querySelectorAll(".cert-item")];
  const prev = document.querySelector(".cert-prev");
  const next = document.querySelector(".cert-next");
  const position = document.querySelector(".cert-position");
  let target = 0;
  const offset = (card) =>
    card.getBoundingClientRect().left -
    track.getBoundingClientRect().left +
    track.scrollLeft;
  const update = () => {
    const index = cards.reduce(
      (best, card, i) =>
        Math.abs(offset(card) - track.scrollLeft) <
        Math.abs(offset(cards[best]) - track.scrollLeft)
          ? i
          : best,
      0,
    );
    prev.disabled = track.scrollLeft < 2;
    next.disabled =
      track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    position.textContent = `${String(index + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    const en = document.documentElement.lang === "en";
    track.setAttribute("aria-label", en ? "Certifications" : "Sertifikasi");
    prev.setAttribute(
      "aria-label",
      en ? "Previous certification" : "Sertifikasi sebelumnya",
    );
    next.setAttribute(
      "aria-label",
      en ? "Next certification" : "Sertifikasi berikutnya",
    );
  };
  const move = (direction) => {
    const step =
      cards[0].getBoundingClientRect().width +
      parseFloat(getComputedStyle(track).gap);
    target = Math.max(
      0,
      Math.min(
        track.scrollWidth - track.clientWidth,
        target + direction * step,
      ),
    );
    track.scrollTo({
      left: target,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  };
  const previous = () => move(-1);
  const following = () => move(1);
  prev.addEventListener("click", previous);
  next.addEventListener("click", following);
  let settleTimer;
  const ended = () => {
    clearTimeout(settleTimer);
    target = track.scrollLeft;
    update();
  };
  const scrolling = () => {
    update();
    clearTimeout(settleTimer);
    settleTimer = setTimeout(ended, 160);
  };
  track.addEventListener("scroll", scrolling, { passive: true });
  track.addEventListener("scrollend", ended);
  const keydown = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      move(e.key === "ArrowRight" ? 1 : -1);
    }
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      target = e.key === "Home" ? 0 : track.scrollWidth;
      move(0);
    }
  };
  track.addEventListener("keydown", keydown);
  const resize = new ResizeObserver(() => {
    target = track.scrollLeft;
    update();
  });
  resize.observe(track);
  document.addEventListener("portfolio:language", update);
  update();
  return () => {
    clearTimeout(settleTimer);
    resize.disconnect();
    prev.removeEventListener("click", previous);
    next.removeEventListener("click", following);
    track.removeEventListener("scroll", scrolling);
    track.removeEventListener("scrollend", ended);
    track.removeEventListener("keydown", keydown);
    document.removeEventListener("portfolio:language", update);
  };
}
