"use client";

import Image from "next/image";
import products from "@/components/Posts/cards/products.json";
import "@/app/products/products.css";
import WelcomeModal from "@/components/modal/WelComeModal";
import { useCart } from "@/app/context/CardContext";

export default function Products() {

  const { addToCart } = useCart();
  return (
    <div className="products-page">
      <WelcomeModal />
      <header className="products-header-flex">
        <div className="product_logo">
          <img
            src="/imgs/logo-josi-glow.png"
            alt="Logo Josi Glow"
            className="product-logo-header"
          />
        </div>
        <div className="header-content">
          <h1 className="products-title">Josi Glow</h1>
          <span className="chavao">Ilumine seu brilho, Liberte sua beleza!</span>
          <div className="products-subtitle">
            Os melhores cosméticos para realçar sua beleza natural.
          </div>
        </div>
      </header>

      <section className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <Image
                src={`/imgs/products/${product.image}`}
                alt={product.name}
                fill
                className="rounded object-contain"
              />
            </div>
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">{product.price}</p>
            <p className="product-description">{product.description}</p>
            <div
              className="product-tag cursor-pointer hover:bg-opacity-80 transition"
              onClick={() => addToCart(product)}
            >
              {product.message}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
