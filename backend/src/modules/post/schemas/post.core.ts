import { z } from "zod";

export const postCore = {
  title: z.string().min(3).max(512),
  content: z.string().min(3).max(512),
};
