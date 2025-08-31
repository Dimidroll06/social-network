import { useState } from 'react';
import { Logo } from './ui/Logo';
import { Search } from './ui/Search';

export const Header = () => {
  const [handleMobileSearch, setHandleMobileSearch] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {handleMobileSearch || <Logo />}

          <Search
            handleMobileSearch={handleMobileSearch}
            setHandleMobileSearch={setHandleMobileSearch}
          ></Search>
        </div>
      </header>
    </>
  );
};
