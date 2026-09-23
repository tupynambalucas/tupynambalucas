# VS Code

Connect VS Code with GitHub Copilot to agentgateway

Configure Visual Studio Code to use **agentgateway** via GitHub Copilot’s native MCP support.

## Before you begin

1. [Install and run agentgateway](../../quickstart/mcp.md).
2. Confirm agentgateway is up by opening the [agentgateway UI](http://localhost:15000/ui).
3. Use the MCP endpoint `http://localhost:3000/mcp/http` to connect your client to agentgateway. If you run agentgateway on a different host or port, replace `localhost:3000` in the examples accordingly.

- Install **VS Code (1.92+)** with the **GitHub Copilot** extension.
- Enable **GitHub Copilot Chat**.
- In the GitHub Copilot Chat, make sure that **Agent Mode** is active (MCP tools are primarily utilized when Copilot is in “Agent” mode).

## Server configuration

Configure your MCP server in the `mcp.json` file in the root directory of your project. For more
locations, refer to the [VS
Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers) docs. If your MCP server
is running on a different host and port, update the URL accordingly.

```
{
  "servers": {
    "agentgateway": {
      "type": "http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

## Authentication

You have two ways to handle security, depending on your setup: native MCP authentication flow or
manual bearer token.

### Option 1: Native MCP authentication flow

If your agentgateway proxy is configured to use an OIDC/OAuth provider (like Okta or Entra ID), VS
Code automatically detects the challenge and prompts you to “Sign In” via a browser pop-up.

```
{
  "servers": {
    "agentgateway": {
      "type": "http",
      "url": "http://localhost:3000/mcp"
    }
  }
}
```

### Option 2: Manual bearer token

If you prefer to explicitly pass a token, such as for local development or simple API key setups,
use the `headers` object.

```
{
  "servers": {
    "agentgateway": {
      "type": "http",
      "url": "http://localhost:3000/mcp",
      "headers": {
        "Authorization": "Bearer your-token-here"
      }
    }
  }
}
```

## Verify the connection

In agentgateway, run a configuration that includes the URL that you configured in the `mcp.json`
file.

In VS Code:

1. **Reload Window:** Run `Cmd/Ctrl + Shift + P`, then search for and select **“Developer: Reload Window”**.
2. **Open Chat:** Open the GitHub Copilot Chat panel.
3. **Switch to Agent Mode:** Ensure the dropdown at the bottom of the chat is set to **Agent**.
4. **Check Tools:** Click the **Tools** icon in the chat box menu. In the tools dropdown, filter for `agentgateway` and expand to view the MCP server’s available tools.
5. **Test:** In the chat box, type `#` followed by a tool name, such as `#get_k8s_logs` to see it in action.

[Devin Desktop](/docs/standalone/latest/integrations/mcp-clients/devin/ 'Devin Desktop')[Antigravity IDE](/docs/standalone/latest/integrations/mcp-clients/antigravity/ 'Antigravity IDE')

Was this page helpful?
