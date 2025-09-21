#!/bin/bash

# Setup environment variables for Azure deployment
echo "Setting up environment variables..."

# Azure SQL Database Configuration
export AZURE_SQL_SERVER="abmilk1.database.windows.net"
export AZURE_SQL_DATABASE="abmilk1"
export AZURE_SQL_USER="your-username"  # Replace with your actual username
export AZURE_SQL_PASSWORD="your-password"  # Replace with your actual password

# Authentication
export JWT_SECRET="athletic-balance-super-secret-jwt-key-2024"
export JWT_EXPIRES_IN="7d"

# OpenAI Configuration (if using AI features)
export OPENAI_API_KEY="your-openai-api-key-here"  # Replace with your actual OpenAI key

echo "Environment variables set!"
echo "Remember to update the SQL Server credentials in the deployment."
