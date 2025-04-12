# **Inventory Tracking System**  
*A scalable backend service for tracking inventory across retail stores, built for Bazaar Technologies' Engineering Challenge following the given Case Study. Starting from a single kiryana store and evolving into a multi-store, multi-supplier platform with built-in audit capabilities. This system is designed for high performance, scalability, and reliability to support high-volume retail operations.*  

---

## **📌 Overview**  
This project is a **Node.js** backend service that tracks product inventory and stock movements for retail stores. It evolves from a single-store prototype to a **multi-store, distributed system** with:  
- **JWT Authentication**  
- **Redis Caching**  
- **Rate Limiting**  
- **BullMQ Queues** (async processing)  
- **PostgreSQL** (relational DB)  

**Key Features:**  
✔ Real-time stock visibility  
✔ Audit logging for all transactions  
✔ Low-stock alerts  
✔ Scalable architecture (Docker-ready but needs some improvements)  



## **🚀 Design Decisions**  

### **1. Database**  
- **PostgreSQL + Prisma(ORM)** for ACID compliance (critical for inventory tracking).  
- **Schema:**  
  ```sql
  product (id, name, description)  
  store (id, name, location)  
  stock_movement (id, productId, storeId, quantity, type, userId)  
  store_stock (productId, storeId, quantity)  # Materialized view for performance
  ```

### **2. Caching**  
- **Redis** for:  
  - Caching high-read endpoints (`GET /products/:id`,`GET/products/:productId/inventory`,`GET/stores`,`GET/stores/:storeId`, `GET/stores/:storeId/stock`).  
  - Cache invalidation on writes (e.g., stock updates).  
  - TTL: **24 hours** (adjustable based on use case).  

### **3. Async Processing**  
- **BullMQ** queues for:  
  - Audit logging (non-blocking).  
  - Low-stock alerts (decoupled from API).  

### **4. Security**  
- **JWT Authentication** (`Bearer` tokens).  
- **Rate Limiting**:  
  - Global: 100 requests/15 min.  
  - Auth endpoints: 5 requests/15 min.  

### **5. API Design**  
RESTful conventions with JSON responses.  


## **📝 Assumptions**  
1. **Single-tenant initially**, but schema supports multi-store.  
2. **Users have roles** (implied by `userId` in JWT, but no RBAC yet).  
3. **Stock movements are atomic** (no race conditions due to DB transactions).  
4. **Low-stock threshold** is hardcoded (`10`) but configurable.  

---

## **🔗 API Endpoints**  

### **Products**  
| Endpoint                | Method | Description                          | Auth Required |  
|-------------------------|--------|--------------------------------------|---------------|  
| `/products`             | GET    | List all products                    | No            |  
| `/products/:id`         | GET    | Get product + current stock          | No            |  
| `/products/:id/stock`   | GET    | Get stock movements for a product    | Yes           |  
| `/product`              | POST   | Create a Product                     | No            |
| `/products/:productId`  | PATCH  | Update a Product                     | Yes           |
| `/products/:productId`  | DELETE | Delete a Product                     | Yes           |


### **Stock Movements**  
| Endpoint                        | Method | Description                          | Auth Required |  
|---------------------------------|--------|--------------------------------------|---------------|  
| `/stock`                        | POST   | Record stock movement (in/out/sale)  | Yes           |  
| `/products/:productId/inventory`| GET    | Get stock movement (in/out/sale)     | No            |  


### **Stores**  
| Endpoint                     | Method | Description                          | Auth Required |  
|------------------------------|--------|--------------------------------------|---------------|  
| `/store`                     | POST   | Add a new store                      | Yes           |  
| `/stores`                    | GET    | List all stores                      | No            |  
| `/stores/:storeId`           | GET    | Get details of a single store        | No            |  
| `/stores/:storeId/stock`     | GET    | Get stock inventory for a store      | No            |  
| `/stores/:storeId`           | PATCH  | Update store details                 | Yes           |  
| `/store/:storeId`            | DELETE | Delete a store                       | Yes           |  

### **Auth**  
| Endpoint                | Method | Description                          |  
|-------------------------|--------|--------------------------------------|  
| `/auth/login`           | POST   | Login (returns JWT)                  |  
| `/auth/register`        | POST   | Register new user                    |  

---

## **📈 Evolution Rationale (v1 → v3)**  

### **Stage 1: Single Store (MVP)**  
- **Tech Stack:** Node.js, REST API, Prisma(ORM)+PostgreSQL.  
- **Features:**  
  - CRUD for products/stock.  
  - schema in Prisma and DB Connections.  

### **Stage 2: Multi-Store (500+ Stores)**  
- **Tech Stack:** PostgreSQL, Redis, JWT.  
- **Features:**  
  - Central product catalog.  
  - Store-specific stock tracking.  
  - Auth + rate limiting.  

### **Stage 3: Distributed (1000+ Stores)**  
- **Tech Stack:** BullMQ, Docker(Partial not fully fuctional), Redis Streams.  
- **Features:**  
  - Async event processing (BullMQ).  
  - Horizontal scaling (Docker).  
  - Real-time sync (Redis Streams).  

---
## **🛠 Setup**  

### **1. Local Development**  
```bash
git clone https://github.com/Sheryar-bit/Inventory-Tracking-System.git
cd Inventory-Tracking-System
npm install
cp .env.example .env  # Update variables
npm run dev
```

### **2. Docker**  
```bash
docker-compose up -d  # Starts Postgres + Redis
```

### **3. Environment Variables**  
```env
DATABASE_URL="postgresql://user:pass@db:5432/db"
REDIS_URL="redis://redis:6379"
JWT_SECRET="your_secret"
```

---

## **🔮 Future Improvements**  
- [ ] **RBAC** (Admin/Store Manager roles).  
- [ ] **Kafka** for cross-store stock sync.  
- [ ] **Prometheus** for monitoring.  

---