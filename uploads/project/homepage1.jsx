import React from 'react';

const Page = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
        <button style={{padding: '10px 20px', background-color: 'blue', color: 'white', border: 'none', border-radius: '5px'}} onClick="handleClick">
          Click Me
        </button>
        <header style={{font-size: '24px', font-weight: 'bold', color: '#333'}}>
        <h1>Welcome to the Home Page</h1>
        </header>
    </div>
  );
};

export default Page;