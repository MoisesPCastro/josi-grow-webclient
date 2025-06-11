import { IProduct } from '@/app/products/interfaces';
import api from '@/services/api';
import { AxiosError } from 'axios';

const resource = 'api/v1/products';

interface ApiError {
    message: string;
    statusCode: number;
}

export async function listProducts(status?: boolean): Promise<IProduct[]> {
    try {
        const query = status !== undefined ? `?status=${status}` : '';
        const { data } = await api.get<IProduct[]>(`${resource}${query}`);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao carregar produtos'
        );
    }
}

export async function getByIdProduct(id: number): Promise<IProduct> {
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
): Promise<{ id: number }> {
    try {
        const { data } = await api.post<{ id: number }>(resource, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => {
                Math.round((e.loaded * 100) / (e.total ?? 1));
            },
        });
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao criar produto'
        );
    }
}

export async function updateProduct(
    id: number,
    update: Partial<Omit<IProduct, 'id' | 'imageUrl' | 'publicId'>>,
): Promise<IProduct> {
    try {
        const { data } = await api.put<IProduct>(`${resource}/${id}`, update);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao atualizar produto'
        );
    }
}

export async function updatedStatusProduct(
    id: number,
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
    id: number,
): Promise<{ deleted: true }> {
    try {
        const { data } = await api.delete<{ deleted: true }>(`${resource}/${id}`);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao excluir produto'
        );
    }
}
