# Deployment Guide

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# OpenAI API Key (your actual key)
OPENAI_API_KEY=sk-proj-your-actual-openai-key

# App API Key (generate a random string to protect your OpenAI key)
APP_API_KEY=your-secure-random-string-here

# Next.js App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Vercel Deployment

1. **Set Environment Variables in Vercel:**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add the following variables:
     - `OPENAI_API_KEY`: Your OpenAI API key
     - `APP_API_KEY`: A secure random string (e.g., `vercel-deploy-2024-xyz123`)
     - `NEXT_PUBLIC_APP_URL`: Your Vercel domain

2. **API Protection:**
   - The app will check for the `APP_API_KEY` header
   - If set, it will require `x-api-key` header in requests
   - This prevents unauthorized use of your OpenAI API key

3. **Deployment:**
   ```bash
   npm run build
   vercel --prod
   ```

## Security Notes

- **Never commit your `.env.local` file**
- **Use strong, random APP_API_KEY**
- **Monitor your OpenAI API usage**
- **Consider rate limiting for production**

## Testing API Protection

```bash
# This will fail without proper API key
curl -X POST https://your-app.vercel.app/api/real-analyze \
  -H "Content-Type: application/json" \
  -d '{"chainName":"Ethereum"}'

# This will work with proper API key
curl -X POST https://your-app.vercel.app/api/real-analyze \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-secure-random-string-here" \
  -d '{"chainName":"Ethereum"}'
```
