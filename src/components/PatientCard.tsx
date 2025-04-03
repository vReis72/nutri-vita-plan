
import React from "react";
import { Link } from "react-router-dom";
import { Patient } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, User } from "lucide-react";

interface PatientCardProps {
  patient: Patient;
}

const goalColors = {
  weightLoss: "bg-blue-100 text-blue-800",
  weightGain: "bg-green-100 text-green-800",
  maintenance: "bg-amber-100 text-amber-800",
};

const goalLabels = {
  weightLoss: "Emagrecimento",
  weightGain: "Ganho de massa",
  maintenance: "Manutenção",
};

export const PatientCard: React.FC<PatientCardProps> = ({ patient }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="bg-nutri-primary h-2"></div>
        <div className="p-5">
          <div className="flex items-center space-x-3">
            <div className="rounded-full w-12 h-12 bg-nutri-light flex items-center justify-center text-nutri-secondary">
              <User size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{patient.name}</h3>
              <p className="text-sm text-gray-500">
                {patient.age} anos • {patient.gender === "male" ? "Masculino" : "Feminino"}
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Altura:</span>
              <span className="font-medium">{patient.height} cm</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Peso:</span>
              <span className="font-medium">{patient.weight} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Objetivo:</span>
              <Badge className={goalColors[patient.goal]} variant="outline">
                {goalLabels[patient.goal]}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 p-3 flex justify-end">
        <Link
          to={`/patients/${patient.id}`}
          className="text-sm font-medium text-nutri-secondary flex items-center hover:text-nutri-primary transition-colors"
        >
          Ver detalhes <ArrowRight size={16} className="ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PatientCard;
