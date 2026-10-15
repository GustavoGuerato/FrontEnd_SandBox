import { useEffect, useState } from "react";

// Formato confirmado no /health real: {"status":"ok","database":"ok"}
type HealthBody = {
  status: string;
  database: string;
};

type HealthState =
  | { status: "loading" }
  | { status: "success"; body: HealthBody }
  | { status: "error"; message: string };

// O TypeScript não valida a resposta em tempo de execução.
// Este guard confere o formato antes de confiarmos nele.
function isHealthBody(value: unknown): value is HealthBody {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    typeof value.status === "string" &&
    "database" in value &&
    typeof value.database === "string"
  );
}

const apiUrl = import.meta.env.VITE_API_URL;
if (!apiUrl) {
  throw new Error("VITE_API_URL não está definido");
}

export default function App() {
  const [health, setHealth] = useState<HealthState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();

    async function checkHealth() {
      try {
        const response = await fetch(`${apiUrl}/health`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Erro na requisição: ${response.status} ${response.statusText}`,
          );
        }

        const body: unknown = await response.json();

        if (!isHealthBody(body)) {
          throw new Error("Resposta do /health em formato inesperado");
        }

        setHealth({ status: "success", body });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        setHealth({
          status: "error",
          message: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    checkHealth();

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main>
      <h1>AccessForge</h1>
      {health.status === "loading" && <p>Consultando a API...</p>}
      {health.status === "success" && (
        <p>
          API: {health.body.status} · Banco: {health.body.database}
        </p>
      )}
      {health.status === "error" && (
        <p>Falha ao consultar a API: {health.message}</p>
      )}
    </main>
  );
}