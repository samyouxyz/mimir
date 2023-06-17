export type Role = "assistant" | "user" | "system";

export type Message = {
  role: Role;
  content: string;
};
