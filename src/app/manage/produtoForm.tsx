"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { UpdateProductDTO } from "../products/interfaces";
import { IProductFormProps } from "./interface";

export default function ProductForm({
    initialData,
    onCreate,
    onUpdate,
    onCancel,
    isCreate = false,
}: IProductFormProps) {
    const [isFormState, setFormState] = useState<UpdateProductDTO>(
        initialData
            ? {
                name: initialData.name,
                price: initialData.price,
                description: initialData.description,
                message: initialData.message,
                status: initialData.status,
                emphasis: initialData.emphasis,
            }
            : {
                name: "",
                price: "",
                description: "",
                message: "",
                status: true,
                emphasis: false,
            }
    );
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState<string>("");
    const [isPreviewUrl, setPreviewUrl] = useState<string | null>(null);


    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormState((prev) => ({ ...prev, [name]: checked }));
            return;
        }
        if (name === "price") {
            const numeric = value.replace(/[^\d,]/g, "").replace(",", ".");
            setFormState((prev) => ({ ...prev, price: numeric }));
            return;
        }
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");

        if (value.length === 0) {
            setFormState(prev => ({ ...prev, price: "" }));
            return;
        }

        const cents = parseInt(value, 10);
        const realValue = (cents / 100).toFixed(2);

        const formattedValue = realValue.replace(".", ",");
        setFormState(prev => ({ ...prev, price: formattedValue }));
    };


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const raw = isFormState.price.trim();
            const priceValue = raw.startsWith("R$") ? raw : `R$ ${raw}`;

            if (isCreate) {
                if (!selectedFile) {
                    setError("A imagem é obrigatória para novos produtos");
                    return;
                }

                const formData = new FormData();
                formData.append("name", isFormState.name);
                formData.append("price", priceValue);
                formData.append("description", isFormState.description);
                formData.append("message", isFormState.message);
                formData.append("status", isFormState.status ? "true" : "false");
                formData.append("emphasis", isFormState.emphasis ? "true" : "false");
                formData.append("image", selectedFile);

                await onCreate(formData);
            } else {
                const body: UpdateProductDTO = {
                    ...isFormState,
                    price: priceValue,
                    emphasis: Boolean(isFormState.emphasis),
                };
                await onUpdate(body);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao processar o formulário");
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-purple-600 mb-4">
                {initialData ? "Editar Produto" : "Criar Novo Produto"}
            </h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Nome *
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={isFormState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"
                    />
                </div>

                {isCreate && (
                    <div>
                        <label className="block text-sm font-medium mb-1 text-green-600">
                            Imagem do Produto *
                        </label>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept="image/*"
                            required
                            className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"

                        />
                        {isPreviewUrl && (
                            <div className="mt-2">
                                <img
                                    src={isPreviewUrl}
                                    alt="Pré-visualização"
                                    className="h-20 object-contain"
                                />
                            </div>
                        )}

                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Preço *
                    </label>
                    <input
                        type="text"
                        name="price"
                        value={isFormState.price ? `R$ ${isFormState.price}` : ""}
                        onChange={handlePriceChange}
                        onBlur={(e) => {
                            // Garante que sempre tenha 2 decimais
                            if (isFormState.price && !isFormState.price.includes(",")) {
                                setFormState(prev => ({ ...prev, price: `${isFormState.price},00` }));
                            }
                        }}
                        required
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Descrição *
                    </label>
                    <textarea
                        name="description"
                        value={isFormState.description}
                        onChange={handleChange}
                        rows={3}
                        required
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"

                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Mensagem *
                    </label>
                    <input
                        type="text"
                        name="message"
                        value={isFormState.message}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"

                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="status"
                        checked={isFormState.status}
                        onChange={handleChange}
                        className="mr-1"
                    />
                    <label className="text-sm font-medium text-green-600">
                        Ativo
                    </label>
                    <input
                        type="checkbox"
                        name="emphasis"
                        checked={isFormState.emphasis}
                        onChange={handleChange}
                        className="mr-1 ml-3"
                    />
                    <label className="text-sm font-medium text-green-600">
                        Produto em Promoção?
                    </label>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded"
                    >
                        {initialData ? "Atualizar" : "Criar"}
                    </button>
                </div>
            </form>
        </div>
    );
}
