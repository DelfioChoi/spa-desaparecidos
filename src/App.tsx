import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import { lazy, Suspense } from "react"

// Lazy load do Details
const Details = lazy(() => import("./pages/Details"))

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/pessoas/:id"
        element={
          <Suspense fallback={<div>Carregando detalhes...</div>}>
            <Details />
          </Suspense>
        }
      />
    </Routes>
  )
}