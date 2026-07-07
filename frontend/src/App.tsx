import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ProjectDetailPage from './pages/ProjectDetailPage'
import SearchPage from './pages/SearchPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
