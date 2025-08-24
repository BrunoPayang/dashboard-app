import React, { useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../features/auth/authApi';
import { setUser } from '../../features/auth/authSlice';

// Custom yup resolver to avoid import issues
const yupResolver = (schema: any) => async (data: any) => {
  try {
    const validatedData = await schema.validate(data, { abortEarly: false });
    return {
      values: validatedData,
      errors: {},
    };
  } catch (err: any) {
    if (err.inner) {
      const errors = err.inner.reduce((acc: any, error: any) => {
        acc[error.path] = {
          type: error.type,
          message: error.message,
        };
        return acc;
      }, {});
      return {
        values: {},
        errors,
      };
    }
    return {
      values: {},
      errors: {},
    };
  }
};

const schema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
}).required();

type LoginFormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      
      // Store tokens
      localStorage.setItem('access_token', result.access);
      localStorage.setItem('refresh_token', result.refresh);
      
      // Update Redux state
      dispatch(setUser(result.user));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by RTK Query
      console.error('Login failed:', err);
    }
  };

  // Check if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            School Dashboard
          </Typography>
          <Typography component="h2" variant="h6" color="textSecondary" gutterBottom>
            Sign in to your account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              Invalid username or password
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="username"
              label="Username"
              autoComplete="username"
              autoFocus
              {...register('username')}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
