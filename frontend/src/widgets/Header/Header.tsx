import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Главная", path: "/" },
  ];

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleSearch = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-xl font-bold text-gray-800">PotatoNet</div>

            <nav className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className="text-gray-700 hover:text-blue-500 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 md:w-64 px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>

            <button
              className="md:hidden text-gray-700 focus:outline-none text-3xl w-10"
              onClick={toggleMenu}
              aria-label="Открыть меню"
            >
              ☰
            </button>

            {/* <ProfileMenu /> */}
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="absolute inset-0" onClick={toggleMenu}></div>
          <nav className="relative z-10 bg-white rounded-lg shadow-lg w-4/5 max-w-sm p-6 animate-fadeIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-3xl w-10 h-10"
              onClick={toggleMenu}
              aria-label="Закрыть меню"
            >
              &times;
            </button>

            <form onSubmit={handleSearch} className="mb-6 mt-10">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </form>

            <ul className="flex flex-col space-y-4 mt-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <a
                    href={link.path}
                    className="block text-gray-700 hover:text-blue-500 text-lg"
                    onClick={toggleMenu}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}