# Skull Shakes - Digital Experience & Ordering Platform

## 1. Overview
The goal is to build a premium, highly optimized digital ordering experience for "Skull Shakes" (Açaí and Batidinhas Gourmet). The platform will feature a robust 3D hero section, an integrated cart, a seamless checkout flow with Google Maps, and multiple payment options (PIX, CC, Debit, Cash). 

## 2. Architecture
- **Frontend**: Next.js (App Router), React, Tailwind CSS, TypeScript.
- **3D/Motion**: React Three Fiber (R3F), Drei, GSAP (ScrollTrigger).
- **Backend**: C# .NET 10 Web API. Clean Architecture, CQRS, Entity Framework Core 10.
- **Database**: PostgreSQL.
- **Integrations**: Google Maps (Places/Geocoding API).

## 3. Visual & 3D Concept
- **Theme**: "Premium Dark Energy" (True Black background, White typography, Purple neon accents).
- **3D Experience**: A highly realistic 3D model of the exclusive square bottle (garrafa quadrada). Front-facing camera with macro-lens DoF (Depth of Field). Dramatic Rim Lighting to separate the subject from the background. 
- **Choreography**: The bottle acts as the navigational anchor, scrubbed via GSAP ScrollTrigger as the user browses the menu. 
- **Performance**: DRACO compression for geometry, KTX2/WebP textures, `IntersectionObserver` to pause the WebGL `useFrame` when out of view.
- **A11y & Fallback**: WebP high-res image fallback for devices with `prefers-reduced-motion` enabled or unsupported WebGL contexts. Full ARIA and keyboard navigation support.

## 4. Components & Flow
### 4.1. Hero Section
- 3D floating bottle. Subliminal parallax on mouse movement. Clear CTA to "Pedir Agora" which smoothly scrolls to the menu.

### 4.2. Cardápio (Menu)
- Based on `Cardapio.jpeg`. Categorized into "Açaí Tradicional" and "Batidinhas SS Gourmet".
- Magnetic hover effects on items. Fast "Add to cart" micro-interactions with immediate visual feedback.

### 4.3. Cart & Checkout
- Integrated Cart system.
- **Delivery/Location**: 
  - CEP input with automatic geocoding.
  - Interactive Google Maps instance allowing users to visually pinpoint their exact delivery location.

### 4.4. Payments
- Integrated system supporting PIX (QR Code & Copy-Paste), Credit Card, Debit Card, and Cash (requesting change).

## 5. Backend Design (.NET 10)
- **Domain Layer**: Core entities (`Product`, `Order`, `OrderItem`, `Address`, `Tenant/Store`).
- **Application Layer**: Use cases/handlers for `CreateOrderCommand`, `GetProductsQuery`.
- **Infrastructure Layer**: `ApplicationDbContext` (PostgreSQL), Maps Geocoding Service, Payment Service Abstractions.
- **API Layer**: .NET 10 Minimal APIs, structured logging, global exception handling, robust validations.

## 6. Testing & Quality Assurance
- **Frontend**: React Testing Library for components, Playwright for E2E checkout flows.
- **Backend**: xUnit tests, Testcontainers for real PostgreSQL integration tests.
- **Pre-Launch (WTF Audit)**: Checks for DB migrations, secure secrets, disposed WebGL contexts, responsive layouts, and a11y compliance.
