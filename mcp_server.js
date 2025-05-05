const { genkit, z } = require('genkit');
const { mcpServer } = require('genkitx-mcp');

const ai = genkit();

ai.defineTool(
  {
    name: 'add',
    description: 'add two numbers together',
    inputSchema: z.object({ a: z.number(), b: z.number() }),
    outputSchema: z.number(),
  },
  async ({ a, b }) => {
    return a + b;
  }
);

ai.definePrompt(
  {
    name: "happy",
    description: "everybody together now",
    input: {
      schema: z.object({
        action: z.string().default("clap your hands").optional(),
      }),
    },
  },
  `If you're happy and you know it, {{action}}.`
);

mcpServer(ai, { name: 'github.com/firebase/genkit/tree/HEAD/js/plugins/mcp', version: '1.0.0' }).start();
