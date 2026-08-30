/** TrueForge ResourceName: agent, MCP server, skill, custom provider, model name. */
export const RESOURCE_NAME_PATTERN = /^[a-z](?:[a-z0-9._-]{0,62}[a-z0-9])$/;

export function isResourceName(value: string): boolean {
  return RESOURCE_NAME_PATTERN.test(value);
}
