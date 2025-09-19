import React from "react";

const ErrorMessage = ({ message }) => {
  if (!message) return null; // don't render empty space
  return <p className="text-sm text-red-600">{message}</p>;
};

export default ErrorMessage;