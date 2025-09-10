import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { LoginForm } from '../widgets/AuthForms/LoginForm';
import { useState } from 'react';
import { RegisterForm } from '../widgets/AuthForms/RegisterForm';

export const Auth = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const [currentModal, setCurrentModal] = useState<'login' | 'register'>(
    'login',
  );

  if (!isLoading && user !== null) {
    navigate('/');
  }

  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
        />
      </div>

      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full md:max-w-lg border rounded-lg border-gray-200 backdrop-blur-lg bg-white/80 pt-6 pb-6 pr-5 pl-5">
          <h1 className="text-blue-500 font-bold text-center">
            {currentModal == 'login' ? 'Вход' : 'Регистрация'}
          </h1>

          <br className="border border-gray-500 mt-2 mb-2" />

          {currentModal == 'login' ? <LoginForm /> : <RegisterForm />}

          <br className="border border-gray-500 mt-2 mb-2" />

          {currentModal == 'login' ? (
            <div className="flex justify-center space-x-2">
              <button
                className="text-blue-500 hover:text-blue-400 hover:underline cursor-pointer"
                onClick={() => setCurrentModal('register')}
              >
                Нет аккаунта?
              </button>
            </div>
          ) : (
            <div className="flex justify-center space-x-2">
              <button
                className="text-blue-500 hover:text-blue-400 hover:underline cursor-pointer"
                onClick={() => setCurrentModal('login')}
              >
                Уже есть аккаунт?
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
