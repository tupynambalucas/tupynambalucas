export interface McpResponseMessage {
  service_names?: string[];
  method?: string;
  mcp_response?: Buffer;
}

/**
 * handleCheckResponse processes the outbound MCP responses.
 * Since the removal of the anti-pattern tool description enrichment (instructions.md),
 * this processor currently acts as a pure pass-through.
 */
export function handleCheckResponse(_res: McpResponseMessage): {
  pass?: object;
  mutated?: Buffer;
  error?: object;
} {
  // Returning pass instructs AgentGateway to forward the original response unchanged.
  return { pass: {} };
}
