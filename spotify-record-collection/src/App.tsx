import React from 'react';
import './App.css';
import { Route, Routes } from 'react-router';
import { Layout } from './Layout';
import { HomePage } from './components/HomePage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </Layout>
  );
}

export default App;

