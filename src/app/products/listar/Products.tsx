"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CardContext";
import { IProduct } from "../interfaces";
import { listProducts } from "@/services/requestApis"; // <- nome corrigido
import WelcomeModal from "@/components/modal/WelComeModal";
import ManagePopup from "@/components/modal/ManagePopup";
import "@/app/products/products.css";
import { ImageModal } from "@/components/modal/ImgModal";
import EmphasisModal from "@/components/modal/EmphasisModal";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import { reorderProducts } from "@/shared/functions/rorderProducts";

export default function Products() {
  const [isProducts, setProducts] = useState<IProduct[]>([]);
  const [isSelectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null);
  const [isShowPopup, setShowPopup] = useState(false);
  const [isEmphasisProducts, setEmphasisProducts] = useState<IProduct[]>([]);
  const [isShowWelcome, setShowWelcome] = useState(true);
  const [isShowEmphasis, setShowEmphasis] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { products, orderBy } = await listProducts(true);
        setEmphasisProducts(products.filter(p => p.emphasis).slice(0, 2));

        if (orderBy.length < 1) { return setProducts(products); }

        setProducts(reorderProducts({ products, orderBy }))
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleWelcomeDone = () => {
    setShowWelcome(false);
    if (isEmphasisProducts.length > 0) {
      setShowEmphasis(true);
    }
  };

  const handleEmphasisDone = () => {
    setShowEmphasis(false);
  };

  const handleLoginSuccess = (success: boolean) => {
    if (success) {
      sessionStorage.setItem("heigth", "true");
      router.replace("/manage");
    } else {
      setShowPopup(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="products-page">
      {isShowWelcome && <WelcomeModal onClose={handleWelcomeDone} />}
      {isShowEmphasis && (
        <EmphasisModal
          products={isEmphasisProducts}
          onDone={handleEmphasisDone}
        />
      )}

      {isSelectedImage && (
        <ImageModal
          src={isSelectedImage.src}
          alt={isSelectedImage.alt}
          onClose={() => setSelectedImage(null)}
        />
      )}

      {isShowPopup && <ManagePopup onSuccess={handleLoginSuccess} />}

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
        {isProducts.length > 0 ? (
          isProducts.map((product) => (
            <article key={product.id} className="product-card">
              <div
                className="product-image-container cursor-zoom-in"
                onClick={() =>
                  setSelectedImage({ src: product.imageUrl, alt: product.name })
                }
                aria-label={`Ampliar imagem de ${product.name}`}
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="rounded object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={isProducts.indexOf(product) < 4}
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
