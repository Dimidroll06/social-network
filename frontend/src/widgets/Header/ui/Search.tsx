import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

type SearchProps = {
  handleMobileSearch: boolean;
  setHandleMobileSearch: (value: boolean) => void;
};

export const Search = ({
  handleMobileSearch,
  setHandleMobileSearch,
}: SearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLFormElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const handleMobileSearchOpen = () => {
    setHandleMobileSearch(true);
  };

  useEffect(() => {
    if (handleMobileSearch) {
      mobileSearchRef.current?.focus();
    }
  }, [handleMobileSearch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const q = searchParams.get('q');
    if (q) {
      setSearchQuery(q);
    }
  }, [location.search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setHandleMobileSearch(false);
      }
    };

    const handleTouchOutside = (event: TouchEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setHandleMobileSearch(false);
      }
    };

    const handleResizeWindow = () => {
      if (window.innerWidth >= 768) {
        setHandleMobileSearch(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleTouchOutside);
    window.addEventListener('resize', handleResizeWindow);

    return () => {};
  });

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex flex-col items-end space-x-4 flex-1">
      <form onSubmit={handleSearch} className="hidden md:block">
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 md:w-64 px-4 py-2 h-10 pl-10 border-b border-b-gray-300 focus:outline-none focus:ring-0 text-gray-600 focus:text-gray-900"
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

      {handleMobileSearch && (
        <form onSubmit={handleSearch} ref={searchRef} className="w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск..."
              ref={mobileSearchRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 h-10 border-b border-b-gray-300 focus:outline-none focus:ring-0 text-gray-600 focus:text-gray-900"
            />
            <svg
              className="absolute left-3 top-2.5 h-3 w-3 text-gray-400"
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
      )}

      {/* Mobile Search */}
      {handleMobileSearch || (
        <button
          className="block md:hidden relative w-10 h-10 p-0.5 border-0 bg-transparent cursor-pointer"
          onClick={handleMobileSearchOpen}
        >
          <svg
            className="absolute left-1.5 top-1.5 h-5 w-5 text-gray-400"
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
        </button>
      )}
    </div>
  );
};
