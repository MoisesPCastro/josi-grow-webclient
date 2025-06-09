"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CardContext";
import { IProduct } from "../interfaces";
import { listProduts } from "@/services/requestApis";
import WelcomeModal from "@/components/modal/WelComeModal";
import ManagePopup from "@/components/modal/ManagePopup";
import "@/app/products/products.css";
import { ImageModal } from "@/components/modal/ImgModal";

export default function Products() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await listProduts(true);
        setProducts(data);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLoginSuccess = (success: boolean) => {
    setShowPopup(false);
    if (success) {
      router.push("/manage");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <WelcomeModal />

      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          alt={selectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {showPopup && <ManagePopup onSuccess={handleLoginSuccess} />}

      <header className="products-header-flex">
        <div className="product_logo">
          <Image
            src="/imgs/logo-josi-glow.png"
            alt="Logo Josi Glow"
            width={120}
            height={80}
            className="product-logo-header"
            priority
          />
        </div>
        <div className="header-content">
          <h1
            className="products-title cursor-pointer hover:underline"
            title="Clique para acessar o painel administrativo"
            onClick={() => setShowPopup(true)}
            aria-label="Painel administrativo"
          >
            Josi Glow
          </h1>
          <span className="eslogan">Ilumine seu brilho, Liberte sua beleza!</span>
          <div className="products-subtitle">
            Os melhores cosméticos para realçar sua beleza natural.
          </div>
        </div>
      </header>

      <section className="products-grid">
        {products.length > 0 ? (
          products.map((product) => (
            <article key={product.id} className="product-card">
              <div
                className="product-image-container cursor-zoom-in"
                onClick={() => {
                  const imageSrc = typeof product.image === 'string'
                    ? product.image
                    : URL.createObjectURL(product.image);

                  console.log('🔍 Caminho da imagem:', imageSrc); // 👈 Aqui você vê a URL

                  setSelectedImage({
                    src: imageSrc,
                    alt: product.name
                  })
                }}
                aria-label={`Ampliar imagem de ${product.name}`}
              >
                <Image
                  src={typeof product.image === 'string' ? product.image : ''}
                  alt={product.name}
                  fill
                  className="rounded object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={products.indexOf(product) < 4}
                />
              </div>
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">{product.price}</p>
              <p className="product-description">{product.description}</p>
              <button
                className="product-tag cursor-pointer hover:bg-opacity-80 transition"
                onClick={() => addToCart(product)}
                aria-label={`Adicionar ${product.name} ao carrinho`}
              >
                {product.message}
              </button>
            </article>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-lg text-gray-600">Nenhum produto disponível no momento</p>
          </div>
        )}
      </section>
    </div>
  );
}