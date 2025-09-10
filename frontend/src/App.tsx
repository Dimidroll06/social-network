import { Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Header } from './widgets/Header/Header';

function App() {
  return (
    <>
      <Header />
      <div className="mt-16"></div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
