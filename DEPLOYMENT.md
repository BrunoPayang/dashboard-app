# Deployment Guide for School Dashboard

This guide covers deploying the School Dashboard React application to Render.

## Prerequisites

- Node.js 16+ installed locally
- Git repository with the code
- Render account (free tier available)

## Deployment Steps

### 1. Prepare the Application

The application is already configured for deployment with:
- Production build scripts
- Environment variables configured
- Static file serving setup
- API endpoints pointing to deployed backend

### 2. Deploy to Render

#### Option A: Deploy via Render Dashboard

1. **Connect Repository**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your Git repository

2. **Configure Build Settings**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
   - **Node Version**: 18 (or latest LTS)

3. **Set Environment Variables**
   ```
   REACT_APP_API_BASE_URL=https://schoolconnect-qeaf.onrender.com/api
   REACT_APP_APP_NAME=School Dashboard
   REACT_APP_APP_VERSION=1.0.0
   REACT_APP_ENABLE_ANALYTICS=true
   REACT_APP_ENABLE_DEBUG_MODE=false
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for build to complete
   - Your app will be available at `https://your-app-name.onrender.com`

#### Option B: Deploy via render.yaml

1. **Push to Repository**
   - Ensure `render.yaml` is in your repository root
   - Push all changes to your main branch

2. **Import from Git**
   - In Render Dashboard, click "New +" → "Blueprint"
   - Select your repository
   - Render will automatically detect and use `render.yaml`

### 3. Custom Domain (Optional)

1. **Add Custom Domain**
   - In your Render service settings
   - Go to "Custom Domains"
   - Add your domain name
   - Update DNS records as instructed

2. **SSL Certificate**
   - Render automatically provides SSL certificates
   - HTTPS will be enabled by default

## Environment Variables

### Required Variables
- `REACT_APP_API_BASE_URL`: Backend API URL
- `NODE_ENV`: Set to `production`

### Optional Variables
- `REACT_APP_APP_NAME`: Application name
- `REACT_APP_APP_VERSION`: Application version
- `REACT_APP_ENABLE_ANALYTICS`: Enable analytics (true/false)
- `REACT_APP_ENABLE_DEBUG_MODE`: Enable debug mode (true/false)

## Build Process

The build process includes:
1. **Dependency Installation**: `npm install`
2. **Type Checking**: TypeScript compilation
3. **Linting**: ESLint code quality checks
4. **Production Build**: Optimized React build
5. **Static File Generation**: Ready for deployment

## Performance Optimizations

- **Code Splitting**: Automatic code splitting for better loading
- **Asset Optimization**: Minified CSS and JavaScript
- **Caching Headers**: Configured for optimal caching
- **Gzip Compression**: Enabled by default on Render

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (use 16+)
   - Ensure all dependencies are installed
   - Check for TypeScript errors

2. **API Connection Issues**
   - Verify `REACT_APP_API_BASE_URL` is correct
   - Check CORS settings on backend
   - Ensure backend is accessible

3. **Routing Issues**
   - Ensure `_redirects` file is in `public/` directory
   - Check that all routes redirect to `index.html`

### Debug Mode

To enable debug mode in production:
1. Set `REACT_APP_ENABLE_DEBUG_MODE=true`
2. Redeploy the application
3. Check browser console for debug logs

## Monitoring

- **Build Logs**: Available in Render dashboard
- **Runtime Logs**: Check browser developer tools
- **Performance**: Use browser dev tools Performance tab

## Security

- **HTTPS**: Enabled by default
- **Security Headers**: Configured in render.yaml
- **Environment Variables**: Never commit sensitive data
- **API Keys**: Store in Render environment variables

## Updates and Maintenance

1. **Code Updates**
   - Push changes to repository
   - Render will automatically rebuild and deploy

2. **Dependency Updates**
   - Update package.json
   - Test locally first
   - Push changes to trigger rebuild

3. **Environment Variable Changes**
   - Update in Render dashboard
   - Redeploy to apply changes

## Support

For issues with:
- **Render Platform**: Check [Render Documentation](https://render.com/docs)
- **React App**: Check [Create React App Documentation](https://create-react-app.dev/)
- **This Application**: Check project README.md
