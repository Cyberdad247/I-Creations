proconst { genkit } = require('genkit');
const { mcpClient } = require('genkitx-mcp');

async function main() {
  const addClient = mcpClient({
    name: 'github.com/firebase/genkit/tree/HEAD/js/plugins/mcp',
    serverProcess: {
      command: 'node',
      args: ['mcp_server.js'],
    },
  });

  const ai = genkit({
    plugins: [addClient],
  });

  // Call the add tool via the Genkit instance using invokePlugin
  const result = await ai.invokePlugin('github.com/firebase/genkit/tree/HEAD/js/plugins/mcp', 'add', { a: 5, b: 7 });
  console.log('Result of add tool:', result);
}

main().catch(console.error);
