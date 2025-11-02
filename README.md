# Pharmacy Management System

A modern pharmacy inventory management system built with Next.js, Prisma, and PostgreSQL.

## Features

- **Medicine Inventory**: Manage medicines with detailed information including brand, wholesaler, formulation, pricing, and stock levels
- **Advanced Filtering**: Filter medicines by brand, wholesaler, formulation, price range, and stock availability
- **Search Functionality**: Search medicines by name with real-time results
- **Detailed Medicine View**: View comprehensive medicine information including strength, pack size, batch numbers, and expiry dates
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Database Schema

The system uses four main entities:
- **Medicines**: Core inventory items with pricing, stock, and specifications
- **Brands**: Pharmaceutical manufacturers (Pfizer, Johnson & Johnson, etc.)
- **Wholesalers**: Distribution partners (McKesson, Cardinal Health, etc.)
- **Formulations**: Medicine types (Tablet, Capsule, Syrup, Injection)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database
4. Configure environment variables in `.env`
5. Run database migrations: `npx prisma migrate dev`
6. Seed sample data: `npx tsx lib/db/seed-pharmacy.ts`
7. Start the development server: `npm run dev`

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS with Radix UI components
- **TypeScript**: Full type safety throughout the application
