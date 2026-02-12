import React from "react";

type BookMarkIconProps = {
  size?: number | string;
  strokeWidth?: number;
  color?: string;
};

const BookMarkIcon: React.FC<BookMarkIconProps> = ({
  size = 24,
  strokeWidth = 2,
  color = "currentColor",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* top line — bookmark width와 동일 */}
      <path
        d="M6 3H18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* bookmark shape — 높이 축소 */}
      <path
        d="M6 6H18V19L12 16L6 19V6Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BookMarkIcon;
