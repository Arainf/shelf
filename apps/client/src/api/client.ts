export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public details?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function request<T>(endpoint: string, options: RequestInit = {}):
Promise<T> {
    // Always routes through the /api prefix
    const url = endpoint.startsWith('/') ? `/api${endpoint}` : `/api/${endpoint}`;

    const headers = new Headers(options.headers);
    if(!headers.has('Content-Type') && !(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
    }

    try {
        const res = await fetch(url, {...options, headers});

        if(!res.ok){
            let errorMessage = `HTTP Error ${res.status}: ${res.statusText}`;
            let errorDetails: unknown = null;

            try {
                const errorData = await res.json();
                errorDetails = errorData;
                if (errorData.message) {
                    errorMessage = Array.isArray(errorData.message)
                        ? errorData.message.join(', ')
                        : errorData.message;
                }
            } catch {
                errorMessage = `HTTP Error ${res.status}: ${res.statusText}`;
            }

            throw new ApiError(res.status, errorMessage, errorDetails);
        }

        return (await res.json()) as T;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(0, (error as Error).message || 'Network request failed');
    }
}

export interface HealthResponse {
    status: string;
    database: string;
    timestamp: string;
}

export const api = {
    getHealth: () => request<HealthResponse>('/health'),
}