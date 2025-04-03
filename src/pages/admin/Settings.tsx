
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Settings as SettingsIcon, Mail, Bell, Shield, Image, Phone, Building } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Settings = () => {
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [logoPreview, setLogoPreview] = useState<string>("");
  
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configurações</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Gerencie as configurações da plataforma</p>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-4 md:w-[500px]">
          <TabsTrigger value="geral">Geral</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="seguranca">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="h-5 w-5 mr-2" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>
                Configure as opções gerais da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Modo Manutenção</p>
                    <p className="text-sm text-muted-foreground">
                      Ativa o modo de manutenção para todos os usuários
                    </p>
                  </div>
                  <Switch id="maintenance-mode" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Permitir Registro de Nutricionistas</p>
                    <p className="text-sm text-muted-foreground">
                      Permite que novos nutricionistas se registrem na plataforma
                    </p>
                  </div>
                  <Switch id="allow-nutritionist-registration" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="app-name">Nome da Aplicação</Label>
                  <Input id="app-name" defaultValue="NutriVitaPlan" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Logo da Plataforma</Label>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-24 w-24 rounded-md">
                      {logoPreview ? (
                        <AvatarImage src={logoPreview} alt="Logo Preview" className="object-cover" />
                      ) : (
                        <AvatarFallback className="rounded-md bg-muted flex items-center justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <Input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="mb-2"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tamanho recomendado: 512x512 pixels, formato PNG ou JPG
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="mt-4">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contato" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Informações de Contato
              </CardTitle>
              <CardDescription>
                Configure as informações de contato da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-email">E-mail de Contato</Label>
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input id="contact-email" type="email" placeholder="contato@empresa.com" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Telefone de Contato</Label>
                  <div className="flex items-center">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input id="contact-phone" type="tel" placeholder="(00) 00000-0000" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Textarea 
                    id="company-address" 
                    placeholder="Rua Exemplo, 123 - Bairro, Cidade - UF, CEP" 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="about-company">Sobre a Empresa</Label>
                  <Textarea 
                    id="about-company" 
                    placeholder="Breve descrição sobre a empresa e seus serviços" 
                  />
                </div>
              </div>
              
              <Button className="mt-4">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notificacoes" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Configurações de Notificações
              </CardTitle>
              <CardDescription>
                Configure como as notificações são enviadas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações por E-mail</p>
                    <p className="text-sm text-muted-foreground">
                      Envia notificações por e-mail para os usuários
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notificações no Aplicativo</p>
                    <p className="text-sm text-muted-foreground">
                      Exibe notificações dentro da plataforma
                    </p>
                  </div>
                  <Switch id="app-notifications" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email-from">E-mail de Envio</Label>
                  <Input id="email-from" defaultValue="noreply@nutrivitaplan.com" />
                </div>
              </div>
              
              <Button className="mt-4">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="seguranca" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Configure as opções de segurança da plataforma.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Autenticação de Dois Fatores</p>
                    <p className="text-sm text-muted-foreground">
                      Requer autenticação de dois fatores para todos os usuários
                    </p>
                  </div>
                  <Switch id="two-factor-auth" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bloqueio de Conta após Tentativas</p>
                    <p className="text-sm text-muted-foreground">
                      Bloqueia contas após múltiplas tentativas de login
                    </p>
                  </div>
                  <Switch id="account-lockout" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Tempo de Sessão (minutos)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                </div>
              </div>
              
              <Button className="mt-4">Salvar Alterações</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
