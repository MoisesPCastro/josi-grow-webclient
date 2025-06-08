import { IProduct } from '@/app/products/interfaces';
import api from '@/services/api';
import { TproductOrFormData } from '@/shared/types';
import { AxiosError } from 'axios';

const resource = 'api/v1/products';


interface ApiError {
    message: string;
    statusCode: number;
}

export async function listProduts(status?: boolean): Promise<IProduct[]> {
    try {
        const query = status !== undefined ? `?status=${status}` : '';
        const { data } = await api.get(`${resource}${query}`);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(axiosError.response?.data?.message || 'Falha ao carregar produtos');
    }
}

// Busca por ID com cache control
export async function getByIdProduct(id: number): Promise<IProduct> {
    try {
        const { data } = await api.get(`${resource}/${id}`, {
            headers: {
                'Cache-Control': 'no-cache',
            },
        });
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(axiosError.response?.data?.message || 'Produto não encontrado');
    }
}

// Criação com FormData e progresso
export async function creatProduct(formData: TproductOrFormData): Promise<{ id: number }> {
    try {
        const { data } = await api.post(resource, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / (progressEvent.total || 1)
                );
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

// Atualização parcial com validação
export async function updateProduct(
    id: number,
    update: IProduct
): Promise<void> {
    try {
        const { id: _, image: __, ...cleanedUpdate } = update;

        await api.put(`${resource}/${id}`, cleanedUpdate);
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao atualizar produto'
        );
    }
}

// Status com confirmação
export async function updatedStatusProduct(
    id: number,
    status: boolean
): Promise<{ newStatus: boolean }> {
    try {
        const { data } = await api.put(`${resource}/${id}`, { status });
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao alterar status'
        );
    }
}

// Exclusão com confirmação
export async function deleteProduct(id: number): Promise<{ deleted: true }> {
    try {
        const { data } = await api.delete(`${resource}/${id}`);
        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ApiError>;
        throw new Error(
            axiosError.response?.data?.message || 'Falha ao excluir produto'
        );
    }
}