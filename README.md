# ShopSmart - Angular E-commerce Application

A modern e-commerce application built with Angular, featuring a responsive product catalog, shopping cart functionality, and a seamless user experience.

## Features

- **Product Catalog**
  - Responsive grid layout of products
  - Category filtering
  - Product details view
  - Stock level indicators
  - Dynamic price display

- **Shopping Cart**
  - Add/remove products
  - Quantity adjustment
  - Stock availability check
  - Cart persistence
  - Order summary
  - Free shipping threshold indicator

- **Responsive Design**
  - Mobile-friendly layout
  - Adaptive grid system
  - Smooth transitions
  - Cross-browser compatibility

## Tech Stack

- Angular 17
- TypeScript
- SCSS
- RxJS
- Angular Router

## Project Structure

```
shop-smart-ui/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── product-list/
│   │   │   ├── product-detail/
│   │   │   └── cart/
│   │   ├── services/
│   │   │   ├── product.service.ts
│   │   │   └── cart.service.ts
│   │   ├── models/
│   │   │   └── product.interface.ts
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── assets/
│   │   └── data/
│   │       └── products.json
│   └── styles.scss
└── package.json
```

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v17 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Reena-art1/shop-smart.git
   cd shop-smart/shop-smart-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

1. Start the development server:
   ```bash
   ng serve
   ```
   Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

2. Build for production:
   ```bash
   ng build
   ```
   The build artifacts will be stored in the `dist/` directory.

## Available Scripts

- `ng serve` - Runs the app in development mode
- `ng build` - Builds the app for production
- `ng test` - Executes unit tests
- `ng lint` - Runs linting checks
- `ng e2e` - Runs end-to-end tests

## Application Routes

- `/products` - Main product listing page
- `/product/:id` - Product detail page
- `/cart` - Shopping cart page
- `/` - Redirects to /products

## Core Features Implementation

### Product Service
- Fetches product data from JSON file
- Provides product listing and detail functionality
- Handles product filtering and sorting

### Cart Service
- Manages shopping cart state
- Handles product quantity updates
- Calculates order totals
- Persists cart data in local storage
- Manages stock availability

### Components
- **ProductListComponent**: Displays product grid with filtering
- **ProductDetailComponent**: Shows detailed product information
- **CartComponent**: Manages shopping cart interface

## Styling

The application uses SCSS for styling with:
- CSS Grid and Flexbox for layouts
- Responsive design breakpoints
- CSS Variables for theming
- BEM methodology for class naming

## Best Practices

- Reactive state management using RxJS
- Lazy loading of components
- Modular architecture
- Type safety with TypeScript
- Component reusability
- Service abstraction
- Error handling
- Performance optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
