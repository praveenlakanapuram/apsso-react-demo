# AP SSO - React JS Demo

A clean, standalone React demo demonstrating how to integrate your web application with the AP SSO Platform using `@ap-sso/auth-sdk`.

This project implements standard **OAuth 2.0 / OpenID Connect (OIDC) with PKCE**.

---

## Prerequisites

1. **Node.js**: Version 18 or higher.
2. **SSO Client ID**: Register your application in the AP SSO Admin Portal to obtain:
   - `Client ID`
   - Configure Redirect URI: `http://localhost:5173/callback`
   - Configure Logout URI (Front-Channel SLO): `http://localhost:5173/logout`
   - Required Scopes: `openid profile email roles department`

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```
*(The project includes the bundled `@ap-sso/auth-sdk` package tarball so it installs offline without requiring direct VPN or Nexus access).*

### 2. Configure SSO Settings
Update `src/config/sso.ts` with your environment values:

```typescript
export const SSO_CONFIG = {
  // SSO Auth Service URL
  authServiceUrl: 'https://apsso.online', // or 'http://localhost:3007'

  // Your registered Client ID
  clientId: 'sso_your_client_id_here',

  // Callback URL matching your registered Redirect URI
  redirectUri: 'http://localhost:5173/callback',

  // Requested scopes
  scopes: ['openid', 'profile', 'email', 'roles', 'department'],
};
```

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## How It Works

1. **Sign In (`/login`)**:
   - Clicking **"Sign In with AP SSO"** invokes `ssoAuth.platformLogin()`.
   - The user is redirected to the AP SSO login portal.
2. **Callback Handling (`/callback`)**:
   - After authentication, SSO redirects back to your callback URL with an authorization code.
   - `ssoAuth.platformHandleCallback()` securely exchanges the code for tokens via PKCE.
   - `ssoAuth.platformGetUserInfo()` loads the authenticated user's profile and navigates to `/dashboard`.
3. **Protected Dashboard (`/dashboard`)**:
   - Accesses user details via the `useAuth()` hook.
   - Provides token refresh capability and single sign-out.
4. **Single Logout (`/logout`)**:
   - Calls `/auth/logout` to revoke tokens on the server, clears local storage, and signs out of the SSO platform.

---

## Project Structure

```
├── .npmrc                 # Points @ap-sso scope to private Nexus registry
├── package.json           # Dependencies and scripts
├── src/
│   ├── config/
│   │   └── sso.ts         # SSO endpoints and client settings
│   ├── context/
│   │   └── AuthContext.tsx# Wraps @ap-sso/auth-sdk into React Context & Hook
│   ├── pages/
│   │   ├── Login.tsx      # Sign-in page
│   │   ├── Callback.tsx   # OAuth redirect handler
│   │   ├── Dashboard.tsx  # Authenticated user view
│   │   └── Logout.tsx     # Front-channel logout endpoint
│   ├── App.tsx            # Routes configuration
│   ├── index.css          # Simple, clean styles
│   └── main.tsx           # React entry point
└── README.md              # Vendor integration guide
```

---

## Standard User Claims

| Claim | Description | Example |
| :--- | :--- | :--- |
| `sub` | Unique user ID | `usr_a1b2c3d4` |
| `name` | User's full name | `Ravi Kumar` |
| `email` | Registered email | `ravi.kumar@ap.gov.in` |
| `cfmsId` | CFMS Employee ID | `10048291` |
| `role` | Assigned system role | `Commissioner` |
| `deptName` | Department name | `Finance Department` |
| `postName` | Designation / Post | `Assistant Director` |
| `apcfssDistrictName` | District | `Guntur` |
# apsso-react-demo
