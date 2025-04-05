
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Book, Code, Users, UserCircle, Settings, Utensils, BarChart2, Calculator } from "lucide-react";
import { 
  Tabs, 
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("userGuide");

  return (
    <div className="container mx-auto py-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-6">
        <Book className="h-6 w-6 text-nutri-primary" />
        <h1 className="text-3xl font-bold">Documentação NutriVitaPlan</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 mb-8">
          <TabsTrigger value="userGuide" className="text-base">
            <Book className="mr-2 h-4 w-4" />
            Guia do Usuário
          </TabsTrigger>
          <TabsTrigger value="developerGuide" className="text-base">
            <Code className="mr-2 h-4 w-4" />
            Documentação Técnica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="userGuide" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Guia Completo de Usuário</h2>
              <p className="text-gray-600 mb-6">
                Bem-vindo ao manual do usuário do NutriVitaPlan. Este guia fornece informações detalhadas
                sobre como utilizar todas as funcionalidades do sistema para diferentes tipos de usuários.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <UserRoleCard 
                  icon={UserCircle} 
                  title="Nutricionistas" 
                  description="Gerencie pacientes, planos alimentares e avaliações" 
                />
                <UserRoleCard 
                  icon={Users} 
                  title="Pacientes" 
                  description="Acompanhe progresso, dietas e comunicação com nutricionistas" 
                />
                <UserRoleCard 
                  icon={Settings} 
                  title="Administradores" 
                  description="Gerencie nutricionistas e configurações do sistema" 
                />
              </div>

              <Accordion type="single" collapsible className="w-full">
                {/* Seção para Nutricionistas */}
                <AccordionSection 
                  value="nutritionist" 
                  title="Para Nutricionistas" 
                  icon={UserCircle}
                >
                  <AccordionItem value="dashboard">
                    <AccordionTrigger className="text-base">Dashboard</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">O Dashboard oferece uma visão geral de seus pacientes e atividades recentes:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Estatísticas de pacientes ativos</li>
                        <li>Consultas agendadas para hoje e próximos dias</li>
                        <li>Tarefas pendentes e notificações</li>
                      </ul>
                      <p className="mt-4">Para acessar o dashboard, faça login com suas credenciais de nutricionista e você será redirecionado automaticamente para a página inicial.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="patients">
                    <AccordionTrigger className="text-base">Gerenciamento de Pacientes</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">Na seção Pacientes, você pode:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Visualizar lista completa de seus pacientes</li>
                        <li>Adicionar novos pacientes com informações básicas</li>
                        <li>Acessar perfil detalhado de cada paciente</li>
                        <li>Registrar novas avaliações e medidas</li>
                        <li>Criar e atualizar planos alimentares</li>
                      </ul>
                      <p className="mt-4">Para acessar, clique em "Pacientes" no menu lateral.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="dietPlans">
                    <AccordionTrigger className="text-base">Planos Alimentares</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">A funcionalidade de Planos Alimentares permite:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Criar planos personalizados para cada paciente</li>
                        <li>Definir macronutrientes e calorias totais</li>
                        <li>Organizar refeições e horários</li>
                        <li>Adicionar alimentos com porções específicas</li>
                        <li>Gerar PDF para compartilhar com pacientes</li>
                      </ul>
                      <p className="mt-4">Acesse através do menu "Planos Alimentares" ou diretamente do perfil de um paciente.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="assessments">
                    <AccordionTrigger className="text-base">Avaliações</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">O sistema de Avaliações permite:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Registrar medidas antropométricas dos pacientes</li>
                        <li>Calcular IMC, taxa metabólica basal e outros índices</li>
                        <li>Acompanhar evolução do paciente ao longo do tempo</li>
                        <li>Adicionar fotos de evolução (antes/depois)</li>
                        <li>Incluir anotações importantes em cada avaliação</li>
                      </ul>
                      <p className="mt-4">Acesse através do menu "Avaliações" ou diretamente do perfil de um paciente.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="calculator">
                    <AccordionTrigger className="text-base">Calculadora Nutricional</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">A Calculadora Nutricional oferece:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Cálculo de necessidades calóricas</li>
                        <li>Distribuição de macronutrientes baseada em diferentes objetivos</li>
                        <li>Estimativa de taxa metabólica basal por diferentes fórmulas</li>
                        <li>Cálculo de IMC e classificação</li>
                        <li>Relação cintura-quadril e outras métricas</li>
                      </ul>
                      <p className="mt-4">Acesse através do menu "Calculadora" na barra lateral.</p>
                    </AccordionContent>
                  </AccordionItem>
                </AccordionSection>

                {/* Seção para Pacientes */}
                <AccordionSection 
                  value="patient" 
                  title="Para Pacientes" 
                  icon={Users}
                >
                  <AccordionItem value="patientProgress">
                    <AccordionTrigger className="text-base">Acompanhamento de Progresso</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">Na área de Progresso, você pode:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Visualizar gráficos de evolução de peso e outras medidas</li>
                        <li>Acompanhar histórico completo de avaliações</li>
                        <li>Ver fotos de antes/depois (se disponíveis)</li>
                        <li>Verificar seu progresso em direção às metas estabelecidas</li>
                      </ul>
                      <p className="mt-4">Acesse através da opção "Progresso" no menu após fazer login como paciente.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="patientDietPlans">
                    <AccordionTrigger className="text-base">Visualização de Planos Alimentares</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">Na seção de Planos Alimentares, você pode:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Consultar seu plano alimentar atual</li>
                        <li>Ver detalhes de cada refeição e horários</li>
                        <li>Verificar informações nutricionais dos alimentos</li>
                        <li>Baixar seu plano em formato PDF</li>
                        <li>Acessar histórico de planos anteriores</li>
                      </ul>
                      <p className="mt-4">Acesse através da opção "Plano Alimentar" no menu após fazer login como paciente.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="patientProfile">
                    <AccordionTrigger className="text-base">Perfil do Paciente</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">No seu Perfil, você pode:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Atualizar informações pessoais</li>
                        <li>Alterar sua foto de perfil</li>
                        <li>Gerenciar preferências de notificação</li>
                        <li>Alterar senha e configurações de segurança</li>
                      </ul>
                      <p className="mt-4">Acesse através da opção "Perfil" no menu após fazer login como paciente.</p>
                    </AccordionContent>
                  </AccordionItem>
                </AccordionSection>

                {/* Seção para Administradores */}
                <AccordionSection 
                  value="admin" 
                  title="Para Administradores" 
                  icon={Settings}
                >
                  <AccordionItem value="adminNutritionists">
                    <AccordionTrigger className="text-base">Gerenciamento de Nutricionistas</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">Como administrador, você pode gerenciar nutricionistas:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Visualizar lista completa de nutricionistas</li>
                        <li>Adicionar novos nutricionistas ao sistema</li>
                        <li>Editar informações profissionais</li>
                        <li>Ativar ou desativar contas</li>
                        <li>Monitorar número de pacientes por nutricionista</li>
                      </ul>
                      <p className="mt-4">Acesse através da opção "Nutricionistas" no menu administrativo.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="adminPatients">
                    <AccordionTrigger className="text-base">Gerenciamento de Pacientes</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">A área administrativa de pacientes permite:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Visualizar todos os pacientes no sistema</li>
                        <li>Transferir pacientes entre nutricionistas</li>
                        <li>Resolver problemas de acesso dos pacientes</li>
                        <li>Gerar relatórios de atividade</li>
                      </ul>
                      <p className="mt-4">Acesse através da opção "Pacientes" no menu administrativo.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="adminSettings">
                    <AccordionTrigger className="text-base">Configurações do Sistema</AccordionTrigger>
                    <AccordionContent>
                      <p className="mb-4">As configurações administrativas incluem:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Gerenciamento de permissões e níveis de acesso</li>
                        <li>Configurações de notificações do sistema</li>
                        <li>Personalização da interface</li>
                        <li>Backup e recuperação de dados</li>
                        <li>Logs de auditoria e segurança</li>
                      </ul>
                      <p className="mt-4">Acesse através da opção "Configurações" no menu administrativo.</p>
                    </AccordionContent>
                  </AccordionItem>
                </AccordionSection>

                {/* Seção de FAQ */}
                <AccordionItem value="faq">
                  <AccordionTrigger className="text-lg font-semibold">Perguntas Frequentes (FAQ)</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Como faço login no sistema?</h4>
                        <p className="text-gray-600">Para fazer login, acesse a página inicial e insira seu email e senha. Se não tiver uma conta, clique em "Criar conta" para se registrar.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Esqueci minha senha, como posso recuperá-la?</h4>
                        <p className="text-gray-600">Na tela de login, clique em "Esqueceu a senha?" e siga as instruções para redefinir sua senha através do seu email cadastrado.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Como adicionar um novo paciente?</h4>
                        <p className="text-gray-600">Nutricionistas podem adicionar novos pacientes na seção "Pacientes", clicando no botão "Novo Paciente" e preenchendo as informações solicitadas.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Como criar um plano alimentar?</h4>
                        <p className="text-gray-600">Na página do paciente, clique em "Novo Plano Alimentar", defina as metas e macronutrientes, adicione as refeições e alimentos necessários.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Como transferir um paciente para outro nutricionista?</h4>
                        <p className="text-gray-600">Administradores podem acessar a lista de pacientes, selecionar o paciente desejado e utilizar a opção "Transferir" para designá-lo a outro nutricionista.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="developerGuide" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">Documentação Técnica para Desenvolvedores</h2>
              <p className="text-gray-600 mb-6">
                Esta documentação fornece informações técnicas para desenvolvedores que desejam entender
                ou contribuir com o sistema NutriVitaPlan.
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="architecture">
                  <AccordionTrigger className="text-lg font-semibold">Arquitetura do Sistema</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O NutriVitaPlan é uma aplicação web fullstack construída com as seguintes tecnologias:</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Frontend:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>React 18 com TypeScript</li>
                          <li>Vite como bundler</li>
                          <li>Tailwind CSS para estilização</li>
                          <li>shadcn/ui para componentes de interface</li>
                          <li>React Router para navegação</li>
                          <li>TanStack Query para gerenciamento de estado e requisições</li>
                          <li>React Hook Form para formulários</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Backend:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li>Supabase para autenticação, banco de dados e armazenamento</li>
                          <li>PostgreSQL como banco de dados relacional</li>
                          <li>Row Level Security (RLS) para segurança de dados</li>
                          <li>Supabase Edge Functions para lógica de backend</li>
                        </ul>
                      </div>
                      
                      <p className="mt-2">
                        A arquitetura segue um modelo de componentes React organizados por módulos
                        funcionais (pacientes, nutricionistas, avaliações, etc.), com serviços
                        separados para comunicação com a API e lógica de negócios.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="folderStructure">
                  <AccordionTrigger className="text-lg font-semibold">Estrutura de Pastas</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O projeto está organizado da seguinte forma:</p>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
                        <pre className="text-sm">
{`src/
├── components/     # Componentes reutilizáveis
│   ├── ui/         # Componentes de interface (shadcn/ui)
│   └── ...         # Outros componentes gerais
├── contexts/       # Contextos React (AuthContext, etc.)
├── hooks/          # Custom hooks
├── integrations/   # Integrações com serviços externos
│   └── supabase/   # Cliente e tipos do Supabase
├── lib/            # Funções utilitárias
├── modules/        # Módulos por domínio
│   ├── patients/   # Componentes e lógica relacionados a pacientes
│   ├── nutritionists/
│   ├── assessments/
│   └── diet-plans/
├── pages/          # Componentes de página
│   └── admin/      # Páginas administrativas
├── types/          # Definições de tipos TypeScript
└── App.tsx         # Componente principal da aplicação`}
                        </pre>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="dataModel">
                  <AccordionTrigger className="text-lg font-semibold">Modelo de Dados</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema utiliza o seguinte modelo de dados no PostgreSQL:</p>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Principais entidades:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                          <li><strong>profiles</strong>: Informações básicas dos usuários (id, nome, função)</li>
                          <li><strong>nutritionists</strong>: Dados específicos de nutricionistas</li>
                          <li><strong>patients</strong>: Dados específicos de pacientes</li>
                          <li><strong>assessments</strong>: Registros de avaliações físicas</li>
                          <li><strong>diet_plans</strong>: Planos alimentares</li>
                          <li><strong>meals</strong>: Refeições associadas a planos alimentares</li>
                          <li><strong>foods</strong>: Catálogo de alimentos com informações nutricionais</li>
                          <li><strong>meal_foods</strong>: Relação entre refeições e alimentos (com quantidade)</li>
                        </ul>
                      </div>
                      
                      <p>O sistema implementa Row Level Security (RLS) para garantir que usuários só possam acessar dados permitidos para seu perfil.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="authentication">
                  <AccordionTrigger className="text-lg font-semibold">Autenticação e Autorização</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema utiliza o Supabase Auth para gerenciamento de autenticação:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Autenticação por email/senha</li>
                        <li>Sistema de convites para novos usuários</li>
                        <li>Recuperação de senha por email</li>
                        <li>Tokens JWT para autenticação de API</li>
                      </ul>
                      
                      <p className="mt-2">A autorização é implementada usando:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Row Level Security (RLS) no banco de dados</li>
                        <li>Roles de usuário: admin, nutritionist, patient</li>
                        <li>Componente ProtectedRoute para proteção de rotas no frontend</li>
                      </ul>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-2">
                        <code className="text-sm">
                          {`// Exemplo de uso do ProtectedRoute
<Route 
  element={
    <ProtectedRoute allowedRoles={["nutritionist"]}>
      <Layout />
    </ProtectedRoute>
  }
>
  {/* Rotas protegidas */}
</Route>`}
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="apiEndpoints">
                  <AccordionTrigger className="text-lg font-semibold">Endpoints de API</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema utiliza a API do Supabase para todas as operações de dados:</p>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                          <thead>
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Recurso</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Operações</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Permissões</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                              <td className="px-4 py-2 whitespace-nowrap">profiles</td>
                              <td className="px-4 py-2">GET, UPDATE</td>
                              <td className="px-4 py-2">Usuário proprietário, Admin</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 whitespace-nowrap">patients</td>
                              <td className="px-4 py-2">GET, CREATE, UPDATE, DELETE</td>
                              <td className="px-4 py-2">Nutricionista associado, Admin</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 whitespace-nowrap">nutritionists</td>
                              <td className="px-4 py-2">GET, CREATE, UPDATE, DELETE</td>
                              <td className="px-4 py-2">Usuário proprietário, Admin</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 whitespace-nowrap">assessments</td>
                              <td className="px-4 py-2">GET, CREATE, UPDATE, DELETE</td>
                              <td className="px-4 py-2">Nutricionista associado, Paciente proprietário</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-2 whitespace-nowrap">diet_plans</td>
                              <td className="px-4 py-2">GET, CREATE, UPDATE, DELETE</td>
                              <td className="px-4 py-2">Nutricionista associado, Paciente proprietário</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="uiComponents">
                  <AccordionTrigger className="text-lg font-semibold">Componentes de UI</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema utiliza componentes do shadcn/ui, que são componentes React não empacotados baseados no Radix UI:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Button:</strong> Botões estilizados com variantes</li>
                        <li><strong>Card:</strong> Container para conteúdo com estilos consistentes</li>
                        <li><strong>Dialog:</strong> Modais e pop-ups</li>
                        <li><strong>Form:</strong> Componentes de formulário controlado</li>
                        <li><strong>Tabs:</strong> Navegação por tabs</li>
                        <li><strong>Toast:</strong> Notificações</li>
                        <li><strong>Sidebar:</strong> Menu lateral responsivo</li>
                      </ul>
                      
                      <p className="mt-2">
                        Todos os componentes são estilizados com Tailwind CSS e são completamente
                        personalizáveis. Os componentes seguem princípios de acessibilidade e são
                        compatíveis com modo escuro.
                      </p>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                        <code className="text-sm">
                          {`// Exemplo de uso de componente
import { Button } from "@/components/ui/button";

<Button 
  variant="default" 
  size="sm" 
  onClick={handleClick}
>
  Salvar alterações
</Button>`}
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="stateManagement">
                  <AccordionTrigger className="text-lg font-semibold">Gerenciamento de Estado</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema utiliza diversas estratégias para gerenciamento de estado:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>React Context:</strong> Para estado global como autenticação</li>
                        <li><strong>TanStack Query:</strong> Para gerenciamento de estado de servidor e cache</li>
                        <li><strong>React Hook Form:</strong> Para estado de formulários</li>
                        <li><strong>useState/useReducer:</strong> Para estado local de componentes</li>
                      </ul>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-2">
                        <code className="text-sm">
                          {`// Exemplo de uso do TanStack Query
const { data, isLoading, error } = useQuery({
  queryKey: ['patients'],
  queryFn: fetchPatients,
});`}
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="routing">
                  <AccordionTrigger className="text-lg font-semibold">Roteamento</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema utiliza React Router para gerenciamento de rotas:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Rotas protegidas por perfil de usuário</li>
                        <li>Layouts compartilhados com Outlet</li>
                        <li>Redirecionamento baseado em autenticação</li>
                        <li>Estrutura de rotas aninhadas</li>
                      </ul>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-2">
                        <code className="text-sm">
                          {`// Estrutura básica de roteamento
<Routes>
  {/* Rotas públicas */}
  <Route path="/login" element={<Login />} />
  
  {/* Rotas para nutricionistas */}
  <Route 
    element={
      <ProtectedRoute allowedRoles={["nutritionist"]}>
        <Layout />
      </ProtectedRoute>
    }
  >
    <Route path="/" element={<Index />} />
    <Route path="/patients" element={<Patients />} />
    {/* Outras rotas */}
  </Route>
  
  {/* Rotas para pacientes */}
  <Route 
    element={
      <ProtectedRoute allowedRoles={["patient"]}>
        <PatientLayout />
      </ProtectedRoute>
    }
  >
    {/* Rotas de pacientes */}
  </Route>
</Routes>`}
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="security">
                  <AccordionTrigger className="text-lg font-semibold">Práticas de Segurança</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema implementa várias práticas de segurança:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Row Level Security (RLS):</strong> Controle de acesso a dados no nível do banco de dados</li>
                        <li><strong>JWT Authentication:</strong> Tokens seguros para autenticação</li>
                        <li><strong>Role-based Access Control:</strong> Permissões baseadas em funções</li>
                        <li><strong>HTTPS:</strong> Comunicação criptografada</li>
                        <li><strong>Content Security Policy:</strong> Proteção contra ataques XSS</li>
                        <li><strong>Sanitização de entrada:</strong> Validação de dados com zod</li>
                      </ul>
                      
                      <p className="mt-2">
                        As políticas RLS garantem que mesmo que ocorra um vazamento de credenciais de API frontend,
                        os usuários só podem acessar os dados aos quais têm permissão explícita.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="extensibility">
                  <AccordionTrigger className="text-lg font-semibold">Extensibilidade</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>O sistema foi projetado para ser extensível em várias áreas:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Módulos:</strong> Organização por domínio facilita adição de novas funcionalidades</li>
                        <li><strong>Tema:</strong> Sistema de tema personalizável baseado em CSS variables</li>
                        <li><strong>APIs:</strong> Edge Functions do Supabase podem ser adicionadas para nova lógica de backend</li>
                        <li><strong>Integrações:</strong> Estrutura preparada para novas integrações com serviços externos</li>
                      </ul>
                      
                      <p className="mt-2">
                        Para adicionar novos recursos, recomenda-se seguir o padrão existente de organização
                        por módulos e utilizar os componentes UI existentes para manter a consistência visual.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="testing">
                  <AccordionTrigger className="text-lg font-semibold">Testes</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <p>Estratégias de teste recomendadas para o sistema:</p>
                      
                      <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Testes unitários:</strong> Usando Vitest para funções e hooks isolados</li>
                        <li><strong>Testes de componente:</strong> Usando React Testing Library</li>
                        <li><strong>Mock de Supabase:</strong> Utilizando MSW ou adaptadores de teste do Supabase</li>
                        <li><strong>Testes E2E:</strong> Usando Playwright ou Cypress para fluxos completos</li>
                      </ul>
                      
                      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md mt-2">
                        <code className="text-sm">
                          {`// Exemplo de teste de componente
test('renderiza formulário de login', () => {
  render(<Login />);
  expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
});`}
                        </code>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-8 flex justify-center">
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center">
            <ChevronRight className="mr-2 h-4 w-4 rotate-180" />
            Voltar para o Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Componente para cards de perfis de usuário
const UserRoleCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center text-center">
        <div className="p-3 bg-nutri-primary/10 rounded-full mb-4">
          <Icon className="h-8 w-8 text-nutri-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

// Componente para seções do acordeão
const AccordionSection = ({ value, title, icon: Icon, children }: { value: string; title: string; icon: any; children: React.ReactNode }) => {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger className="text-lg font-semibold">
        <div className="flex items-center">
          <Icon className="mr-2 h-5 w-5 text-nutri-primary" />
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 pl-2">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default Documentation;
