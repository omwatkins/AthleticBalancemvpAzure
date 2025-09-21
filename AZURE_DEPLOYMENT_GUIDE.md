# Azure Deployment Guide for Athletic Balance MVP

## Overview
This guide will help you deploy your Athletic Balance MVP application to Azure using your existing SQL Server database.

## Prerequisites
- Azure CLI installed and logged in
- Your existing Azure SQL Database: `abmilk1.database.windows.net`
- SQL Server credentials for your database

## Resources Created
✅ **Resource Group**: `athletic-balance-rg` (East US)
✅ **Container Registry**: `athleticbalanceacr.azurecr.io`
✅ **Database**: Using your existing `abmilk1` SQL Server database

## Step 1: Set Up Environment Variables

You'll need to configure these environment variables for your Azure SQL Database:

```bash
# Azure SQL Database Configuration
AZURE_SQL_SERVER=abmilk1.database.windows.net
AZURE_SQL_DATABASE=abmilk1
AZURE_SQL_USER=your-username
AZURE_SQL_PASSWORD=your-password

# Authentication
JWT_SECRET=athletic-balance-super-secret-jwt-key-2024
JWT_EXPIRES_IN=7d

# OpenAI Configuration (if using AI features)
OPENAI_API_KEY=your-openai-api-key-here
```

## Step 2: Initialize Database

Run the database initialization script to create tables and insert default data:

```bash
# Set environment variables first
export AZURE_SQL_SERVER="abmilk1.database.windows.net"
export AZURE_SQL_DATABASE="abmilk1"
export AZURE_SQL_USER="your-username"
export AZURE_SQL_PASSWORD="your-password"

# Run the initialization script
node scripts/init-azure-db.js
```

This will create:
- `users` table for authentication
- `profiles` table for user profiles
- `coaches` table with default coaches
- `coach_sessions` table for chat sessions
- `user_sessions` table for session management
- Required indexes and foreign key constraints

## Step 3: Create App Service Plan and Web App

Due to quota limitations, you may need to:

1. **Request quota increase** in Azure portal, or
2. **Use a different subscription** with available quota, or
3. **Deploy to a different region**

### Option A: Request Quota Increase
1. Go to Azure Portal → Subscriptions → Your subscription
2. Navigate to "Usage + quotas"
3. Search for "App Service" or "Virtual Machines"
4. Request quota increase for your region

### Option B: Create App Service (when quota is available)
```bash
# Create App Service plan
az appservice plan create \
  --name athletic-balance-plan \
  --resource-group athletic-balance-rg \
  --sku F1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group athletic-balance-rg \
  --plan athletic-balance-plan \
  --name athletic-balance-app \
  --runtime "NODE|18-lts"
```

## Step 4: Configure Application Settings

Set the environment variables in your App Service:

```bash
# Set environment variables
az webapp config appsettings set \
  --resource-group athletic-balance-rg \
  --name athletic-balance-app \
  --settings \
    AZURE_SQL_SERVER="abmilk1.database.windows.net" \
    AZURE_SQL_DATABASE="abmilk1" \
    AZURE_SQL_USER="your-username" \
    AZURE_SQL_PASSWORD="your-password" \
    JWT_SECRET="athletic-balance-super-secret-jwt-key-2024" \
    JWT_EXPIRES_IN="7d" \
    NODE_ENV="production"
```

## Step 5: Deploy Application

### Option A: GitHub Actions (Recommended)
1. Push your code to GitHub
2. Add these secrets to your GitHub repository:
   - `AZURE_CREDENTIALS`: Service principal credentials
   - `AZUREAPPSERVICE_PUBLISHPROFILE`: App Service publish profile
   - `AZURE_SQL_SERVER`: Your SQL Server
   - `AZURE_SQL_DATABASE`: Your database name
   - `AZURE_SQL_USER`: Database username
   - `AZURE_SQL_PASSWORD`: Database password
   - `JWT_SECRET`: Your JWT secret

3. The GitHub Actions workflow will automatically deploy on push to main

### Option B: Local Deployment
```bash
# Install Azure CLI extension
az extension add --name webapp

# Deploy from local
az webapp deployment source config-zip \
  --resource-group athletic-balance-rg \
  --name athletic-balance-app \
  --src app.zip
```

## Step 6: Test Deployment

1. Navigate to your App Service URL: `https://athletic-balance-app.azurewebsites.net`
2. Test the database initialization endpoint: `https://athletic-balance-app.azurewebsites.net/api/init-db`
3. Test user registration and login
4. Verify coach sessions work correctly

## Database Schema

The application uses these tables:

### users
- `id` (UNIQUEIDENTIFIER, Primary Key)
- `email` (NVARCHAR(255), Unique)
- `password_hash` (NVARCHAR(255))
- `provider` (NVARCHAR(50), Default: 'email')
- `provider_id` (NVARCHAR(255))
- `email_verified` (BIT, Default: 0)
- `created_at` (DATETIME2)
- `updated_at` (DATETIME2)

### profiles
- `id` (UNIQUEIDENTIFIER, Primary Key, Foreign Key to users.id)
- `email` (NVARCHAR(255))
- `full_name` (NVARCHAR(255))
- `age` (INT)
- `sport` (NVARCHAR(100))
- `school` (NVARCHAR(255))
- `created_at` (DATETIME2)
- `updated_at` (DATETIME2)

### coaches
- `id` (NVARCHAR(50), Primary Key)
- `name` (NVARCHAR(100))
- `emoji` (NVARCHAR(10))
- `tagline` (NVARCHAR(255))
- `system_prompt` (NVARCHAR(MAX))
- `created_at` (DATETIME2)

### coach_sessions
- `id` (UNIQUEIDENTIFIER, Primary Key)
- `user_id` (UNIQUEIDENTIFIER, Foreign Key to users.id)
- `coach_id` (NVARCHAR(50), Foreign Key to coaches.id)
- `title` (NVARCHAR(255))
- `messages` (NVARCHAR(MAX), Default: '[]')
- `created_at` (DATETIME2)
- `updated_at` (DATETIME2)

### user_sessions
- `id` (UNIQUEIDENTIFIER, Primary Key)
- `user_id` (UNIQUEIDENTIFIER, Foreign Key to users.id)
- `token` (NVARCHAR(255), Unique)
- `expires_at` (DATETIME2)
- `created_at` (DATETIME2)

## Troubleshooting

### Quota Issues
If you encounter quota issues:
1. Check your subscription limits in Azure Portal
2. Request quota increases for App Service plans
3. Consider using a different Azure subscription
4. Try deploying to a different region

### Database Connection Issues
1. Verify your SQL Server firewall allows Azure services
2. Check your connection string format
3. Ensure your credentials are correct
4. Test connection using SQL Server Management Studio

### Build Issues
1. Ensure all dependencies are installed: `pnpm install`
2. Check that the build completes successfully: `pnpm run build`
3. Verify environment variables are set correctly

## Security Considerations

1. **Database Security**: Ensure your SQL Server has proper firewall rules
2. **JWT Secret**: Use a strong, random JWT secret in production
3. **Environment Variables**: Never commit secrets to version control
4. **HTTPS**: App Service provides HTTPS by default
5. **Authentication**: The app uses JWT-based authentication

## Cost Optimization

1. **App Service Plan**: Start with F1 (Free) tier for development
2. **SQL Database**: Monitor usage and scale as needed
3. **Container Registry**: Basic tier is sufficient for small applications
4. **Resource Group**: Keep related resources together for easier management

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring and logging
4. Implement backup strategies
5. Set up staging environment
6. Configure CI/CD pipelines

## Support

If you encounter issues:
1. Check Azure App Service logs
2. Review database connection logs
3. Verify environment variables
4. Test API endpoints individually
5. Check GitHub Actions logs (if using GitHub deployment)
