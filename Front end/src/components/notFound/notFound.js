import React from 'react';
import { Link } from 'react-router-dom';
import './notFound.css';

const NotFound = () => {
  return React.createElement(
    'div',
    { className: 'not-found' },
    React.createElement('h1', null, '404 - Page Not Found'),
    React.createElement('p', null, 'The page you are looking for doesn\'t exist.'),
    React.createElement(
      Link,
      { to: '/login' },
      'Go to Login'
    )
  );
};

export default NotFound;