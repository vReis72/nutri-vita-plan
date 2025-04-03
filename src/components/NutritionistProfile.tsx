
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  whatsapp: z.string().min(10, "Número inválido"),
  crnNumber: z.string().min(4, "Número de CRN inválido"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface NutritionistProfileProps {
  initialData?: {
    name: string;
    whatsapp: string;
    crnNumber: string;
    photoUrl?: string;
  };
}

export function NutritionistProfile({ initialData }: NutritionistProfileProps) {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(
    initialData?.photoUrl
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialData?.name || "",
      whatsapp: initialData?.whatsapp || "",
      crnNumber: initialData?.crnNumber || "",
    },
  });

  function onSubmit(data: ProfileFormValues) {
    // Aqui seria implementada a lógica para salvar os dados
    toast.success("Perfil atualizado com sucesso!");
    console.log("Perfil atualizado:", { ...data, photoUrl });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Perfil do Nutricionista</h1>
        <p className="mt-1 text-gray-500">
          Gerencie suas informações profissionais
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col items-center sm:flex-row sm:items-start">
          <div className="mb-4 flex flex-col items-center sm:mb-0 sm:mr-8">
            <Avatar className="h-24 w-24 cursor-pointer">
              <AvatarImage src={photoUrl} />
              <AvatarFallback className="bg-nutri-primary text-xl text-white">
                {initialData?.name
                  ? initialData.name.charAt(0).toUpperCase()
                  : "N"}
              </AvatarFallback>
            </Avatar>
            <label
              htmlFor="profile-photo"
              className="mt-2 flex cursor-pointer items-center rounded-md border border-gray-300 px-3 py-1 text-sm text-gray-600 hover:bg-gray-50"
            >
              <Camera className="mr-1 h-4 w-4" />
              Alterar foto
            </label>
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="w-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp</FormLabel>
                        <FormControl>
                          <Input placeholder="(00) 00000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="crnNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número do CRN</FormLabel>
                        <FormControl>
                          <Input placeholder="CRN-00 00000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="submit">Salvar alterações</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Documentos e certificações</h3>
          <div className="rounded-md border border-dashed border-gray-300 p-8 text-center">
            <div className="mx-auto flex max-w-xs flex-col items-center">
              <Upload className="mb-2 h-8 w-8 text-gray-400" />
              <p className="mb-1 text-sm font-medium text-gray-900">
                Arraste e solte seus arquivos aqui
              </p>
              <p className="text-xs text-gray-500">
                Suporte para PDF, JPG, PNG até 10MB
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                type="button"
              >
                Procurar arquivos
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NutritionistProfile;
