import * as yup from 'yup';

export interface IRegisterSchema {
  email: string;
  username: string;
  password: string;
}

export interface ILoginSchema {
  email: string;
  password: string;
}

export const RegisterSchema: yup.ObjectSchema<IRegisterSchema> = yup
  .object({
    email: yup
      .string()
      .required('Это обязательное поле')
      .email('Пожалуйста, введите корректный email'),

    username: yup
      .string()
      .required('Это обязательное поле')
      .min(3, 'Длина должна быть минимум 3 символа')
      .max(20, 'Длина должна быть максимум 20 символов'),

    password: yup
      .string()
      .required('Это обязательное поле')
      .test(
        'has-uppercase',
        'В пароле должна быть минимум одна заглавная буква',
        (value: string) => /[A-Z]/.test(value || ''),
      )
      .test(
        'has-lowercase',
        'В пароле должна быть минимум одна прописная буква',
        (value: string) => /[a-z]/.test(value || ''),
      )
      .test(
        'has-number-or-special',
        'В пароле должен быть минимум одна цифра или спец символ',
        (value: string) => /[\d\W]/.test(value || ''),
      ),
  })
  .defined();

export const LoginSchema: yup.ObjectSchema<ILoginSchema> = yup
  .object({
    email: yup
      .string()
      .required('Это обязательное поле')
      .email('Пожалуйста, введите корректный email'),

    password: yup.string().required('Это обязательное поле'),
  })
  .defined();
