import React from 'react';

const Page = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button color="white" backgroundColor="blue" fontSize="16px">Click Me!</button>
        <header color="#333" fontSize="24px">Welcome to the Home Page</header>
        <input placeholder="Enter your name" type="text" backgroundColor="#f0f0f0" fontSize="14px" flex="1" />
        <button color="white" backgroundColor="blue" fontSize="16px">Click Me!</button>
        <header color="#333" fontSize="24px">Welcome to the Home Page</header>
        <input placeholder="Enter your name" type="text" backgroundColor="#f0f0f0" fontSize="14px" flex="1" />
    </div>
  );
};

export default Page;