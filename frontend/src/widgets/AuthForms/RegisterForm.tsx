import { useEffect, useState } from 'react';
import { FormField } from '../../shared/ui/FormField';
import { RegisterSchema } from '../../schemas/authSchema';
import { ValidationError } from 'yup';
import Button from '../../shared/ui/Button';
import { useRegisterMutation } from '../../features/auth/auth.api';
import { Loader } from '../../shared/ui/Loader';
import { isBaseQueryWithTokenError, isErrorWithMessage } from '../../app/api';

interface FormErrors {
  email?: string;
  username?: string;
  password?: string;
  default?: string;
}
export const RegisterForm = () => {
  const [emailStarted, setEmailStarted] = useState(false);
  const [email, setEmail] = useState<string>('');
  const handleEmailChange = (value: string) => {
    setEmailStarted(true);
    setEmail(value);
  };

  const [usernameStarted, setUsernameStarted] = useState(false);
  const [username, setUsername] = useState<string>('');
  const handleUsernameChange = (value: string) => {
    setUsernameStarted(true);
    setUsername(value);
  };

  const [passwordStarted, setPasswordStarted] = useState(false);
  const [password, setPassword] = useState<string>('');
  const handlePasswordChange = (value: string) => {
    setPasswordStarted(true);
    setPassword(value);
  };

  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);
  const [serverError, setServerError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [register, { isLoading }] = useRegisterMutation();

  const handleRegister = async () => {
    try {
      await register({
        email,
        username,
        password,
      }).unwrap();
      setServerError('');
      setShowSuccess(true);
    } catch (error) {
      if (isErrorWithMessage(error)) {
        return setServerError(error.message);
      }

      if (isBaseQueryWithTokenError(error)) {
        if (typeof error.data === 'string') {
          return setServerError(error.data);
        }
        if (isErrorWithMessage(error.data)) {
          return setServerError(error.data.message);
        }
      }
      setServerError('Произошла ошибка при регистрации. Попробуйте позже');
      return console.error('Непредвиденная ошибка', error);
    }
  };

  useEffect(() => {
    setShowSuccess(false);
    setServerError('');

    try {
      RegisterSchema.validateSync(
        {
          email,
          username,
          password,
        },
        { abortEarly: false },
      );
      setErrors({});
    } catch (error) {
      const newErrors: FormErrors = {};

      if (email === '' && username === '' && password === '') {
        return;
      }
      if (error instanceof ValidationError) {
        error.inner.forEach((err) => {
          const message = err.message || 'Invalid field';

          switch (err.path) {
            case 'email':
              if (!emailStarted) break;
              newErrors.email = message;
              break;
            case 'username':
              if (!usernameStarted) break;
              newErrors.username = message;
              break;
            case 'password':
              if (!passwordStarted) break;
              newErrors.password = message;
              break;
            default:
              newErrors.default = message;
              break;
          }
        });

        setErrors(newErrors);
      }
    }
  }, [
    email,
    emailStarted,
    username,
    usernameStarted,
    password,
    passwordStarted,
  ]);
  return (
    <>
      <FormField
        name="email"
        label="Email"
        value={email}
        type="email"
        setValue={handleEmailChange}
        autoComplete="email"
        className="mb-5"
        error={errors?.email}
      />
      <FormField
        name="username"
        label="Имя пользователя"
        value={username}
        type="text"
        setValue={handleUsernameChange}
        autoComplete="nickname"
        className="mb-5"
        error={errors?.username}
      />
      <FormField
        name="password"
        label="Пароль"
        value={password}
        type="password"
        setValue={handlePasswordChange}
        autoComplete="password"
        className="mb-5"
        error={errors?.password}
      />
      {serverError && (
        <div className="text-sm mb-7 font-italic text-red-500">
          {serverError}
        </div>
      )}
      {showSuccess && (
        <div className="text-sm mb-7 font-italic text-green-600">
          Вы успешно зарегестрировались. Пожалуйста, войдите в систему
        </div>
      )}

      <Button
        size="small"
        type="primary"
        className="w-full mb-5"
        disabled={
          Object.keys(errors).length > 0 ||
          isLoading ||
          (!emailStarted && !usernameStarted && !passwordStarted)
        }
        onClick={() => {
          if (Object.keys(errors).length === 0 && !isLoading) {
            handleRegister();
          }
        }}
      >
        {isLoading ? (
          <Loader className="w-2 h-2 left-0 right-0 m-auto" />
        ) : (
          'Зарегестрироваться'
        )}
      </Button>
    </>
  );
};
