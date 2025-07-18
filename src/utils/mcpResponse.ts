export function formatResponse(data: unknown): {
  content: [{ type: string; text: string }];
} {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}
