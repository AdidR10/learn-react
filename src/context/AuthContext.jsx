import { createContext, useState, useContext } from 'react';

// 1. Create the Context (The "Global Box" that will hold our data)
const AuthContext = createContext();

// 2. Create a Provider Component
// This component will wrap our entire application. Anything inside it
// will have access to the data inside the AuthContext.
export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const login = (jwtToken, username) => {
    setToken(jwtToken);
    setUser(username);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  // The 'value' object contains everything we want to share globally
  const value = {
    token, // We need the token to make API requests
    user,  // We need the username to show "Welcome, admin!"
    login, // We need this function to log in
    logout // We need this function to log out
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create a Custom Hook
// This makes it super easy for any component to grab the Auth data.
// Instead of importing AuthContext and calling useContext(AuthContext) everywhere,
// they just call useAuth()!
export function useAuth() {
  return useContext(AuthContext);
}
