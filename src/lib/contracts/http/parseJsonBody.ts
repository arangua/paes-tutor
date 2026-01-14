/**
 * Parser explícito de JSON body
 * 
 * Reglas:
 * - No coerciona
 * - No transforma
 * - Solo parsea JSON válido
 * 
 * @throws Error si el body no es JSON válido
 */
export async function parseJsonBody(request: Request): Promise<unknown> {
  try {
    const text = await request.text()
    
    // Si el body está vacío, retornar objeto vacío
    if (!text.trim()) {
      return {}
    }
    
    return JSON.parse(text)
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON body: ${error.message}`)
    }
    throw error
  }
}
