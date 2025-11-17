
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AnimatePresence } from 'framer-motion';

// Страницы, которые нужны сразу (критичные для первой загрузки)
import HomePage from "./pages/HomePage/HomePage";
import MoviePage from "./pages/MoviePage/MoviePage";

// Lazy loading для страниц, которые не критичны для первой загрузки
const GenresPage = lazy(() => import("./pages/GenresPage/GenresPage"));
const FilteredMoviesPage = lazy(() => import("./pages/FilteredMoviesPage/FilteredMoviesPage"));
const UserPage = lazy(() => import("./pages/UserPage/UserPage"));

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AnimatedRoute from "./components/AnimatedRoute/AnimatedRoute";
import styles from './styles/custom.module.css';

// Компонент загрузки для lazy-loaded страниц
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      color: '#76a9fa'
    }}>
      <div>Загрузка...</div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Suspense fallback={<PageLoader />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<AnimatedRoute><HomePage /></AnimatedRoute>} />
          <Route path="/genres" element={<AnimatedRoute><GenresPage /></AnimatedRoute>} />
          <Route path="/movie/:id" element={<AnimatedRoute><MoviePage /></AnimatedRoute>} />
          <Route path="/profile" element={<AnimatedRoute><UserPage /></AnimatedRoute>} />
          <Route path="/genres/:genreName" element={<AnimatedRoute><FilteredMoviesPage /></AnimatedRoute>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

function App() {
  return (
    <main className={styles.main__container}>
      <BrowserRouter>
        <Header />
        <AnimatedRoutes />
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;
