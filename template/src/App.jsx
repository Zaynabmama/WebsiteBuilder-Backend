import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const importAllPages = (context) => {
  const pages = {};
  context.keys().forEach((key) => {
    const pageName = key.replace('./', '').replace('.jsx', '');
    pages[pageName] = context(key).default;
  });
  return pages;
};

const pages = importAllPages(require.context('./pages', false, /\.jsx$/));

function App() {
  return (
    <Router>
      <Routes>
        {Object.keys(pages).map((pageName) => (
          <Route
            key={pageName}
            path={`/${pageName}`} 
            element={React.createElement(pages[pageName])} 
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;