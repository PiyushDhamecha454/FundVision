import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function GoogleLoginButton() {
  const onSuccess = async credentialResponse => {
    const idToken = credentialResponse.credential;
    
    const backendResp = await axios.post(`${API_URL}/auth/google`, { idToken });
    const jwt = backendResp.data.jwt;
    localStorage.setItem('jwt', jwt);
    const decoded = jwtDecode(jwt);
    console.log("Logged in user:", decoded);
  };
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={() => console.error('Login failed')}
    />
  );
}