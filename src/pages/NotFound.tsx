
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: Usuário tentou acessar rota inexistente:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md p-8">
        <div className="inline-block mb-6 bg-nutri-light rounded-full p-3">
          <div className="text-6xl font-bold text-nutri-primary">404</div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
        <p className="text-gray-500 mb-6">
          Desculpe, não conseguimos encontrar a página que você está procurando.
        </p>
        <Button asChild className="bg-nutri-primary hover:bg-nutri-secondary">
          <Link to="/">Voltar à página inicial</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
