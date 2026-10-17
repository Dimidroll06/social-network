import { app } from "./app";

const port = Number(process.env.PORT ?? 4003);

app.listen(port, () => {
  console.log(`[feed-service] running at http://localhost:${port}`);
});
