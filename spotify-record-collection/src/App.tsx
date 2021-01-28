import React from 'react';
import './App.css';
import { Route } from 'react-router';
import { Layout } from './Layout';
import { HomePage } from './components/HomePage';

function App() {
  return (
    <Layout>
      <Route exact path='/' component={HomePage} />
    </Layout>
  );
}

export default App;

