import { IProduct, IProductsFile } from '@/app/products/interfaces';
import api from '@/services/api';
import { AxiosError } from 'axios';

const resource = 'api/v1/products';

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
): Promise<{ id: string }> {
    try {
        const { data } = await api.post<{ id: string }>(resource, formData, {
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
    id: string,
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


export async function updateOrderBy(orderBy: number[]): Promise<number[]> {
    try {
        const response = await api.post<{ orderBy: number[] }>(
            `${resource}/orderBy`,
            { orderBy }
        );
        return response.data.orderBy;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao atualizar orderBy'
        );
    }
}

