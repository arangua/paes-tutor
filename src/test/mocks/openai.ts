// Mock de OpenAI para tests
interface MockChoice {
  message: {
    content: string
  }
}

interface MockResponse {
  choices: MockChoice[]
}

export default class OpenAI {
  chat: {
    completions: {
      create: () => Promise<MockResponse>
    }
  }

  constructor(_config: { apiKey: string }) {
    this.chat = {
      completions: {
        create: async (): Promise<MockResponse> => ({
          choices: [
            {
              message: {
                content: 'Mock response',
              },
            },
          ],
        }),
      },
    }
  }
}

