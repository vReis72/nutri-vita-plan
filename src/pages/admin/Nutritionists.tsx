
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Nutritionist, getAllNutritionists } from "@/services/nutritionistService";

const Nutritionists = () => {
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [filteredNutritionists, setFilteredNutritionists] = useState<Nutritionist[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin } = useAuth();
  
  useEffect(() => {
    const fetchNutritionists = async () => {
      try {
        setIsLoading(true);
        const data = await getAllNutritionists();
        setNutritionists(data);
        setFilteredNutritionists(data);
      } catch (error) {
        console.error("Erro ao buscar nutricionistas:", error);
        toast.error("Não foi possível carregar a lista de nutricionistas");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNutritionists();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = nutritionists.filter(
        nutritionist => nutritionist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNutritionists(filtered);
    } else {
      setFilteredNutritionists(nutritionists);
    }
  }, [searchTerm, nutritionists]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  if (!isAdmin()) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Acesso Negado</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Você não tem permissão para acessar esta página.
        </p>
      </div>
    );
  }

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
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nutri-primary"></div>
        </div>
      ) : filteredNutritionists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNutritionists.map(nutritionist => (
            <Card key={nutritionist.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={nutritionist.photo_url || ""} alt={nutritionist.name} />
                      <AvatarFallback className="bg-nutri-primary text-white">
                        {nutritionist.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{nutritionist.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {nutritionist.patientCount || 0} pacientes
                      </p>
                      {nutritionist.license_number && (
                        <p className="text-xs text-muted-foreground">
                          CRN: {nutritionist.license_number}
                        </p>
                      )}
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
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium">Nenhum nutricionista encontrado</h3>
          <p className="text-gray-500 mt-2">
            {nutritionists.length === 0 
              ? "Não há nutricionistas cadastrados no sistema." 
              : "Nenhum nutricionista encontrado com o termo pesquisado."}
          </p>
        </div>
      )}
    </div>
  );
};

export default Nutritionists;
