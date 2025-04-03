import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowRightLeft, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { NutritionistWithProfile } from "@/types/auth.types";

interface Patient {
  id: string;
  name: string;
  email: string;
  // ... other properties
}

interface TransferPatientDialogProps {
  patient: Patient;
}

const TransferPatientDialog: React.FC<TransferPatientDialogProps> = ({ patient }) => {
  const { user, transferPatient, getAllNutritionists } = useAuth();
  const [selectedNutritionistId, setSelectedNutritionistId] = useState<string>("");
  const [isTransferring, setIsTransferring] = useState(false);
  const [open, setOpen] = useState(false);
  const [nutritionists, setNutritionists] = useState<NutritionistWithProfile[]>([]);
  
  useEffect(() => {
    const fetchNutritionists = async () => {
      if (getAllNutritionists) {
        const fetchedNutritionists = await getAllNutritionists();
        setNutritionists(fetchedNutritionists);
      }
    };
    
    fetchNutritionists();
  }, [getAllNutritionists]);
  
  // Filter nutritionists to exclude the current one
  const availableNutritionists = nutritionists.filter(
    nutritionist => nutritionist.profileId !== user?.id
  );
  
  const handleTransfer = async () => {
    if (!selectedNutritionistId) {
      toast.error("Selecione um nutricionista para transferir.");
      return;
    }
    
    setIsTransferring(true);
    try {
      if (transferPatient) {
        await transferPatient(patient.id, selectedNutritionistId);
        setOpen(false);
        toast.success(`${patient.name} foi transferido(a) com sucesso.`);
      }
    } catch (error) {
      toast.error("Erro ao transferir paciente.");
      console.error(error);
    } finally {
      setIsTransferring(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <ArrowRightLeft className="mr-2 h-4 w-4" />
          Transferir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Paciente</DialogTitle>
          <DialogDescription>
            Transferir {patient.name} para outro nutricionista.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {availableNutritionists.length > 0 ? (
            <Select 
              value={selectedNutritionistId} 
              onValueChange={setSelectedNutritionistId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um nutricionista" />
              </SelectTrigger>
              <SelectContent>
                {availableNutritionists.map((nutritionist) => (
                  <SelectItem key={nutritionist.id} value={nutritionist.id}>
                    {nutritionist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="h-5 w-5" />
              <p>Não há outros nutricionistas disponíveis.</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleTransfer} 
            disabled={!selectedNutritionistId || isTransferring}
          >
            {isTransferring ? "Transferindo..." : "Transferir Paciente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransferPatientDialog;
