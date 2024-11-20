'use client'
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import React from "react";


export default function AccountLockedPage() {
  const handleContactSupport = () => {
    // Logic to contact support, e.g., open a support email or redirect to a help page.
    window.location.href = "mailto:support@example.com";
  };

  const handleResetPassword = () => {
    // Logic to initiate a password reset
    // This could be a redirect to the password reset page
    // route to /auth/forgot-password
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <CardHeader className="text-center mb-4">
          <h2 className="text-2xl font-semibold">Account Locked</h2>
          <p className="text-gray-500">Your account has been temporarily locked due to multiple failed login attempts.</p>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p>Please try again later or use one of the options below to regain access.</p>
        </CardContent>

        <CardFooter className="mt-4 space-x-2">
          <Button onClick={handleResetPassword} className="w-full">
            Reset Password
          </Button>
          <Button variant="outline" onClick={handleContactSupport} className="w-full">
            Contact Support
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
