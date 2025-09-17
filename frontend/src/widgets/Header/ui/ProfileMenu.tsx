import { UserProfile } from '../../../shared/ui/UserProfile';
import type { User } from '../../../entities/user';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../../../features/auth/auth.api';

type Props = {
  user: User | null;
};

export const ProfileMenu = ({ user }: Props) => {
  const [profileMenuOpened, setProfileMenuOpened] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleProfileMenuClick = () => {
    if (!profileMenuOpened) setProfileMenuOpened(!profileMenuOpened);
  };

  const [wantToLogout, setWantToLogout] = useState(false);
  const [logout] = useLogoutMutation();
  const menuItems = [
    {
      id: 1,
      title: 'Профиль',
      onClick: () => {
        if (user) navigate(`/u/${user.id}`);
        setProfileMenuOpened(false);
      },
    },
    {
      id: 2,
      title: 'Настройки',
      onClick: () => {
        navigate('/settings');
        setProfileMenuOpened(false);
      },
    },
  ];

  const handleLogout = () => {
    setWantToLogout(true);
  };

  const handleLogoutPermit = () => {
    localStorage.removeItem('token');
    logout()
      .unwrap()
      .then(() => {
        setProfileMenuOpened(false);
        setWantToLogout(false);
      });
  };

  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpened(false);
        setWantToLogout(false);
      }
    };

    const handleResize = () => {
      setProfileMenuOpened(false);
      setWantToLogout(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      className="flex justify-center relative px-6 cursor-pointer h-full"
      ref={profileMenuRef}
      onClick={handleProfileMenuClick}
    >
      <UserProfile size="medium" user={user}></UserProfile>
      <span className="pr-2 pt-1 pl-2 select-none ">⌵</span>

      {profileMenuOpened && (
        <div className="absolute pointer-events-auto bottom-0 transform translate-y-full pt-6 right-0 md:right-1/2 md:translate-x-1/2 w-[70vw] md:w-50 z-50 cursor-auto">
          <div className="w-[70vw] md:w-50 border border-gray-200 backdrop-blur-md rounded-lg text-center">
            <div className="pt-4 pb-4 flex flex-col">
              <UserProfile
                className="left-0 right-0 m-auto mt-1 mb-1"
                size="large"
                user={user}
              ></UserProfile>

              <span className="text-blue-500 font-bold text-lg">
                {user?.username || 'username'}
              </span>

              <span className="text-gray-600 text-sm">
                {user?.email || 'user@example.com'}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex flex-col">
              {menuItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-center items-center py-4 md:py-2 transition-all duration-300 ease-in-out text-gray-600 hover:text-blue-400 hover:bg-gray-100 bg-opacity-20 cursor-pointer"
                  onClick={item.onClick}
                >
                  <span className="text-sm">{item.title}</span>
                </div>
              ))}
              {wantToLogout ? (
                <div
                  className="flex justify-center items-center py-4 md:py-2 transition-all duration-300 ease-in-out text-gray-600 hover:text-red-400 hover:bg-red-100 bg-opacity-20 cursor-pointer"
                  onClick={handleLogoutPermit}
                >
                  <span className="text-sm">Подтвердить выход</span>
                </div>
              ) : (
                <div
                  className="flex justify-center items-center py-4 md:py-2 transition-all duration-300 ease-in-out text-gray-600 hover:text-blue-400 hover:bg-gray-100 bg-opacity-20 cursor-pointer"
                  onClick={handleLogout}
                >
                  <span className="text-sm">Выйти</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
