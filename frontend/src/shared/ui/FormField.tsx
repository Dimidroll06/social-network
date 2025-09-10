type FormFieldProps = {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  value: string;
  setValue: (value: string) => void;
  className?: string;
  autoComplete?: string;
  error?: string;
};

export const FormField = ({
  name,
  label,
  value,
  type,
  setValue,
  className,
  autoComplete,
  error,
}: FormFieldProps) => {
  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-sm/6 font-medium text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2">
        <input
          id={name}
          name={name}
          value={value}
          type={type}
          autoComplete={autoComplete}
          onChange={(e) => setValue(e.target.value)}
          required
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-500 sm:text-sm/6"
        />
      </div>
      {error && <div className="text-sm font-italic text-red-500">{error}</div>}
    </div>
  );
};
