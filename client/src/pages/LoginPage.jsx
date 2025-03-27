import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Paper,
  CircularProgress,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  
  const navigate = useNavigate();
  
  const { 
    login, 
    isLoading, 
    error, 
    isAuthenticated,
    user,
    clearError 
  } = useAuthStore();

  // Clear error when component mounts or unmounts
  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  // Redirect if already authenticated - with role-based routing
  useEffect(() => {
    if (isAuthenticated && user) {
      // Kiểm tra vai trò và điều hướng tương ứng
      if (user.isAdmin) {
        navigate('/admin/dashboard'); // Hoặc trang admin thích hợp
      } else {
        navigate('/member/dashboard'); // Hoặc trang member thích hợp
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission (prevents page reload)
    
    // Validate inputs
    if (!email || !password) {
      setShowError(true);
      return;
    }
    
    try {
      // Call login function from authStore
      const result = await login(email, password);
      
      // If login successful and no errors
      if (result && result.success) {
        // Điều hướng dựa trên vai trò được thực hiện trong useEffect
        // Do không có truy cập ngay lập tức đến user.isAdmin
      } else {
        // Show error but don't reload page
        setShowError(true);
      }
    } catch (err) {
      // Show error but don't reload page
      setShowError(true);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 8, p: 4, borderRadius: 2 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" fontWeight="bold" mb={3}>
            Đăng nhập
          </Typography>
          
          {/* Error Alert */}
          {error && showError && (
            <Alert 
              severity="error" 
              sx={{ width: '100%', mb: 2 }}
              onClose={() => setShowError(false)}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2, fontWeight: 'bold' }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Đăng Nhập'}
            </Button>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Link href="/forgot-password" variant="body2">
                Quên mật khẩu?
              </Link>
              <Link href="/register" variant="body2">
                Chưa có tài khoản? Đăng ký
              </Link>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;