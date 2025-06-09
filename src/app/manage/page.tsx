"use client";

import { useState, useEffect } from "react";
import { listProduts, updatedStatusProduct, creatProduct, updateProduct } from "@/services/requestApis";
import ManagePopup from "@/components/modal/ManagePopup";
import ProductForm from "./produtoForm";
import { IProduct } from "../products/interfaces";
import CloseButton from "@/components/bottons/closeButton";
import { useRouter } from "next/navigation";

export default function ManagePage() {
    const router = useRouter();
    const [authenticated, setAuthenticated] = useState(false);
    const [activeTab, setActiveTab] = useState<"view" | "create" | "edit">("view");
    const [products, setProducts] = useState<IProduct[]>([]);
    const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (authenticated) {
            loadProducts();
        }
    }, [authenticated]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await listProduts();
            setProducts(data);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id: string, statusAtual: boolean) => {
        try {
            await updatedStatusProduct(Number(id), !statusAtual);
            loadProducts();
        } catch (error) {
            console.error("Erro ao alterar status:", error);
        }
    };


    const handleCreate = async (productData: FormData | Omit<IProduct, "id">) => {
        try {
            if (productData instanceof FormData) {
                await creatProduct(productData);
            } else {
                const formData = new FormData();
                Object.entries(productData).forEach(([key, value]) => {
                    formData.append(key, String(value));
                });
                await creatProduct(formData);
            }
            loadProducts();
            setActiveTab("view");
        } catch (error) {
            console.error("Erro na criação:", error);
            throw error;
        }
    };

    const handleUpdate = async (productData: IProduct | FormData) => {
        try {
            const id = productData instanceof FormData
                ? productData.get('id')?.toString()
                : productData.id;

            if (!id) throw new Error("ID não encontrado");


            await updateProduct(Number(id), productData as IProduct);

            loadProducts();
            setEditingProduct(null);
            setActiveTab("view");
        } catch (error) {
            console.error("Erro na atualização:", error);
            throw error;
        }
    };

    if (!authenticated) {
        return <ManagePopup onSuccess={() => setAuthenticated(true)} />;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto relative min-h-screen">
            <CloseButton
                onClick={() => router.push("/")}
                className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                title="Voltar para página inicial"
            />

            <h1 className="text-2xl font-bold mb-6">Painel de Gerenciamento</h1>

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setActiveTab("view")}
                    className={`px-4 py-2 rounded-md transition-colors ${activeTab === "view"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Visualizar
                </button>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setActiveTab("create");
                    }}
                    className={`px-4 py-2 rounded-md transition-colors ${activeTab === "create"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Criar Produto
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : activeTab === "view" ? (
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">Preço</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">Descrição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">Mensagem</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.message}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.status
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                                }`}
                                        >
                                            {product.status ? "Ativo" : "Inativo"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStatusToggle(String(product.id), product.status)}
                                                className={`px-3 py-1 rounded-md text-sm ${product.status
                                                    ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                                                    : "bg-green-500 hover:bg-green-600 text-white"
                                                    }`}
                                            >
                                                {product.status ? "Desativar" : "Ativar"}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setEditingProduct(product);
                                                    setActiveTab("edit");
                                                }}
                                                className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                                            >
                                                Editar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <ProductForm
                    initialData={editingProduct}
                    onSubmit={activeTab === "create" ? handleCreate : handleUpdate}
                    onCancel={() => setActiveTab("view")}
                    isCreate={activeTab === "create"}
                />
            )}
        </div>
    );
}