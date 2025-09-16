
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token
  }
})
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/dashboard/:path*', '/ai-tools/:path*', '/checkout/:path*'],
};
