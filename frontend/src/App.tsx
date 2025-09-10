import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Header } from './widgets/Header/Header';
import { Auth } from './pages/Auth';

function App() {
  return (
    <>
      <Header />
      <div className="mt-16"></div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
