"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    listProducts,
    updatedStatusProduct,
    createProduct,
    updateProduct,
    //updateOrderBy,
    deleteProduct,
    listOrderViewProduct,
    updateOrderViewProduct,
} from "@/services/requestApis";
import ManagePopup from "@/components/modal/ManagePopup";
import ProductForm from "./produtoForm";
import { IProduct, UpdateProductDTO } from "../products/interfaces";
import CloseButton from "@/components/bottons/closeButton";
import Swal from "sweetalert2";
import { notify, notifyError } from "@/shared/notifications";

export default function ManagePage() {
    const router = useRouter();
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [isActiveTab, setActiveTab] = useState<"view" | "create" | "edit">("view");
    const [isProducts, setProducts] = useState<IProduct[]>([]);
    const [isEditingProduct, setEditingProduct] = useState<IProduct | null>(null);
    const [displayOrder, setDisplayOrder] = useState<string[]>([]);
    const [displayOrderInput, setDisplayOrderInput] = useState("");
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [isLoading, setLoading] = useState(false);

    const toggleMenu = (id: string) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    useEffect(() => {
        const isAdmin = sessionStorage.getItem("heigth") === "true";
        setAuthenticated(isAdmin);
        loadProducts();

    }, [isAuthenticated]);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const [data, orderIds] = await Promise.all([
                listProducts(),
                listOrderViewProduct(),
            ]);

            setDisplayOrder(orderIds);
            setDisplayOrderInput(orderIds.join(","));

            const sorted = [
                ...orderIds
                    .map((id) => data.products.find((p) => p.id === id))
                    .filter((p): p is IProduct => !!p),
                ...data.products.filter((p) => !orderIds.includes(p.id)),
            ];

            setProducts(sorted);
        } catch (error) {
            console.error("Erro ao carregar produtos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async (id: string, statusAtual: boolean) => {
        try {
            setLoading(true);
            const msg = !statusAtual ? "Ativado" : "Desativado";
            await updatedStatusProduct(id, !statusAtual);
            notify(`Produto ${msg} com sucesso!`, 'success')
            loadProducts();
            setLoading(false);
        } catch (error) {
            console.error("Erro ao alterar status:", error);
        }
    };

    const handleCreate = async (form: FormData) => {
        setLoading(true);
        await createProduct(form);
        setLoading(false);
        notify('Produto Criado com sucesso!', 'success')
        loadProducts();
        setActiveTab('view');
    };

    const handleUpdate = async (dto: UpdateProductDTO) => {
        if (!isEditingProduct) throw new Error('Produto não selecionado');
        await updateProduct(isEditingProduct.id, dto);
        notify('Produto editado com sucesso!', 'success')
        loadProducts();
        setEditingProduct(null);
        setActiveTab('view');
    };

    if (!isAuthenticated) {
        return <ManagePopup onSuccess={() => setAuthenticated(true)} />;
    }

    const handleDisplayOrderSave = async () => {
        const parsed = displayOrderInput
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s !== "");

        try {
            await updateOrderViewProduct(parsed);
            setDisplayOrder(parsed);
            setDisplayOrderInput(parsed.join(","));

            setProducts((prev) => [
                ...parsed
                    .map((id) => prev.find((p) => p.id === id))
                    .filter((p): p is IProduct => !!p),
                ...prev.filter((p) => !parsed.includes(p.id)),
            ]);

            notify("Ordem de exibição salva com sucesso!", "success");
        } catch {
            notify("Falha ao salvar a ordem de exibição.", "error");
            setDisplayOrderInput(displayOrder.join(","));
        }
    };

    const handleDelete = async (id: string) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Confirma exclusão?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim',
            cancelButtonText: 'Não',
        });
        if (!isConfirmed) return;

        try {
            setLoading(true);
            await deleteProduct(id);
            await notify('Produto excluído com sucesso!', 'success');
            await loadProducts();
            setLoading(false);
        } catch {
            setLoading(false);
            await notifyError('Falha ao excluir produto.');
        }
    };

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
                    className={`px-4 py-2 rounded-md transition-colors ${isActiveTab === "view"
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
                    className={`px-4 py-2 rounded-md transition-colors ${isActiveTab === "create"
                        ? "bg-green-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    Criar Produto
                </button>
            </div>

            {isActiveTab === "view" && (
                <div className="mb-4 w-full">
                    <label className="block mb-1 font-medium">
                        Ordem de Exibição (IDs):
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <textarea
                            rows={2}
                            value={displayOrderInput}
                            onChange={e => setDisplayOrderInput(e.target.value)}
                            placeholder="Adicione os ids separados por vírgula aqui!"
                            className="
          block w-full             /* full-width no mobile */
          sm:flex-1 sm:w-auto      /* flex-1 no desktop */
          border rounded p-2
          resize-y                 /* só permite redimensionar verticalmente */
          text-sm
        "
                        />

                        <button
                            onClick={handleDisplayOrderSave}
                            className="
          block w-full             /* full-width no mobile */
          sm:w-auto                /* auto width no desktop */
          bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700
        "
                        >
                            Salvar Ordem
                        </button>
                    </div>
                </div>
            )}


            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
            ) : isActiveTab === "view" ? (
                <div className="
                        overflow-auto 
                        bg-white rounded-lg shadow
                        max-h-[60vh]
                        sm:max-h-[70vh]
                        md:max-h-[77vh]"
                >
                    <table className="min-w-full divide-y divide-gray-200 ">
                        <thead className="bg-gray-50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Nome
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Marca
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Preço
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Descrição
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Mensagem
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Promo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-purple-600 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {isProducts.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-purple-200 even:bg-gray-200"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.marca}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.price}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.description}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.message}
                                    </td>
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
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {product.emphasis ? "Sim" : "Não"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="relative inline-block text-left">
                                            <button
                                                onClick={() => toggleMenu(product.id)}
                                                className="px-2 py-1 text-blue-500 hover:bg-gray-400 rounded"
                                            >
                                                •••
                                            </button>
                                            {openMenuId === product.id && (
                                                <div className="overflow-x-auto overflow-y-visible bg-white rounded-lg shadow">
                                                    <button
                                                        onClick={() => {
                                                            handleStatusToggle(product.id, product.status);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className={`block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm  ${product.status
                                                            ? "text-yellow-500 hover:bg-yellow-600 "
                                                            : "text-green-500 hover:bg-green-600"
                                                            }`}
                                                    >
                                                        {product.status ? "Desativar" : "Ativar"}
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingProduct(product);
                                                            setActiveTab("edit");
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm text-blue-600"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDelete(product.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-sm text-red-600"
                                                    >
                                                        Excluir
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <ProductForm
                    initialData={isEditingProduct}
                    isCreate={isActiveTab === 'create'}
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onCancel={() => setActiveTab('view')}
                />

            )}
        </div>
    );
}
