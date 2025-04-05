import { Notification, UserProfile } from "./types";

// Mock notifications for testing (we'll keep these for now)
export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Nova avaliação",
    message: "Sua nova avaliação foi agendada para amanhã às 15h",
    date: new Date(),
    read: false,
    recipientId: "user-1"
  },
  {
    id: "2",
    title: "Plano alimentar atualizado",
    message: "Seu nutricionista atualizou seu plano alimentar",
    date: new Date(),
    read: true,
    recipientId: "user-1"
  },
  {
    id: "3",
    title: "Novo paciente",
    message: "Maria Silva foi adicionada à sua lista de pacientes",
    date: new Date(),
    read: false,
    recipientId: "nutr-1"
  }
];

// Mock users for testing (we'll keep these for now)
export const mockUsers: UserProfile[] = [
  // Nutricionistas
  {
    id: "nutr-1",
    name: "Dr. Ana Silva",
    role: "nutritionist",
    photoUrl: "",
    associatedPatients: ["patient-1", "patient-2"]
  },
  {
    id: "nutr-2",
    name: "Dr. Carlos Oliveira",
    role: "nutritionist",
    photoUrl: "",
    associatedPatients: ["patient-3"]
  },
  {
    id: "nutr-3",
    name: "Dr. Marta Souza",
    role: "nutritionist",
    photoUrl: "",
    associatedPatients: []
  },
  // Pacientes
  {
    id: "user-1",
    name: "Maria Silva",
    role: "patient",
    patientId: "patient-1",
    nutritionistId: "nutr-1"
  },
  {
    id: "user-2",
    name: "João Santos",
    role: "patient",
    patientId: "patient-2",
    nutritionistId: "nutr-1"
  },
  {
    id: "user-3",
    name: "Pedro Costa",
    role: "patient",
    patientId: "patient-3",
    nutritionistId: "nutr-2"
  },
  // Admin
  {
    id: "admin-1",
    name: "Admin",
    role: "admin"
  }
];
