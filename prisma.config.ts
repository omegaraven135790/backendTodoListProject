import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: "file:./dev.db",
  },
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});
