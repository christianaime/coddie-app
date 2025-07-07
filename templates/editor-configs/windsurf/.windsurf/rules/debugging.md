# Debugging Guidelines & Bug Documentation

This document provides systematic debugging approaches and maintains a record of solved bugs for future reference.

## Debugging Methodology

### 1. Systematic Problem Solving
- **Reproduce First:** Always reproduce the issue consistently before attempting fixes
- **Isolate the Problem:** Use binary search approach - disable half the code/features to narrow down the source
- **Check Recent Changes:** Review recent commits, deployments, or configuration changes that might be related
- **Read Error Messages Carefully:** Don't skip over error details - they often contain the exact solution

### 2. Debugging Tools & Techniques

#### Frontend Debugging
- **Browser DevTools:** Use Console, Network, Sources, and Application tabs effectively
- **React DevTools:** Inspect component state, props, and re-render cycles
- **Console Logging:** Use `console.log()`, `console.error()`, `console.warn()` strategically
- **Breakpoints:** Set breakpoints in browser DevTools or Windsurf for step-through debugging
- **Network Tab:** Check API calls, response codes, and payload data

#### Backend/Server Debugging
- **Server Logs:** Check Vercel logs, Supabase logs, and application console output
- **API Testing:** Use tools like Postman, Insomnia, or curl to test endpoints independently
- **Database Inspection:** Use Supabase dashboard or SQL queries to verify data state
- **Environment Variables:** Verify all required env vars are set correctly in deployment
- **Next.js DevTools:** Use built-in debugging for Server Components and API routes

#### Performance Debugging
- **Lighthouse:** Analyze Core Web Vitals and performance metrics
- **React Profiler:** Identify slow components and unnecessary re-renders
- **Network Analysis:** Check for slow API calls, large bundle sizes, or excessive requests
- **Memory Leaks:** Use browser DevTools Memory tab to identify memory issues

### 3. Common Debugging Scenarios

#### Authentication Issues
1. Check browser cookies and localStorage for session tokens
2. Verify Supabase RLS policies are correctly configured
3. Test API endpoints with proper authorization headers
4. Review middleware configurations

#### Database Issues
1. Test queries directly in Supabase SQL editor
2. Check RLS policies with different user contexts
3. Verify table schemas and column types
4. Review foreign key constraints and relationships

#### API/Network Issues
1. Check network requests in browser DevTools
2. Verify API endpoint URLs and HTTP methods
3. Inspect request/response headers and payloads
4. Test with different user accounts or permissions

#### Build/Deployment Issues
1. Check Vercel build logs for compilation errors
2. Verify environment variables in deployment settings
3. Test locally with production environment variables
4. Review Next.js configuration and dependencies

### 4. Documentation Requirements
- **Document the Problem:** Clear description of symptoms and reproduction steps
- **Document the Root Cause:** What exactly was causing the issue
- **Document the Solution:** Step-by-step fix and why it works
- **Document Prevention:** How to avoid this issue in the future

---

## Documented Bug Solutions

> **Note:** Add solved bugs below with detailed documentation for future reference

### Template Entry Format
```
### Bug: [Brief Description]
**Date Solved:** YYYY-MM-DD
**Severity:** Low/Medium/High/Critical
**Category:** Frontend/Backend/Database/Performance/Security

**Problem:**
Detailed description of the issue, symptoms, and impact.

**Root Cause:**
Technical explanation of what was causing the problem.

**Solution:**
Step-by-step solution with code examples if applicable.

**Prevention:**
How to avoid this issue in future development.

**Related:**
- Links to relevant documentation
- Related GitHub issues/PRs
- Stack Overflow references
```

---

### Bug: Next.js __dirname Not Defined in ES Modules
**Date Solved:** 2025-01-XX
**Severity:** Medium
**Category:** Backend

**Problem:**
`ReferenceError: __dirname is not defined` when using ES modules in Node.js/Next.js projects with `"type": "module"` in package.json.

**Root Cause:**
ES modules don't have the global `__dirname` variable that's available in CommonJS. This variable needs to be manually created using `import.meta.url`.

**Solution:**
```typescript
import { fileURLToPath } from "node:url";
import path from "node:path";

// ES modules equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

**Prevention:**
- Always use the ES modules pattern above when `"type": "module"` is set
- Consider creating a utility function for this conversion
- Add ESLint rules to catch __dirname usage in ES modules

**Related:**
- [Node.js ES Modules Documentation](https://nodejs.org/api/esm.html)

---

### Bug: Supabase RLS Policy Not Working
**Date Solved:** [Template]
**Severity:** High
**Category:** Database/Security

**Problem:**
Users could access data they shouldn't have access to despite RLS policies being enabled.

**Root Cause:**
RLS policy was using `user_id = auth.uid()` but the column was nullable, causing the policy to fail silently.

**Solution:**
```sql
-- Fixed policy
CREATE POLICY "Users can only access their own data" ON table_name
FOR ALL USING (user_id = auth.uid() AND user_id IS NOT NULL);
```

**Prevention:**
- Always test RLS policies with different user contexts
- Make user_id columns NOT NULL where appropriate
- Use Supabase policy simulator for testing

**Related:**
- Supabase RLS documentation
- Security observability guidelines

---

*Add more documented bugs here as they are encountered and solved...*