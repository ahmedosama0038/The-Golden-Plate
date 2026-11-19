"use client";

import { useState } from "react";

// الشكل اللي الكومبوننت محتاجه فقط (كله اختياري ما عدا id واسم وسعر)
export interface MenuListItem {
  id: string | number;
  name: string;
  description?: string;
  price?: number;
  image?: string;
  imageUrl?: string;
  tags?: string[];
  sizes?: { price: number }[];
}

interface Props<T extends MenuListItem> {
  items: T[];
  onAdd: (item: T) => void;
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";

const CURRENCY = "ج.م";

// ── السعر في مكان واحد ──
function getPriceLabel(item: MenuListItem) {
  if (item.sizes && item.sizes.length > 0) {
    return `From ${item.sizes[0].price} ${CURRENCY}`;
  }
  return `${item.price ?? 0} ${CURRENCY}`;
}

// ── الصورة: شيمر وقت التحميل + fallback مرة واحدة ──
function DishImage({ src, alt }: { src: string; alt: string }) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <div className={`dish-img-wrap ${loaded ? "is-loaded" : ""}`}>
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          // الشرط بيمنع اللوب لو الاحتياطية نفسها فشلت
          if (currentSrc !== FALLBACK_IMG) setCurrentSrc(FALLBACK_IMG);
        }}
      />
    </div>
  );
}

// ── صف المنتج ──
function MenuRow<T extends MenuListItem>({
  item,
  onAdd,
}: {
  item: T;
  onAdd: (item: T) => void;
}) {
  const src = item.imageUrl || item.image || FALLBACK_IMG;
  const hasSizes = !!item.sizes && item.sizes.length > 0;

  return (
    <div className="menu-row">
      <div className="menu-row-img">
        {/* key={src} عشان لو الصورة اتغيرت الحالة تترست */}
        <DishImage key={src} src={src} alt={item.name} />
      </div>

      <div className="menu-row-info">
        <h3>{item.name}</h3>
        <p>{item.description || "No description available."}</p>

        {item.tags && item.tags.length > 0 && (
          <div
            style={{
              marginTop: "0.4rem",
              display: "flex",
              gap: "0.4rem",
              flexWrap: "wrap",
            }}
          >
            {item.tags.map((tag) => (
              <span key={tag} className="size-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="menu-row-action">
        <span className="row-price">{getPriceLabel(item)}</span>
        <button
          type="button"
          className="row-add-btn"
          onClick={() => onAdd(item)}
          aria-label={`${hasSizes ? "Select size for" : "Add to order"}: ${item.name}`}
        >
          {hasSizes ? "Select Size" : "Add to Order"}
        </button>
      </div>
    </div>
  );
}

// ── القايمة ──
export default function MenuList<T extends MenuListItem>({
  items,
  onAdd,
}: Props<T>) {
  if (!items || items.length === 0) {
    return (
      <div className="no-results">
        <i className="fa-solid fa-magnifying-glass" />
        <p>No dishes found.</p>
      </div>
    );
  }

  return (
    <div className="menu-list">
      {items.map((item) => (
        <MenuRow key={item.id} item={item} onAdd={onAdd} />
      ))}
    </div>
  );
}