function App() {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error(
      "VITE_API_URL não definida. Crie .env.local e reinicie o Vite."
    );
  }

  return (
    <>
      {/* Preserve aqui o JSX que seu App já possui. */}
      <p>API: {apiUrl}</p>
    </>
  );
}

export default App;