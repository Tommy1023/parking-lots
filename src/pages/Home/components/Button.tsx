import React, { memo } from 'react';
import { Link } from 'react-router-dom';

const Button = memo(({ toggle }: { toggle: boolean }) => {
  return (
    <Link
      to="map"
      aria-disabled={toggle}
      className="mb-4 mt-auto flex w-[60%] justify-center rounded-xl bg-primary p-2 text-light"
    >
      {toggle ? '開始使用' : '應用程式初使化中'}
    </Link>
  );
});

export default Button;
