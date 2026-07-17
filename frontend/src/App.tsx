import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Footer from './components/Footer'
import NavBar from './components/NavBar'
import NotFoundPage from './pages/NotFoundPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import SavedProjectsPage from './pages/SavedProjectsPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/saved" element={<SavedProjectsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
