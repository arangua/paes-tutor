export class NextRequest {
  url: string
  nextUrl: { searchParams: URLSearchParams; pathname: string }
  headers: Headers
  cookies: Map<string, string>
  method: string
  body: ReadableStream | null
  
  constructor(url: string | URL, init?: { method?: string; headers?: HeadersInit; body?: BodyInit }) {
    const urlObj = typeof url === 'string' ? new URL(url) : url
    this.url = urlObj.toString()
    this.nextUrl = {
      searchParams: urlObj.searchParams,
      pathname: urlObj.pathname,
    }
    this.headers = new Headers(init?.headers)
    this.cookies = new Map()
    this.method = init?.method || 'GET'
    this.body = init?.body ? (init.body as any) : null
  }
  
  async json() {
    if (this.body && typeof this.body === 'string') {
      try {
        return JSON.parse(this.body)
      } catch {
        return {}
      }
    }
    return {}
  }
  
  text() {
    return Promise.resolve('')
  }
  
  formData() {
    return Promise.resolve(new FormData())
  }
}

export class NextResponse {
  private _response: Response
  
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this._response = new Response(body, init)
  }
  
  get body() { return this._response.body }
  get bodyUsed() { return this._response.bodyUsed }
  get headers() { return this._response.headers }
  get ok() { return this._response.ok }
  get redirected() { return this._response.redirected }
  get status() { return this._response.status }
  get statusText() { return this._response.statusText }
  get type() { return this._response.type }
  get url() { return this._response.url }
  
  clone() { return this._response.clone() }
  arrayBuffer() { return this._response.arrayBuffer() }
  blob() { return this._response.blob() }
  formData() { return this._response.formData() }
  json() { return this._response.json() }
  text() { return this._response.text() }
  
  static json(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
    return new NextResponse(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: {
        'content-type': 'application/json',
        ...(init?.headers ?? {}),
      },
    })
  }

  static redirect(url: string | URL, init?: { status?: number }) {
    return new NextResponse(null, {
      status: init?.status ?? 307,
      headers: { location: String(url) },
    })
  }
  
  static next() {
    return new NextResponse(null, { status: 200 })
  }
}