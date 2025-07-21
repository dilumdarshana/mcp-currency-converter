/**
 * Formats the given data into a structured response format.
 * This utility function is used to standardize the response structure
 * for tools and resources in the MCP server.
 *
 * @param data The data to be formatted into the response
 * @returns An object containing the formatted response with a content array
 *          that includes a text object and optional metadata.
 */
export function formatResponse(data: unknown): {
  content: [
    {
      type: 'text'; // Specifies the type of content as text
      text: string; // The formatted data as a JSON string
      // _meta?: Record<string, unknown>; // Optional metadata for additional context
    }
  ];
} {
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(data, null, 2), // Converts the data to a pretty-printed JSON string
        // _meta: {}, // Add an empty _meta object for compatibility
      },
    ],
  };
}

/**
 * Formats the given data into a structured response format for prompts.
 * This utility function is used to standardize the response structure
 * for prompts in the MCP server.
 *
 * @param data The data to be formatted into the prompt response
 * @returns An object containing the formatted response with a messages array
 *          that includes a text object and role metadata.
 */
export function formatMessageResponse(data: string): {
  messages: Array<{
    content: {
      type: 'text'; // Specifies the type of content as text
      text: string; // The formatted message text
    };
    role: 'assistant'; // Specifies the role of the message
  }>;
} {
  return {
    messages: [
      {
        content: {
          type: 'text',
          text: data, // Use the provided data as the message text
        },
        role: 'assistant', // Set the role to 'assistant'
      },
    ],
  };
}
