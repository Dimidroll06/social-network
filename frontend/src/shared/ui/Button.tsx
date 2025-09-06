type ButtonProps = {
  size?: 'small' | 'medium' | 'large';
  type?: 'primary' | 'secondary' | 'outline';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const Button = (props: ButtonProps) => {
  const {
    size = 'medium',
    type = 'primary',
    className = '',
    children,
    onClick,
    disabled,
  } = props;
  let buttonStyle: string = `${className} transition-all duration-300 ease-in-out`;

  switch (size) {
    case 'small':
      buttonStyle = `${buttonStyle} px-4 py-2 rounded-md text-sm`;
      break;

    case 'medium':
      buttonStyle = `${buttonStyle} px-6 py-3 rounded-md text-base`;
      break;

    case 'large':
      buttonStyle = `${buttonStyle} px-8 py-4 rounded-md text-lg`;
      break;
  }

  switch (type) {
    case 'primary':
      if (disabled) {
        return (
          <button
            className={`bg-gray-500 text-white ${buttonStyle} cursor-not-allowed`}
            //   onClick={onClick}
            disabled
          >
            {children}
          </button>
        );
      }
      return (
        <button
          className={`bg-blue-500 text-white ${buttonStyle} hover:bg-blue-400 cursor-pointer`}
          onClick={onClick}
        >
          {children}
        </button>
      );
    case 'secondary':
      if (disabled) {
        return (
          <button
            className={`bg-gray-300 text-gray-300 ${buttonStyle} cursor-not-allowed`}
            //   onClick={onClick}
            disabled
          >
            {children}
          </button>
        );
      }
      return (
        <button
          className={`bg-gray-400 text-gray-800 ${buttonStyle} hover:bg-gray-300 cursor-pointer`}
          onClick={onClick}
        >
          {children}
        </button>
      );
    case 'outline':
      if (disabled) {
        return (
          <button
            className={`border border-gray-500 text-gray-500 ${buttonStyle} cursor-not-allowed`}
            //   onClick={onClick}
            disabled
          >
            {children}
          </button>
        );
      }
      return (
        <button
          className={`border border-blue-500 text-blue-500 ${buttonStyle} hover:border-blue-400 hover:text-blue-400 cursor-pointer`}
          onClick={onClick}
        >
          {children}
        </button>
      );
  }
};

export default Button;
