import React from 'react';
import { Link } from 'react-router';

export default function Nav({ children }) {
  let styles = {padding: '8px'};
  return (
    <div>
      <header style={{display:'none'} }>
        <Link to="/">Home</Link>
        {' '}
        <Link to="/settings">Settings</Link>
        {' '}
      </header>
      <div>{children}</div>
    </div>
  )
}