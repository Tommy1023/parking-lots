import React, { memo } from 'react';
import GoogleMap from '../../Map';

const Home = () => {
  return (
    <div>
      Home
      <GoogleMap />
    </div>
  );
};
export default memo(Home);
