import React from 'react';

const Page = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button color="white" backgroundColor="blue" fontSize="16px" flex="1" alignItems="center" justifyContent="center">Click Me!</button>
        <header color="#333" fontSize="24px" flex="0 1 auto" alignItems="center" justifyContent="flex-start">Welcome to the Home Page</header>
    </div>
  );
};

export default Page;