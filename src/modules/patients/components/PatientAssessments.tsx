
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockProgress } from "@/data/mockData";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const PatientAssessments = () => {
  // Simular dados de avaliações baseados no mockProgress
  const assessments = mockProgress.map((progress, index) => {
    // Criar datas fictícias começando de 3 meses atrás
    const date = new Date();
    date.setMonth(date.getMonth() - (mockProgress.length - index - 1));
    
    return {
      id: `assessment-${index}`,
      date,
      weight: progress.peso,
      bmi: progress.imc,
      bodyFat: progress.gordura,
      notes: index === mockProgress.length - 1 
        ? "Boa evolução. Continuar com o plano atual." 
        : "Ajustes no plano alimentar realizados."
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Minhas Avaliações</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Histórico de avaliações nutricionais
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Avaliações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Peso (kg)</TableHead>
                <TableHead>IMC</TableHead>
                <TableHead>Gordura (%)</TableHead>
                <TableHead>Observações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    {format(assessment.date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </TableCell>
                  <TableCell>{assessment.weight}</TableCell>
                  <TableCell>{assessment.bmi}</TableCell>
                  <TableCell>{assessment.bodyFat}</TableCell>
                  <TableCell>{assessment.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Última Avaliação</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Métricas</h3>
              <div className="space-y-2">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 dark:text-gray-400">Data:</span>
                  <span className="font-medium">
                    {format(assessments[assessments.length - 1].date, "dd/MM/yyyy")}
                  </span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 dark:text-gray-400">Peso:</span>
                  <span className="font-medium">{assessments[assessments.length - 1].weight} kg</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 dark:text-gray-400">IMC:</span>
                  <span className="font-medium">{assessments[assessments.length - 1].bmi}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 dark:text-gray-400">Gordura Corporal:</span>
                  <span className="font-medium">{assessments[assessments.length - 1].bodyFat}%</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600 dark:text-gray-400">Circunferência Abdominal:</span>
                  <span className="font-medium">82 cm</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Observações do Nutricionista</h3>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p>{assessments[assessments.length - 1].notes}</p>
                <p className="mt-2">
                  Continuar com a ingestão de água recomendada de 2L por dia e manter a prática de atividade física 3x por semana.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientAssessments;
