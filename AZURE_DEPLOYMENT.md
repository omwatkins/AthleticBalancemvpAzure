# Azure Deployment Guide

## Migration from Supabase to Azure Database

This application has been migrated from Supabase to Azure Database with custom authentication.

## Prerequisites

1. **Azure Account**: Active Azure subscription
2. **Azure Database for PostgreSQL**: Flexible Server or Single Server
3. **Azure Container Registry**: For Docker images
4. **Azure App Service**: For hosting the application

## Environment Variables

Set the following environment variables in your Azure App Service:

### Database Configuration
```bash
AZURE_DB_HOST=your-postgres-server.postgres.database.azure.com
AZURE_DB_PORT=5432
AZURE_DB_NAME=athletic_balance
AZURE_DB_USER=your-username
AZURE_DB_PASSWORD=your-password
```

### Authentication
```bash
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
```

### OpenAI (if using AI features)
```bash
OPENAI_API_KEY=your-openai-api-key
```

## Deployment Steps

### 1. Create Azure Resources

```bash
# Create resource group
az group create --name athletic-balance-rg --location eastus

# Create PostgreSQL database
az postgres flexible-server create \
  --resource-group athletic-balance-rg \
  --name athletic-balance-db \
  --admin-user postgres \
  --admin-password YourPassword123! \
  --sku-name Standard_B1ms \
  --tier Burstable \
  --public-access 0.0.0.0 \
  --storage-size 32

# Create database
az postgres flexible-server db create \
  --resource-group athletic-balance-rg \
  --server-name athletic-balance-db \
  --database-name athletic_balance

# Create Container Registry
az acr create \
  --resource-group athletic-balance-rg \
  --name athleticbalanceregistry \
  --sku Basic

# Create App Service plan
az appservice plan create \
  --name athletic-balance-plan \
  --resource-group athletic-balance-rg \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group athletic-balance-rg \
  --plan athletic-balance-plan \
  --name athletic-balance-app \
  --deployment-container-image-name athleticbalanceregistry.azurecr.io/athletic-balance:latest
```

### 2. Configure Database

```bash
# Connect to your database and run the setup script
psql "host=athletic-balance-db.postgres.database.azure.com port=5432 dbname=athletic_balance user=postgres password=YourPassword123! sslmode=require"

# Run the SQL setup script
\i scripts/azure-db-setup.sql
```

### 3. Build and Deploy

```bash
# Build Docker image
docker build -t athletic-balance .

# Tag for Azure Container Registry
docker tag athletic-balance athleticbalanceregistry.azurecr.io/athletic-balance:latest

# Login to Azure Container Registry
az acr login --name athleticbalanceregistry

# Push image
docker push athleticbalanceregistry.azurecr.io/athletic-balance:latest

# Update App Service with new image
az webapp config container set \
  --name athletic-balance-app \
  --resource-group athletic-balance-rg \
  --docker-custom-image-name athleticbalanceregistry.azurecr.io/athletic-balance:latest
```

### 4. Set Environment Variables

```bash
# Set environment variables in Azure App Service
az webapp config appsettings set \
  --resource-group athletic-balance-rg \
  --name athletic-balance-app \
  --settings \
    AZURE_DB_HOST="athletic-balance-db.postgres.database.azure.com" \
    AZURE_DB_PORT="5432" \
    AZURE_DB_NAME="athletic_balance" \
    AZURE_DB_USER="postgres" \
    AZURE_DB_PASSWORD="YourPassword123!" \
    JWT_SECRET="your-super-secret-jwt-key" \
    JWT_EXPIRES_IN="7d"
```

### 5. Initialize Database

After deployment, call the database initialization endpoint:

```bash
curl -X POST https://athletic-balance-app.azurewebsites.net/api/init-db
```

## Architecture Changes

### Authentication System
- **Before**: Supabase Auth with built-in user management
- **After**: Custom JWT-based authentication with PostgreSQL storage

### Database
- **Before**: Supabase PostgreSQL with Row Level Security
- **After**: Azure Database for PostgreSQL with custom queries

### Client Library
- **Before**: Supabase client with real-time features
- **After**: Custom Azure client with similar API for compatibility

## Key Features

✅ **User Authentication**: Email/password and OAuth (Google) support
✅ **Session Management**: JWT tokens with database storage
✅ **Database Integration**: PostgreSQL with custom queries
✅ **API Compatibility**: Maintains similar API to Supabase client
✅ **Security**: Password hashing, JWT validation, session management

## Monitoring and Maintenance

### Database Maintenance
- Regular backups are handled by Azure Database for PostgreSQL
- Monitor connection limits and performance
- Clean up expired sessions periodically

### Application Monitoring
- Use Azure Application Insights for monitoring
- Set up alerts for errors and performance issues
- Monitor database connections and query performance

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check firewall rules in Azure Database
   - Verify connection string and credentials
   - Ensure SSL is properly configured

2. **Authentication Issues**
   - Verify JWT_SECRET is set correctly
   - Check token expiration settings
   - Ensure cookies are being set properly

3. **Deployment Issues**
   - Check Azure Container Registry permissions
   - Verify App Service configuration
   - Review deployment logs in Azure portal

## Cost Optimization

- Use Azure Database for PostgreSQL Flexible Server for better cost control
- Consider using Basic tier for development
- Monitor usage and scale as needed
- Use Azure Advisor for cost optimization recommendations
