import type { ServiceName } from "@shared/types";

const services: ServiceName[] = ["auth", "user", "feed"];

export function App() {
  return (
    <main className="app">
      <h1>Social Network</h1>
      <p>Клиентское приложение. Бэкенд-сервисы:</p>
      <ul>
        {services.map((service) => (
          <li key={service}>{service}</li>
        ))}
      </ul>
    </main>
  );
}
