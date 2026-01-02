# Deployment Guide

## Prerequisites

1. GitHub account
2. Vercel account (free tier)
3. Completed Supabase setup

## Step 1: Prepare for Deployment

### Commit Your Code

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Verify Build Locally

```bash
npm run build
npm run preview
```

Test the production build locally to ensure everything works.

## Step 2: Deploy to Vercel

### Via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add Environment Variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

6. Click "Deploy"

### Via Vercel CLI (Alternative)

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

## Step 3: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Go to Settings > Domains
3. Add your custom domain
4. Update DNS records as instructed

## Step 4: Enable Automatic Deployments

Vercel automatically deploys on every push to main. To deploy from other branches:

1. Go to project Settings > Git
2. Configure production and preview branches

## Step 5: Test Production

1. Visit your deployed URL
2. Test the complete flow:
   - Sign up
   - Create tasks
   - Verify all features work

## Environment Variables

Required environment variables for production:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Build Fails

- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Check for TypeScript errors locally

### Environment Variables Not Working

- Ensure variables start with `VITE_`
- Redeploy after adding variables
- Check Vercel logs for errors

### Database Connection Issues

- Verify Supabase URL and key
- Check RLS policies are enabled
- Ensure database schema is up to date

## Performance Optimization

### Already Implemented

- Vite for fast builds
- Code splitting via React Router
- Optimized Tailwind CSS
- Lazy loading for routes

### Future Improvements

- Image optimization
- Service worker for PWA
- CDN for assets
- Database query optimization

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard > Analytics

### Supabase Monitoring

1. Go to Supabase dashboard
2. Check Database > Performance
3. Monitor API usage

## Rollback

If deployment fails:

1. Go to Vercel dashboard
2. Click "Deployments"
3. Find previous working deployment
4. Click "..." > "Promote to Production"

## Security Checklist

- ✅ RLS policies enabled
- ✅ Environment variables secured
- ✅ Anon key (not service key) used
- ✅ HTTPS enabled by default
- ✅ Authentication required for all routes

## Cost

**Free Tier Limits:**
- Vercel: Unlimited personal projects, 100GB bandwidth/month
- Supabase: 500MB database, 50K monthly active users

Both services offer generous free tiers perfect for this project.

## Support

If you encounter issues:

1. Check Vercel deployment logs
2. Check browser console for errors
3. Verify Supabase connection
4. Review this guide again

## Next Steps

After deployment:

1. Share the URL with your partner
2. Both sign up and link accounts
3. Start creating tasks
4. Enjoy your weekly challenges!

