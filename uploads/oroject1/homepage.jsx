
import React from 'react';

const Page = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Button text="Sign In" color="white" backgroundColor="#007BFF" flex="1" cursor="pointer" fontSize="16px" />
    <Input type="password" placeholder="Password" flex="1" fontSize="16px" />
  </div>
);

export default Page;
    