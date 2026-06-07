import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Cursor from "./Cursor";
import ThreeBackground from "./ThreeBackground";
import FloatingShapes from "./FloatingShapes";
import { syncFromFirestore } from "../data/dbSync";

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    syncFromFirestore();
  }, []);

  return (
    <>
      {/* Layer 0: 3D WebGL particle field + wireframe geometry */}
      <ThreeBackground />
      {/* Layer 1: 2D floating SVG geometries */}
      <FloatingShapes />
      {/* Custom cursor */}
      <Cursor />
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <main key={location.pathname} className={isAdmin ? "" : "page-container"}>
          <Outlet />
        </main>
      </AnimatePresence>
      {!isAdmin && <Footer />}
    </>
  );
}
