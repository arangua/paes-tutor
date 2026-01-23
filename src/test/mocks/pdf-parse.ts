// Mock de pdf-parse para tests
// Necesita ser compatible con CommonJS require()
class PDFParse {
  constructor(_config: { data: Buffer }) {
    // config no se usa en el mock
  }
  async load() {}
  async getText() {
    return {
      text: 'RESPUESTAS:\n1-A\n2-B\n3-C\n4-D\n5-A',
    }
  }
}

// Exportar para CommonJS (require)
module.exports = {
  PDFParse,
  default: PDFParse,
}

// Exportar para ES modules (import)
export { PDFParse }
export default PDFParse

