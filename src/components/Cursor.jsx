import { useEffect, useRef } from "react";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ cx: 0, cy: 0, rx: 0, ry: 0 });

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e) => {
      posRef.current.cx = e.clientX;
      posRef.current.cy = e.clientY;
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    let active = true;
    const tick = () => {
      if (!active) return;
      const pos = posRef.current;
      pos.rx += (pos.cx - pos.rx) * 0.1;
      pos.ry += (pos.cy - pos.ry) * 0.1;
      ring.style.left = `${pos.rx}px`;
      ring.style.top = `${pos.ry}px`;
      requestAnimationFrame(tick);
    };

    const onMouseOver = (e) => {
      const target = e.target;
      if (
        target &&
        (target.closest("a") ||
          target.closest("button") ||
          target.closest('input[type="submit"]') ||
          target.closest(".interactive"))
      ) {
        ring.classList.add("lg");
      } else {
        ring.classList.remove("lg");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    requestAnimationFrame(tick);

    return () => {
      active = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={dotRef} />
      <div id="cur-r" ref={ringRef} />
    </>
  );
}
