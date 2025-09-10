import { useEffect, useState } from 'react';
import { FormField } from '../../shared/ui/FormField';
import { LoginSchema } from '../../schemas/authSchema';
import { ValidationError } from 'yup';
import Button from '../../shared/ui/Button';

interface FormErrors {
  email?: string;
  password?: string;
  default?: string;
}
export const LoginForm = () => {
  const [emailStarted, setEmailStarted] = useState(false);
  const [email, setEmail] = useState<string>('');
  const handleEmailChange = (value: string) => {
    setEmailStarted(true);
    setEmail(value);
  };

  const [passwordStarted, setPasswordStarted] = useState(false);
  const [password, setPassword] = useState<string>('');
  const handlePasswordChange = (value: string) => {
    setPasswordStarted(true);
    setPassword(value);
  };

  const [errors, setErrors] = useState<FormErrors>({} as FormErrors);

  useEffect(() => {
    try {
      LoginSchema.validateSync(
        {
          email,
          password,
        },
        { abortEarly: false },
      );
      setErrors({});
    } catch (error) {
      const newErrors: FormErrors = {};

      if (email === '' && password === '') {
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
  }, [email, emailStarted, password, passwordStarted]);
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
        name="password"
        label="Пароль"
        value={password}
        type="password"
        setValue={handlePasswordChange}
        autoComplete="password"
        className="mb-7"
        error={errors?.password}
      />
      <Button size="small" type="primary" className="w-full mb-5">
        Войти
      </Button>
    </>
  );
};
