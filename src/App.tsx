import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Workflow from './pages/Workflow';
import Projects from './pages/Projects';
import Topics from './pages/Topics';
import GearLab from './pages/GearLab';
import GdtLab from './pages/GdtLab';
import BomLab from './pages/BomLab';

import SheetMetal from './pages/SheetMetal';
import GdtFundamentals from './pages/GdtFundamentals';
import ToleranceModule from './pages/ToleranceModule';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary fallbackTitle="Application View Error">
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workflow" element={<Workflow />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topics/*" element={<Topics />} />
        <Route path="/gear-lab" element={<GearLab />} />
        <Route path="/gdt-lab" element={<GdtLab />} />
        <Route path="/bom-calculator" element={<BomLab />} />
        <Route path="/standards" element={<Navigate to="/standards/gdt" replace />} />
        <Route path="/standards/gdt" element={<GdtFundamentals />} />
        <Route path="/standards/tolerance" element={<ToleranceModule />} />
        <Route path="/sheet-metal" element={<SheetMetal />} />
        {/* Catch-all route redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
