import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, requiredPermission }) => {
  const adminStr = localStorage.getItem('adminUser');
  
  if (!adminStr) {
    return <Navigate to="/admin" replace />;
  }

  const admin = JSON.parse(adminStr);

  // SuperAdmin bypasses all checks
  if (admin.role === 'superadmin') {
    return children;
  }

  // Check specific permission if required (adminHome is generally allowed for all admins)
  if (requiredPermission && !admin.permissions.includes(requiredPermission)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-500">You do not have permission to view this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;