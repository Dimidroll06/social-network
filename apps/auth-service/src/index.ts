import { app } from "./app";

const port = Number(process.env.PORT ?? 4001);

app.listen(port, () => {
  console.log(`[auth-service] running at http://localhost:${port}`);
});
