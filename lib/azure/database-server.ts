import sql from 'mssql'

// Database connection configuration for Azure SQL Database
const dbConfig: sql.config = {
  server: process.env.AZURE_SQL_SERVER || 'abmilk1.database.windows.net',
  database: process.env.AZURE_SQL_DATABASE || 'abmilk1',
  user: process.env.AZURE_SQL_USER || '',
  password: process.env.AZURE_SQL_PASSWORD || '',
  options: {
    encrypt: true,
    trustServerCertificate: false,
    enableArithAbort: true,
  },
  pool: {
    max: 20,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
}

// Connection pool
let pool: sql.ConnectionPool | null = null

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = new sql.ConnectionPool(dbConfig)
    await pool.connect()
    
    pool.on('error', (err) => {
      console.error('SQL Server connection error:', err)
    })
  }
  return pool
}

export async function query(text: string, params?: any[]): Promise<any> {
  const pool = await getPool()
  const request = pool.request()
  
  // Add parameters if provided
  if (params) {
    params.forEach((param, index) => {
      request.input(`param${index}`, param)
    })
  }
  
  const result = await request.query(text)
  return result
}

export async function transaction<T>(callback: (request: sql.Request) => Promise<T>): Promise<T> {
  const pool = await getPool()
  const transaction = new sql.Transaction(pool)
  
  try {
    await transaction.begin()
    const request = new sql.Request(transaction)
    const result = await callback(request)
    await transaction.commit()
    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

// Database initialization
export async function initializeDatabase() {
  try {
    // Create tables if they don't exist
    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='users' AND xtype='U')
      CREATE TABLE users (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        email NVARCHAR(255) UNIQUE NOT NULL,
        password_hash NVARCHAR(255),
        provider NVARCHAR(50) DEFAULT 'email',
        provider_id NVARCHAR(255),
        email_verified BIT DEFAULT 0,
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE()
      )
    `)

    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='profiles' AND xtype='U')
      CREATE TABLE profiles (
        id UNIQUEIDENTIFIER PRIMARY KEY,
        email NVARCHAR(255) NOT NULL,
        full_name NVARCHAR(255),
        age INT,
        sport NVARCHAR(100),
        school NVARCHAR(255),
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='coaches' AND xtype='U')
      CREATE TABLE coaches (
        id NVARCHAR(50) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        emoji NVARCHAR(10) NOT NULL,
        tagline NVARCHAR(255) NOT NULL,
        system_prompt NVARCHAR(MAX) NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE()
      )
    `)

    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='coach_sessions' AND xtype='U')
      CREATE TABLE coach_sessions (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER NOT NULL,
        coach_id NVARCHAR(50) NOT NULL,
        title NVARCHAR(255) NOT NULL,
        messages NVARCHAR(MAX) NOT NULL DEFAULT '[]',
        created_at DATETIME2 DEFAULT GETDATE(),
        updated_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (coach_id) REFERENCES coaches(id)
      )
    `)

    await query(`
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_sessions' AND xtype='U')
      CREATE TABLE user_sessions (
        id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
        user_id UNIQUEIDENTIFIER NOT NULL,
        token NVARCHAR(255) UNIQUE NOT NULL,
        expires_at DATETIME2 NOT NULL,
        created_at DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // Create indexes
    await query(`IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_email') CREATE INDEX idx_users_email ON users(email)`)
    await query(`IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_users_provider') CREATE INDEX idx_users_provider ON users(provider, provider_id)`)
    await query(`IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_sessions_user_id') CREATE INDEX idx_sessions_user_id ON coach_sessions(user_id)`)
    await query(`IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'idx_sessions_token') CREATE INDEX idx_sessions_token ON user_sessions(token)`)

    // Insert default coaches
    await query(`
      MERGE coaches AS target
      USING (VALUES 
        ('coach-fuel', 'Coach Fuel', '🥗', 'Nutrition & Recovery Expert', 'You are Coach Fuel, specializing in sports nutrition and recovery. Help athletes optimize their fueling strategies.'),
        ('coach-mind', 'Coach Mind', '🧠', 'Mental Performance Coach', 'You are Coach Mind, specializing in mental performance and sports psychology. Help athletes develop mental toughness.'),
        ('coach-power', 'Coach Power', '💪', 'Strength & Conditioning Expert', 'You are Coach Power, specializing in strength training and conditioning. Help athletes build power and strength.')
      ) AS source (id, name, emoji, tagline, system_prompt)
      ON target.id = source.id
      WHEN NOT MATCHED THEN
        INSERT (id, name, emoji, tagline, system_prompt)
        VALUES (source.id, source.name, source.emoji, source.tagline, source.system_prompt);
    `)

    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    throw error
  }
}
