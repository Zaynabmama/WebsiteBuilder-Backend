
import React from 'react';

const Page = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <Button text="Click Me" color="red" flex="1" />
    <Text text="Hello World" color="red" flex="2" />
    <Button text="Click Me" color="blue" flex="1" />
    <Text text="Hello World" color="red" flex="2" />
  </div>
);

export default Page;
    