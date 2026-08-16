# Render Deployment Configuration

This file provides instructions for deploying the Metro Backend project to Render.

## Prerequisites

1. GitHub account with repository access
2. Render account (https://render.com)
3. MongoDB Atlas account for database hosting

## Step-by-Step Deployment Guide

### 1. Prepare MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with strong credentials
4. Whitelist your IP (or use 0.0.0.0 for all IPs)
5. Get your connection string (it will look like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?appName=AppName
   ```
6. Create your database named `metro` and seed with initial data

### 2. Deploy Backend on Render

1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub account and select the repository
5. Fill in the service details:
   - **Name**: `metro-backend` (or your preferred name)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Set Environment Variables

In the Render dashboard, go to the "Environment" section and add:

```
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/?appName=AppName
JWT_SECRET=your_very_strong_secret_key_with_random_characters
```

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy
3. Your backend URL will be: `https://metro-backend.onrender.com`
4. Test the health endpoint: `https://metro-backend.onrender.com/health`

### 5. Deploy Frontend (Optional)

You can deploy the frontend as a static site on Render:

1. Create a `render.yaml` file in your root directory (or use the dashboard)
2. Click "New +" → "Static Site"
3. Select your repository
4. **Build Command**: (leave empty for static files)
5. **Publish Directory**: `frontend`
6. Deploy

Alternatively, use GitHub Pages or Netlify for frontend hosting.

## Testing Deployed Backend

Once deployed, test your endpoints:

```bash
# Health check
curl https://metro-backend.onrender.com/health

# Get stations
curl https://metro-backend.onrender.com/api/v1/stations

# Login (replace credentials)
curl -X POST https://metro-backend.onrender.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@metro.com","password":"password123"}'
```

## Important Notes

1. **Free Tier Limitations**: Render's free tier will spin down after 15 minutes of inactivity. For production, upgrade to a paid plan.

2. **Environment Variables**: Never commit `.env` files. Always use Render's environment variable management.

3. **Database Connection**: Ensure MongoDB Atlas has your Render server IP whitelisted (or use 0.0.0.0).

4. **Logs**: Check Render's logs for debugging:
   - Dashboard → Select Your Service → Logs tab

5. **Custom Domain**: Add your own domain in the service settings under "Custom Domain"

## Troubleshooting

### Service keeps spinning down
- Upgrade to a paid plan
- Or keep-alive service by making periodic requests

### Database connection timeout
- Check MongoDB Atlas whitelist settings
- Verify connection string in environment variables
- Check network connectivity from Render

### Application crashes on deploy
- Check the build and runtime logs
- Verify all environment variables are set
- Ensure `package.json` has correct start script

## Production Checklist

- [ ] Database connection string configured
- [ ] JWT_SECRET is strong and random
- [ ] All environment variables set
- [ ] Health endpoint responds with 200 OK
- [ ] All API endpoints tested
- [ ] Rate limiting is working
- [ ] CORS is properly configured
- [ ] Error handling is in place

## Monitoring

After deployment, monitor your service:

1. Check logs regularly for errors
2. Monitor database usage on MongoDB Atlas
3. Set up alerts for service downtime
4. Track API response times

## Scaling

When ready to scale:

1. Upgrade Render plan from free to paid
2. Enable horizontal scaling
3. Consider adding a CDN for frontend
4. Implement caching strategies
5. Monitor performance metrics

---

For more information, visit [Render Documentation](https://render.com/docs)
