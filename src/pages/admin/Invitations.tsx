
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Copy, Plus, Mail, Link as LinkIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/contexts/auth/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Invitation {
  id: string;
  code: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  expires_at: string;
  used_at: string | null;
  used_by: string | null;
}

const InvitationsPage = () => {
  const { user, isAdmin } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"active" | "used">("active");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    
    loadInvitations();
  }, [user, activeTab]);
  
  const loadInvitations = async () => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('invitations')
        .select('*');
        
      // Filtrar apenas os convites do nutricionista atual se não for admin
      if (!isAdmin()) {
        query = query.eq('created_by', user?.id);
      }
      
      // Filtrar por status (usado ou não)
      if (activeTab === "active") {
        query = query.is('used_at', null);
      } else {
        query = query.not('used_at', 'is', null);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error("Erro ao carregar convites:", error);
        toast.error("Erro ao carregar convites");
      } else {
        setInvitations(data as Invitation[]);
      }
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copiado para área de transferência!");
  };
  
  const getInvitationLink = (code: string) => {
    return `${window.location.origin}/signup?code=${code}`;
  };
  
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR');
  };
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Convites</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Gerenciar convites para novos usuários</p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Criar Convite
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Convites</CardTitle>
          <CardDescription>Gerencie os convites para novos usuários do sistema</CardDescription>
          
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "active" | "used")} className="w-full mt-2">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="active">Ativos</TabsTrigger>
              <TabsTrigger value="used">Utilizados</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <p>Carregando convites...</p>
            </div>
          ) : invitations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">Nenhum convite {activeTab === "active" ? "ativo" : "utilizado"}.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead>{activeTab === "active" ? "Expira em" : "Usado em"}</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map(invitation => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-mono">{invitation.code.substring(0, 8)}...</TableCell>
                      <TableCell>{invitation.email || "Qualquer email"}</TableCell>
                      <TableCell>
                        {invitation.role === "patient" ? "Paciente" : 
                         invitation.role === "nutritionist" ? "Nutricionista" : 
                         "Admin"}
                      </TableCell>
                      <TableCell>{formatDate(invitation.created_at)}</TableCell>
                      <TableCell>
                        {activeTab === "active" 
                          ? formatDate(invitation.expires_at)
                          : invitation.used_at ? formatDate(invitation.used_at) : "N/A"}
                      </TableCell>
                      <TableCell>
                        {activeTab === "active" && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline"
                              size="icon"
                              onClick={() => copyToClipboard(getInvitationLink(invitation.code))}
                              title="Copiar link"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            
                            {invitation.email && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => window.open(`mailto:${invitation.email}?subject=Convite%20para%20NutriVitaPlan&body=Acesse%20este%20link%20para%20se%20cadastrar%3A%20${encodeURIComponent(getInvitationLink(invitation.code))}`)}
                                title="Enviar por email"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <CreateInvitationDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onInvitationCreated={() => {
          loadInvitations();
          setIsCreateDialogOpen(false);
        }}
        isAdmin={isAdmin()}
      />
    </div>
  );
};

interface CreateInvitationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onInvitationCreated: () => void;
  isAdmin: boolean;
}

const CreateInvitationDialog: React.FC<CreateInvitationDialogProps> = ({ 
  isOpen, 
  onClose, 
  onInvitationCreated,
  isAdmin 
}) => {
  const [invitationType, setInvitationType] = useState<"email" | "link">("email");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [expirationDays, setExpirationDays] = useState("7");
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useAuth();

  const createInvitation = async () => {
    if (invitationType === "email" && !email) {
      toast.error("Por favor, insira um email");
      return;
    }
    
    setIsCreating(true);
    
    try {
      const code = nanoid(16); // Gera um código único de 16 caracteres
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + parseInt(expirationDays));
      
      const { data, error } = await supabase
        .from('invitations')
        .insert([{
          code,
          email: invitationType === "email" ? email : null,
          role,
          created_by: user?.id,
          expires_at: expirationDate.toISOString(),
        }])
        .select()
        .single();
      
      if (error) {
        console.error("Erro ao criar convite:", error);
        toast.error("Erro ao criar convite");
        throw error;
      }
      
      toast.success("Convite criado com sucesso!");
      
      if (invitationType === "link") {
        // Se for um convite por link, copiar para área de transferência
        const invitationLink = `${window.location.origin}/signup?code=${code}`;
        navigator.clipboard.writeText(invitationLink);
        toast.success("Link de convite copiado para área de transferência");
      }
      
      onInvitationCreated();
      
    } catch (error) {
      console.error("Erro ao criar convite:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Convite</DialogTitle>
          <DialogDescription>
            Crie um convite para novos usuários se registrarem no sistema.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={invitationType === "email" ? "default" : "outline"}
              onClick={() => setInvitationType("email")}
              className="flex items-center justify-center"
            >
              <Mail className="mr-2 h-4 w-4" /> Por Email
            </Button>
            
            <Button
              variant={invitationType === "link" ? "default" : "outline"}
              onClick={() => setInvitationType("link")}
              className="flex items-center justify-center"
            >
              <LinkIcon className="mr-2 h-4 w-4" /> Link Genérico
            </Button>
          </div>
          
          {invitationType === "email" && (
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="role">Tipo de Usuário</Label>
            <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de usuário" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="patient">Paciente</SelectItem>
                <SelectItem value="nutritionist">Nutricionista</SelectItem>
                {isAdmin && <SelectItem value="admin">Administrador</SelectItem>}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="expiration">Validade (dias)</Label>
            <Select value={expirationDays} onValueChange={setExpirationDays}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a validade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 dia</SelectItem>
                <SelectItem value="3">3 dias</SelectItem>
                <SelectItem value="7">7 dias</SelectItem>
                <SelectItem value="14">14 dias</SelectItem>
                <SelectItem value="30">30 dias</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={createInvitation} disabled={isCreating}>
            {isCreating ? "Criando..." : "Criar Convite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationsPage;
