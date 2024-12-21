// withRouterReRender.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const withRouterReRender = (WrappedComponent) => {
  return (props) => {
    const location = useLocation(); // Get current location
    return <WrappedComponent key={location.key} {...props} />; // Use location.key to force re-render
  };
};

export default withRouterReRender;
