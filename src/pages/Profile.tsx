
import React from "react";
import { NutritionistProfile } from "@/components/NutritionistProfile";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const mockData = {
  name: "Dr. Ana Silva",
  whatsapp: "(11) 98765-4321",
  crnNumber: "CRN-3 12345",
  photoUrl: ""
};

const Profile = () => {
  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="flex items-center">
              <Home className="mr-1 h-3 w-3" />
              <span>Início</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Perfil</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      <NutritionistProfile initialData={mockData} />
    </div>
  );
};

export default Profile;
