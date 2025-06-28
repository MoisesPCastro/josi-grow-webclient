// src/app/products/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/context/CardContext";
import { IProduct } from "../interfaces";
import { listProducts } from "@/services/requestApis";
import WelcomeModal from "@/components/modal/WelComeModal";
import ManagePopup from "@/components/modal/ManagePopup";
import "@/app/products/products.css";
import { ImageModal } from "@/components/modal/ImgModal";
import EmphasisModal from "@/components/modal/EmphasisModal";
import LoadingSpinner from "@/components/loading/loadingSpinner";
import { reorderProducts } from "@/shared/functions/rorderProducts";
import { CartFloatingButton } from "@/components/icons/Cart-icon";

export default function Products() {
  const [isProducts, setProducts] = useState<IProduct[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [filterTerm, setFilterTerm] = useState("");
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
        const emphasisList = products.filter(p => p.emphasis).slice(0, 2);
        setEmphasisProducts(emphasisList);

        const sorted = orderBy.length
          ? reorderProducts({ products, orderBy })
          : products;

        setProducts(sorted);
        setDisplayedProducts(sorted);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleFilter = () => {
    const term = filterTerm.trim().toLowerCase();
    if (!term) {
      setDisplayedProducts(isProducts);
    } else {
      setDisplayedProducts(
        isProducts.filter(
          p =>
            p.name.toLowerCase().includes(term) ||
            p.marca.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleClearFilter = () => {
    setFilterTerm("");
    setDisplayedProducts(isProducts);
  };

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
      <CartFloatingButton />
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

      <header className="products-header-flex max-w-6xl mx-auto px-4">
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
            className="products-title cursor-pointer hover:underline text-center md:text-left"
            title="Clique para acessar o painel administrativo"
            onClick={() => setShowPopup(true)}
            aria-label="Painel administrativo"
          >
            Josi Glow
          </h1>
          <p className="eslogan text-center md:text-left">
            Ilumine seu brilho, Liberte sua beleza!
          </p>
          <p className="products-subtitle text-center md:text-left">
            Os melhores cosméticos para realçar sua beleza natural.
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            value={filterTerm}
            onChange={e => setFilterTerm(e.target.value)}
            placeholder="Buscar por nome do produto"
            className="col-span-1 sm:col-span-2 w-full border rounded px-3 py-2"
          />
          <div className="col-span-1 flex gap-2">
            <button
              onClick={handleFilter}
              className="flex-1 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Filtrar
            </button>
            <button
              onClick={handleClearFilter}
              className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      <section className="products-grid max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {displayedProducts.length > 0 ? (
          displayedProducts.map(product => (
            <article key={product.id} className="product-card">
              <h2 className="product-marca">{product.marca}</h2>
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
                  priority={displayedProducts.indexOf(product) < 4}
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
            <p className="text-lg text-gray-600">
              Nenhum produto disponível no momento
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
