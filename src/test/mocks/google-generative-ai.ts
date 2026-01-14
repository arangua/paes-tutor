// Mock de GoogleGenerativeAI para tests
export class GoogleGenerativeAI {
  constructor(_apiKey: string) {
    // apiKey no se usa en el mock
  }

  getGenerativeModel(_config: { model: string }) {
    return {
      generateContent: async () => ({
        response: {
          text: () => 'Mock response',
        },
      }),
    }
  }
}

