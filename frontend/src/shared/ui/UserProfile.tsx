import type { User } from '../../entities/user';
import { Loader } from './Loader';

type UserProfileProps = {
  user: User | null;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  onClick?: () => void;
};

export const UserProfile = ({
  user,
  size,
  onClick,
  className,
}: UserProfileProps) => {
  className = className || '';

  if (user === null) {
    return (
      <span
        className={`${className} w-9 h-9 p-1.5 rounded-full flex justify-around border-gray-300 object-cover bg-blue-300 text-blue-400 font-semibold text-2xl select-none current`}
        onClick={onClick}
      >
        <Loader />
      </span>
    );
  }

  switch (size) {
    case 'small':
      return (
        <div>
          <span
            className={`${className} w-6 h-6 rounded-full flex justify-around border-gray-300 object-cover bg-blue-300 text-blue-950 font-semibold text-2xl select-none`}
            onClick={onClick}
          >
            {user.username.toUpperCase().charAt(0)}
          </span>
        </div>
      );
    case 'large':
      return (
        <div>
          <span
            className={`${className} w-12 h-12 rounded-full flex justify-around border-gray-300 object-cover bg-blue-300 text-blue-950 font-semibold text-2xl select-none`}
            onClick={onClick}
          >
            {user.username.toUpperCase().charAt(0)}
          </span>
        </div>
      );
    default:
      return (
        <div>
          <span
            className={`${className} w-9 h-9 rounded-full flex justify-around border-gray-300 object-cover bg-blue-300 text-blue-950 font-semibold text-2xl select-none`}
          >
            {user.username.toUpperCase().charAt(0)}
          </span>
        </div>
      );
  }
};
