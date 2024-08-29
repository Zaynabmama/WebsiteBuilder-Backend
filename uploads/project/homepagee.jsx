import React from 'react';

const Page = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <button style={{padding: '10px 20px', background-color: 'blue', color: 'white', border: 'none', border-radius: '5px'}} onClick="handleClick">
        Click Me
      </button>
    <header style={{font-size: '24px', font-weight: 'bold', color: '#333'}}>
        Welcome to My Website
      </header>
  </div>
);

export default Page;