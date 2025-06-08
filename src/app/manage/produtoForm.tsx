"use client";

import { useState, useRef, ChangeEvent } from "react";
import { IProduct } from "../products/interfaces";

interface ProductFormProps {
    initialData?: IProduct | null;
    onSubmit: (product: FormData | Omit<IProduct, "id">) => Promise<void>;
    onCancel: () => void;
    isCreate?: boolean;
}

export default function ProductForm({
    initialData,
    onSubmit,
    onCancel,
    isCreate = false
}: ProductFormProps) {
    const [formData, setFormData] = useState<Omit<IProduct, "id"> | IProduct>(
        initialData || {
            name: "",
            image: "",
            price: "",
            description: "",
            message: "",
            status: true,
        }
    );

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        if (name === "price") {
            const numeric = value.replace(/[^\d,]/g, '').replace(',', '.');
            setFormData(prev => ({ ...prev, price: numeric }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));
    };


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);

            // Atualiza a pré-visualização
            setFormData(prev => ({
                ...prev,
                image: URL.createObjectURL(file)
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (isCreate) {
                if (!selectedFile) {
                    setError("A imagem é obrigatória para novos produtos");
                    return;
                }

                const formDataObj = new FormData();
                formDataObj.append('name', formData.name);
                formDataObj.append('price', formData.price);
                formDataObj.append('description', formData.description);
                formDataObj.append('message', formData.message);
                formDataObj.append('status', formData.status ? 'true' : 'false');
                formDataObj.append('image', selectedFile);
                await onSubmit(formDataObj);
            } else {
                const { id, name, price, description, message, status } = formData as IProduct;

                const jsonData = {
                    id,
                    name,
                    price: price.startsWith("R$") ? price : `R$ ${price}`,
                    description,
                    message,
                    status: typeof status === "string" ? status === "true" : status,
                    image: '',
                };

                await onSubmit(jsonData);
            }
        } catch (err) {
            setError("Erro ao processar o formulário");
            console.error(err);
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
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"
                        required
                    />
                </div>

                <div style={{ display: !isCreate ? 'none' : 'block' }}>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Imagem do Produto {isCreate && '*'}
                    </label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black"
                        required={isCreate}
                    />
                    {formData.image && (
                        <div className="mt-2">
                            <img
                                src={typeof formData.image === 'string' ? formData.image : URL.createObjectURL(formData.image)}
                                alt="Pré-visualização"
                                className="h-20 object-contain"
                            />
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Preço *
                    </label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Descrição *
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"
                        rows={3}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1 text-green-600">
                        Mensagem *
                    </label>
                    <input
                        type="text"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-purple-500 rounded-md text-black placeholder-gray-400"
                        required
                    />
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="status"
                        checked={formData.status}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="text-sm font-medium text-green-600">Ativo</label>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        {initialData ? "Atualizar" : "Criar"}
                    </button>
                </div>
            </form>
        </div>
    );
}