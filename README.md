# InfyProcure

## Enterprise Procurement & Purchase Order Management System

InfyProcure is a full-stack procurement management platform that centralizes procurement requests, approvals, supplier operations, payments, order fulfillment, notifications, ratings, and procurement-history reporting for employees, administrators, and suppliers.

---

## Features

- Role-based portals for **Employee/User, Admin, and Supplier**
- Procurement request creation and history
- Department-based category selection
- Category-based product catalog selection
- Server-side total-price calculation
- Approval workflow: `PENDING_APPROVAL` → `APPROVED` / `REJECTED`
- Supplier management and supplier/category validation
- Payment processing with backend business-rule validation
- Duplicate-payment prevention
- UPI QR payment demonstration
- Order fulfillment tracking
- Email notifications for procurement, approval, payment, and order events
- 1–5 star ratings and written reviews
- Procurement-history export to CSV, Excel/XLSX, and PDF
- Responsive desktop/tablet/mobile frontend
- REST API integration
- JWT-based authentication/authorization

---

## Technology Stack

### Frontend

- React
- JavaScript / JSX
- CSS
- Axios
- React Router
- SweetAlert2
- `qrcode.react`
- Browser `localStorage`
- Responsive CSS

### Backend

- Java
- Spring Boot **3.5.4**
- Spring Web / REST
- Spring Data JPA
- Hibernate ORM **6.6.22.Final**
- Bean Validation
- JWT-based authentication/authorization
- Spring Mail / `JavaMailSender`
- Maven
- Apache Tomcat 10.1.x
- HikariCP
- SLF4J / Spring logging
- DTO-based request/response handling
- Custom exception handling

### Database

- MySQL **8.0.46**
- MySQL Connector/J **9.3.0**

### Development & Deployment

- Git / GitHub
- Maven
- Railway

---

## Architecture

```text
┌──────────────────────────────┐
│        React Frontend        │
│ Role-based Responsive UI     │
└──────────────┬───────────────┘
               │ Axios / REST
               ▼
┌──────────────────────────────┐
│       Spring Boot API        │
│ Controllers                  │
│ DTOs + Validation            │
│ Service Layer                │
│ JWT / Authorization          │
│ Payment & Order Logic        │
│ Email Notifications          │
└──────────────┬───────────────┘
               │ JPA / Hibernate
               ▼
┌──────────────────────────────┐
│            MySQL             │
│ Relational Procurement Data  │
└──────────────────────────────┘
```

### Backend layers

```text
REST Controllers
       ↓
DTOs + Validation
       ↓
Service Layer
       ↓
Spring Data JPA Repositories
       ↓
Hibernate ORM
       ↓
MySQL
```

Business rules are implemented in the service layer rather than relying only on frontend validation.

---

## Core Workflow

```text
Raise Procurement Request
          ↓
PENDING_APPROVAL
          ↓
Admin Approves / Rejects
          ↓
Supplier Processing
          ↓
Payment Validation
          ↓
Payment Record Created
          ↓
Order Tracking Created
          ↓
ORDER_RECEIVED
          ↓
PACKED
          ↓
SHIPPED
          ↓
OUT_FOR_DELIVERY
          ↓
DELIVERED
          ↓
Rating & Review
```

The five fulfillment states are:

1. `ORDER_RECEIVED`
2. `PACKED`
3. `SHIPPED`
4. `OUT_FOR_DELIVERY`
5. `DELIVERED`

This is status-based order fulfillment tracking, not GPS/location tracking.

---

## Backend Implementation

### Procurement Requests

A request records information such as:

- Product
- User
- Department
- Category
- Supplier
- Unit price
- Quantity
- Total price
- Description
- Status
- Created/updated timestamps

The backend calculates:

```text
totalPrice = pricePerProduct × quantity
```

New requests begin in `PENDING_APPROVAL`.

### Department-Aware Procurement

```text
Logged-in User
      ↓
Department
      ↓
Available Categories
      ↓
Products in Category
      ↓
Quantity + Description
      ↓
Request
```

The frontend loads categories using the user's department and products using the selected category.

### Approval Enforcement

Payment is rejected unless the procurement request is `APPROVED`. This rule is enforced in the backend service layer.

### Supplier Validation

During payment processing, the backend:

- Retrieves the supplier associated with the procurement record
- Verifies supplier existence
- Validates supplier/category consistency
- Verifies the supplier account where required

### Payment Processing

The payment workflow performs multiple checks, including:

1. Product/request existence
2. Approval-state verification
3. Supplier existence
4. Supplier/category consistency
5. Duplicate-payment prevention
6. Admin validation
7. UPI MPIN validation where applicable
8. Supplier-account verification

After successful validation, the system:

- Persists the payment
- Marks the payment as `COMPLETED`
- Creates order tracking when required
- Sends relevant notifications
- Returns a `PaymentResponse`

### Order Tracking

Successful payment can initialize an order-tracking record at `ORDER_RECEIVED`. Suppliers then progress the order through the five fulfillment states.

### Notifications

The backend uses `JavaMailSender` for event-driven email notifications.

Supported notification flows include:

- New request → Admin
- Approval/rejection → User
- Payment confirmation → Admin and Supplier
- Order-status update → User, Admin, and Supplier

Notification errors are handled separately from the core transaction flow.

### Ratings & Reviews

- 1–5 star rating scale
- Written review
- Product/user association
- Delivered procurement items can be reviewed
- Supplier rating information can be retrieved

### Reporting

Procurement history supports three export formats:

- CSV
- Excel/XLSX
- PDF

Relevant technologies include **Apache POI** for Excel generation and **iText** for PDF generation.

---

## Database

Core tables:

```text
account
admin
approval_hierarchy
category
department
department_category
order_tracking
payment
product
product_catalog
rating
supplier
```

The database is a relational MySQL schema mapped through JPA/Hibernate.

Do not assume or advertise a specific normalization form or relationship cardinality unless it is confirmed directly from the entity mappings/schema.

---

## API

The application uses REST APIs between React and Spring Boot, with Axios on the frontend.

Some of the API route patterns include:

```text
/api/ratings
/api/ratings/user/{userId}
/api/ratings/supplier/{supplierId}

/api/products/history?type=user&id={userId}
/api/products/history?type=supplier&id={supplierId}

/api/orders/status/{productId}
```

Additional endpoints are provided by the backend controllers for authentication, procurement, products, categories, departments, suppliers, administration, and payments.

For API documentation or testing, use the endpoint definitions in the current controller implementation rather than assuming endpoint names.

---

## Security

Authentication and authorization use JWT-based application security.

The frontend maintains session information such as:

- User ID
- Role
- Department ID
- Remember-me state

General flow:

```text
Login
  ↓
Authentication
  ↓
JWT
  ↓
Authenticated Request
  ↓
Role Validation
  ↓
REST Controller
  ↓
Service Layer
```

Backend request validation is also active, including Spring's `MethodArgumentNotValidException`.

Custom exceptions include `ResourceNotFoundException` and `IllegalArgumentException`.

---

## Frontend

The React application provides separate role-oriented experiences.

### Employee/User

- Dashboard
- Raise Request
- Department/category/product selection
- Request history
- Request status
- Payment access where applicable
- Ratings/reviews

### Admin

- Dashboard
- Procurement management
- Approve/reject requests
- Product/category/supplier management
- Payment processing
- Payment history
- Administrative operations

### Supplier

- Dashboard
- Approved procurement requests
- Order fulfillment status
- Supplier payment history
- Ratings/reviews

Reusable frontend elements include `StatsCard`, `Sidebar`, and `SupplierSidebar`.

The UI uses responsive breakpoints around **1200px, 900px, 700px, and 500px**, with dashboard layouts adapting from four columns to two columns to one column.

---

## Verified Project Metrics

| Metric                               | Value                      |
| ------------------------------------ | -------------------------- |
| Spring Boot                          | 3.5.4                      |
| Hibernate                            | 6.6.22.Final               |
| MySQL                                | 8.0.46                     |
| MySQL Connector/J                    | 9.3.0                      |
| Embedded Tomcat                      | 10.1.x                     |
| JPA repositories detected at runtime | 7                          |
| Local backend port                   | 8080                       |
| Core database tables                 | 12                         |
| Procurement approval states          | 3 key states               |
| Order fulfillment states             | 5                          |
| Rating scale                         | 1–5                       |
| Report export formats                | 3                          |
| Responsive CSS breakpoints           | ~1200 / 900 / 700 / 500 px |

Performance metrics such as API response time, payload size, throughput, user count, transaction count, or percentage improvements are intentionally not stated unless measured from the running system.

---

## Local Setup

### Prerequisites

- Java
- Maven
- MySQL
- Node.js and npm

### Backend

1. Configure the MySQL database.
2. Configure database credentials in the backend application configuration.
3. Configure mail credentials if email notifications are required.
4. Build and run the Spring Boot application using Maven.
5. The development backend runs on port `8080` by default.

### Frontend

1. Install dependencies with npm.
2. Configure the frontend API base URL to point to the backend.
3. Start the React development server.

Use the repository's `pom.xml`, `package.json`, and application configuration as the source of truth for exact commands and configuration keys.

---

## Configuration & Security

Never commit secrets or credentials to GitHub.

Keep the following outside version control:

- Database passwords
- JWT secrets
- Email passwords/API keys
- Production credentials
- Private configuration values

Use environment variables or local configuration for sensitive settings.

---

## Project Scope

### Implemented

- Procurement requests
- Department/category/product selection
- Approval workflow
- Supplier management
- Payment processing and validation
- Order fulfillment tracking
- Email notifications
- Ratings and reviews
- CSV/Excel/PDF exports
- JWT authentication/authorization
- Role-based portals
- Responsive frontend
- REST API integration

### Demonstration

- UPI QR code generation and payment workflow demonstration

### Future Scope

- RFQ and quotation management
- Supplier quotation comparison
- Three-way PO/invoice/delivery matching
- Advanced spend analytics
- AI-based supplier recommendations
- ERP integration
- Mobile application
- ESG/sustainability tracking
- Real payment gateway/bank integration
- GPS-based logistics tracking
- Enterprise staging-to-production CI/CD

---

## Project Status

**Status:** Completed full-stack academic/internship project.

InfyProcure currently focuses on the complete procurement-to-fulfillment lifecycle: request creation, approval, supplier processing, validated payment, order tracking, stakeholder notifications, and post-delivery feedback.

---

## License

This project is intended for academic/internship use. Add an open-source license file if the repository is intended for public redistribution.
