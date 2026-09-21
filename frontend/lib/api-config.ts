export interface HealthStatus {
  status: 'checking' | 'online' | 'no_models' | 'offline'
  modelsLoaded: boolean
  models?: {
    eye_disease?: boolean
    ishihara?: boolean
  }
  url: string
  error?: string
}

export function getApiUrl(): string {
  if (typeof window !== 'undefined') {
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local')

    if (isLocal) {
      return (
        process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '') ||
        'http://localhost:5000'
      )
    }
    const configuredUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '')
    if (configuredUrl) {
      const isLocalOrPrivate =
        configuredUrl.includes('localhost') ||
        configuredUrl.includes('127.0.0.1') ||
        configuredUrl.startsWith('http://192.168.') ||
        configuredUrl.startsWith('http://10.') ||
        configuredUrl.startsWith('http://172.')

      if (!isLocalOrPrivate && configuredUrl.startsWith('https://')) {
        return configuredUrl
      }
    }

    return ''
  }


  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/+$/, '') || ''
  if (envUrl.includes('localhost') || envUrl.includes('127.0.0.1')) {
    return ''
  }
  return envUrl
}

export async function checkApiHealth(): Promise<HealthStatus> {
  const url = getApiUrl()


  if (!url) {
    return {
      status: 'offline',
      modelsLoaded: false,
      url: '',
      error: 'Backend API is not configured on this deployment.',
    }
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 6000)

  try {
    const res = await fetch(`${url}/api/health`, {
      signal: controller.signal,
      mode: 'cors',
    })
    clearTimeout(timer)

    if (!res.ok) {
      return {
        status: 'offline',
        modelsLoaded: false,
        url,
        error: `Server responded with HTTP ${res.status}`,
      }
    }

    const data = await res.json().catch(() => ({}))
    const modelsLoaded = data.models_loaded !== false
    return {
      status: modelsLoaded ? 'online' : 'no_models',
      modelsLoaded,
      models: data.models,
      url,
    }
  } catch (err: any) {
    clearTimeout(timer)
    return {
      status: 'offline',
      modelsLoaded: false,
      url,
      error: err?.name === 'AbortError' ? 'Connection timed out' : 'Backend server unreachable',
    }
  }
}
