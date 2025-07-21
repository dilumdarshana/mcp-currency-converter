import { z } from 'zod';

export interface MCPTool<TInput extends z.ZodTypeAny = any> {
  title: string;
  description: string;
  schema: TInput;
  handler: (input: z.infer<TInput>) => Promise<any>;
};

export interface CurrencyApiResponse {
  data: Record<string, number>;
};
