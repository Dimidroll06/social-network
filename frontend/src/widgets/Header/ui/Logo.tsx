import { useNavigate } from 'react-router-dom';

export const Logo = () => {
  const navigate = useNavigate();
  return (
    <button
      className="flex items-center space-x-6 select-none cursor-pointer"
      onClick={() => navigate('/')}
    >
      <div className="text-xl font-bold text-gray-800">PotatoNet</div>
    </button>
  );
};
