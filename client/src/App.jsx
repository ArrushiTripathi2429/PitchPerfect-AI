
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { RedirectToSignIn, SignedIn, SignedOut } from '@clerk/clerk-react'
import LandingPage from './pages/LandingPage'

import ScriptPreview from './pages/ScriptPreview'
import PresentPage from './pages/PresentPage'
import TopicUpload from './pages/TopicUpload'
const ProtectedRoute = ({ children }) => (
  <>
    <SignedIn>{children}</SignedIn>
    <SignedOut><RedirectToSignIn /></SignedOut>
  </>
)

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload-topic" element={<ProtectedRoute><TopicUpload /></ProtectedRoute>} />
        <Route path="/script-preview" element={<ProtectedRoute><ScriptPreview /></ProtectedRoute>} />
      
            <Route path="/report" element={<ProtectedRoute><ReportPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App