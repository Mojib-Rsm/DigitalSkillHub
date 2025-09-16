import { auth } from "@/auth"
 
export default auth;
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/dashboard/:path*', '/ai-tools/:path*', '/checkout/:path*'],
};
