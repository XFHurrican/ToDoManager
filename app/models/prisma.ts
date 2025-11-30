// Add error handling for Prisma Client import
let PrismaClient;
try {
  console.log('Attempting to import PrismaClient...');
  PrismaClient = require('../generated/prisma/client').PrismaClient;
  console.log('PrismaClient imported successfully');
} catch (error) {
  console.error('Error importing PrismaClient:', error);
  throw error;
}

// Create Prisma Client instance
let prisma;
try {
  console.log('Attempting to create PrismaClient instance...');
  prisma = new PrismaClient();
  console.log('PrismaClient instance created successfully');
} catch (error) {
  console.error('Error creating PrismaClient instance:', error);
  throw error;
}

export { prisma };
