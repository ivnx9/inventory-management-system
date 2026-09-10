/*
    Stocky - Database Setup
    Microsoft SQL Server

    Run this script in SQL Server Management Studio (SSMS).

    This script:
    1. Creates InventoryDB if it does not exist.
    2. Creates the Users table.
    3. Creates the Products table.

    The application stores passwords as bcrypt hashes.
    Do not insert plaintext passwords into password_hash.
*/

IF DB_ID(N'InventoryDB') IS NULL
BEGIN
    CREATE DATABASE InventoryDB;
END
GO

USE InventoryDB;
GO

IF OBJECT_ID(N'dbo.Users', N'U') IS NULL
BEGIN
    CREATE TABLE Users (
        id INT IDENTITY(1,1) PRIMARY KEY,
        username NVARCHAR(50) NOT NULL UNIQUE,
        password_hash NVARCHAR(255) NOT NULL,
        role NVARCHAR(20) NOT NULL DEFAULT 'user',
        created_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

IF OBJECT_ID(N'dbo.Products', N'U') IS NULL
BEGIN
    CREATE TABLE Products (
        id INT IDENTITY(1,1) PRIMARY KEY,
        name NVARCHAR(100) NOT NULL,
        sku NVARCHAR(50) NOT NULL UNIQUE,
        category NVARCHAR(50) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        created_at DATETIME2 NOT NULL DEFAULT GETDATE(),
        updated_at DATETIME2 NOT NULL DEFAULT GETDATE()
    );
END
GO

PRINT 'Stocky database setup completed successfully.';
GO
