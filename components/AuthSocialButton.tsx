import React from "react";
import { IconType } from "react-icons";
interface AuthSocialProps {
  icon: IconType;
  onClick: () => void;
}

const AuthSocialButton: React.FC<AuthSocialProps> = ({
  icon: Icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="
    inline-flex
    w-full
    justify-center
    rounded-md
    bg-white
    dark:bg-gray-800
    text-gray-700
    dark:text-gray-200
    shadow-sm
    px-4
    py-2
    ring-1
    ring-inset
    ring-gray-300
    hover:ring-gray-500
    hover:bg-gray-50
    hover:dark:bg-gray-800

    "
    >
      <Icon />
    </button>
  );
};

export default AuthSocialButton;
