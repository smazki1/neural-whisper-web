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
  const { roles, loading: rolesLoading } = useUserRoles(user?.id); // Always load roles for authenticated users

  console.log('ProtectedRoute Details:', { 
    userEmail: user?.email, 
    userId: user?.id, 
    loading, 
    allowedRoles, 
    roles, 
    rolesLoading,
    hasUser: !!user,
    sessionExists: !!session,
    userFromSession: session?.user?.email,
    checkingRoles: allowedRoles ? 'yes' : 'no'
  });

  // Show loading state while auth or roles are loading
  if (loading || (allowedRoles && allowedRoles.length > 0 && rolesLoading)) {
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
    console.log('No user, redirecting to auth');
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  // Check roles if required
  if (allowedRoles && allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.some(r => roles.includes(r));
    console.log('Role check:', { 
      required: allowedRoles, 
      userRoles: roles, 
      hasAccess: hasRequiredRole 
    });
    
    if (!hasRequiredRole) {
      console.log('Access denied - redirecting to home');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
