import { IProduct, IProductsFile } from '@/app/products/interfaces';
import api from '@/services/api';
import { AxiosError } from 'axios';

const resource = 'api/v1/products';
const resourceOrderProduct = 'api/v1/setting';

interface ApiError {
    message: string;
    statusCode: number;
}

export async function listProducts(status?: boolean): Promise<IProductsFile> {
    try {
        const query = status !== undefined ? `?status=${status}` : '';
        const { data } = await api.get<IProductsFile>(`${resource}${query}`);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao carregar produtos'
        );
    }
}

export async function getByIdProduct(id: string): Promise<IProduct> {
    try {
        const { data } = await api.get<IProduct>(`${resource}/${id}`, {
            headers: { 'Cache-Control': 'no-cache' },
        });
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Produto não encontrado'
        );
    }
}

export async function createProduct(
    formData: FormData
): Promise<string> {
    try {
        const { data } = await api.post<{ message: string }>(resource, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                Math.round((e.loaded * 100) / (e.total ?? 1));
            },
        });
        return data.message;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao criar produto'
        );
    }
}

export async function updateProduct(
    id: string,
    update: Partial<Omit<IProduct, 'id' | 'imageUrl' | 'publicId'>>,
): Promise<string> {
    try {
        const { data } = await api.put<{ message: string }>(`${resource}/${id}`, update);
        return data.message;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao atualizar produto'
        );
    }
}

export async function updatedStatusProduct(
    id: string,
    status: boolean,
): Promise<{ newStatus: boolean }> {
    try {
        const { data } = await api.put<{ newStatus: boolean }>(
            `${resource}/${id}`,
            { status },
        );
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao alterar status'
        );
    }
}

export async function deleteProduct(
    id: string,
): Promise<void> {
    try {
        await api.delete<{ deleted: true }>(`${resource}/${id}`);
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao excluir produto'
        );
    }
}

export async function listOrderViewProduct(): Promise<string[]> {
    try {
        const response = await api.get<string[]>(`${resourceOrderProduct}/order-view`);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message ||
            'Falha ao buscar ordem de exibição de produtos'
        );
    }
}

export async function updateOrderViewProduct(
    orderViewProduct: string[]
): Promise<string> {
    try {
        const response = await api.put<{ message: string }>(
            `${resourceOrderProduct}/order-view`,
            { orderViewProduct }
        );
        return response.data.message;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message ||
            'Falha ao atualizar ordem de exibição de produtos'
        );
    }
}