import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext(); // to pass down user auth info

export const UserProvider = ( props ) => {
  const [token, setToken] = useState(localStorage.getItem("ihaitimeToken")); // if token in local storage, use it
  
  useEffect(() => {
   const fetchUser = async () => {
        const requestOptions = {
            method: 'GET',
            headers: { 
                'Content-Type': `application/json`,
                authorization: `Bearer ${token}`
            }
        };

        const response = await fetch('/api/users/me', requestOptions); // makes request to user info endpoint

        if (!response.ok) {
            setToken(null); // if unauthenticated, clear token
        }
        // if auth is successful, sync token to local storage (so you stay logged in on refresh)
        localStorage.setItem("ihaitimeToken", token);
    };
    fetchUser();
  }, [token]);
  
  return (
    // exposes token and setToken globally
    <UserContext.Provider value={{ token, setToken }}>
      {props.children}
    </UserContext.Provider>
  );
}