
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginTabContent } from "@/components/auth/LoginTabContent";
import { InfoTab } from "@/components/auth/InfoTab";

const Login = () => {
  const [tab, setTab] = useState<'login' | 'info'>('login');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      redirectBasedOnRole();
    }
  }, [user]);

  const redirectBasedOnRole = () => {
    if (user?.role === "nutritionist") {
      navigate("/", { replace: true });
    } else if (user?.role === "patient") {
      navigate("/patient/progress", { replace: true });
    } else if (user?.role === "admin") {
      navigate("/admin/nutritionists", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-nutri-secondary">NutriVita<span className="text-nutri-primary">Plan</span></h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Faça login para acessar sua conta</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs value={tab} onValueChange={(value) => setTab(value as 'login' | 'info')} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="info">Informações</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} className="w-full">
              <TabsContent value="login">
                <LoginTabContent />
              </TabsContent>
              
              <TabsContent value="info">
                <InfoTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
