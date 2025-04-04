
import React from "react";

export const TestCredentials = () => {
  return (
    <div className="mt-5 pt-5 border-t">
      <div className="text-gray-500 dark:text-gray-400 text-center">
        <p className="font-medium mb-2">Credenciais de teste:</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-left">
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <p className="font-semibold">Nutricionista:</p>
            <p>login@nutricionista.com</p>
            <p>senha123</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <p className="font-semibold">Paciente:</p>
            <p>paciente@email.com</p>
            <p>senha123</p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <p className="font-semibold">Administrador:</p>
            <p>admin@email.com</p>
            <p>admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};
