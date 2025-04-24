/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module '@langchain/core' {
  export * from '@langchain/core/dist';
}

declare module '@langchain/core/prompts' {
  export * from '@langchain/core/dist/prompts';
}

declare module '@langchain/core/chains' {
  export { LLMChain } from '@langchain/core/dist/chains/llm_chain';
}
