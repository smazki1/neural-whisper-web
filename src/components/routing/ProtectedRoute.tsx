import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles, AppRole } from "@/hooks/useUserRoles";
import { Skeleton } from "@/components/ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: AppRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { user, session, loading } = useAuth();
  const { roles, loading: rolesLoading } = useUserRoles(user?.id);

  console.log('[ProtectedRoute] Render:', { 
    userEmail: user?.email, 
    userId: user?.id, 
    authLoading: loading,
    rolesLoading,
    allowedRoles, 
    currentRoles: roles,
    hasUser: !!user,
    sessionExists: !!session,
    willCheckRoles: allowedRoles && allowedRoles.length > 0,
    timestamp: new Date().toISOString()
  });

  // CRITICAL: Wait for auth to complete first
  if (loading) {
    console.log('[ProtectedRoute] Showing loading state: auth loading');
    return (
      <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('[ProtectedRoute] No user found, redirecting to /auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // CRITICAL: If roles are required, wait for roles to load completely
  if (allowedRoles && allowedRoles.length > 0 && rolesLoading) {
    console.log('[ProtectedRoute] Showing loading state: roles loading');
    return (
      <div className="container mx-auto px-6 lg:px-8 pt-28 pb-16">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-6 w-40" />
        </div>
      </div>
    );
  }


  // Check roles if required
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(r => roles.includes(r));
    console.log('[ProtectedRoute] Role authorization check:', { 
      requiredRoles: allowedRoles, 
      userRoles: roles, 
      hasRequiredRole,
      willAllowAccess: hasRequiredRole
    });
    
    if (!hasRequiredRole) {
      console.log('[ProtectedRoute] ACCESS DENIED - User lacks required roles, redirecting to /');
      return <Navigate to="/" replace />;
    }
    
    console.log('[ProtectedRoute] ACCESS GRANTED - User has required role');
  }
  
  console.log('[ProtectedRoute] Rendering protected content');

  return <>{children}</>;
};

export default ProtectedRoute;
