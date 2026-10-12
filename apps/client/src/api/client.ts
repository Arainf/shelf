



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


export interface Unit {
    id: string;
    name: string;
    symbol: string;
}

export interface ProductUnit {
    id: string;
    conversionFactor: number;
    isBase: boolean;
    price: number;
    costPrice?: number;
    unit: Unit;
}

export interface Variant {
    id: string;
    name: string;
    sku?: string;
    units: ProductUnit[];
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    variants: Variant[];
}


export const api = {
    getHealth: () => request<HealthResponse>('/health'),
    getUnits: () => request<Unit[]>('/catalog/units'),
    createUnit: (data: { name: string; symbol: string; }) =>
        request<Unit>('/catalog/units', { method: 'POST', body: JSON.stringify(data) }),
    getProducts: () => request<ProductUnit[]>('/catalog/products'),
    createProduct: (data: any) =>
        request<Product>('/catalog/products', { method: 'POST', body: JSON.stringify(data) }),
}