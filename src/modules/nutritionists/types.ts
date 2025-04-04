
export interface Nutritionist {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  whatsapp?: string;
  crnNumber?: string;
  associatedPatients?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
