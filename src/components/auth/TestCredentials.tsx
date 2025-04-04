
import React from "react";

const TestCredentials = () => {
  return (
    <div className="text-gray-500 dark:text-gray-400 text-center mt-4">
      <p className="font-medium mb-2">Credenciais de teste:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <p className="font-semibold">Nutricionista:</p>
          <p>nutricionista@email.com</p>
          <p>senha123</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded">
          <p className="font-semibold">Paciente:</p>
          <p>paciente@email.com</p>
          <p>senha123</p>
        </div>
      </div>
    </div>
  );
};

export default TestCredentials;
