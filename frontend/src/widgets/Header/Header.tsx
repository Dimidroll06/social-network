import { useState } from 'react';
import { Logo } from './ui/Logo';
import { Search } from './ui/Search';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import { useNavigate } from 'react-router-dom';
import Button from '../../shared/ui/Button';
import { ProfileMenu } from './ui/ProfileMenu';

export const Header = () => {
  const [handleMobileSearch, setHandleMobileSearch] = useState(false);
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-lg bg-white/80 border-b border-gray-200">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {handleMobileSearch || <Logo />}
          <Search
            handleMobileSearch={handleMobileSearch}
            setHandleMobileSearch={setHandleMobileSearch}
          ></Search>
          {isLoading || user === null ? (
            <Button
              type="outline"
              size="small"
              className="px-5"
              onClick={() => navigate('/auth')}
            >
              Войти
            </Button>
          ) : (
            <ProfileMenu user={user} />
          )}
        </div>
      </header>
    </>
  );
};
