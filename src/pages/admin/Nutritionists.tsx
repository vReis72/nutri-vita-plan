
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, UserPlus, Search } from "lucide-react";

const Nutritionists = () => {
  const { getAllNutritionists } = useAuth();
  const nutritionists = getAllNutritionists();
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Nutricionistas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie os nutricionistas da plataforma</p>
        </div>
        <Button 
          className="mt-4 md:mt-0 bg-nutri-primary hover:bg-nutri-secondary"
        >
          <UserPlus size={18} className="mr-2" />
          Novo Nutricionista
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar nutricionistas..."
          className="pl-10"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nutritionists.map(nutritionist => (
          <Card key={nutritionist.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={nutritionist.photoUrl || ""} alt={nutritionist.name} />
                    <AvatarFallback className="bg-nutri-primary text-white">
                      {nutritionist.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{nutritionist.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {nutritionist.associatedPatients?.length || 0} pacientes
                    </p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex justify-between mt-4">
                <Button size="sm" variant="outline">
                  Editar
                </Button>
                <Button size="sm" variant="destructive">
                  Remover
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Nutritionists;
