"use client";

import { useState } from "react";
import { useLang, type DictKey } from "@/lib/i18n";

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

// ── السعر في مكان واحد: أقل سعر لو فيه أحجام ──
function getPriceLabel(item: MenuListItem, t: (k: DictKey) => string) {
  const currency = t("currency");
  if (item.sizes && item.sizes.length > 0) {
    const min = Math.min(...item.sizes.map((s) => s.price));
    return `${t("menu.from")} ${min} ${currency}`;
  }
  return `${item.price ?? 0} ${currency}`;
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
  const { t } = useLang();
  const src = item.imageUrl || item.image || FALLBACK_IMG;
  const hasSizes = !!item.sizes && item.sizes.length > 0;

  return (
    <div className="menu-row">
      <div className="menu-row-img">
        <DishImage key={src} src={src} alt={item.name} />
      </div>

      <div className="menu-row-info">
        <h3>{item.name}</h3>
        <p>{item.description || t("menu.noDescription")}</p>

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
        <span className="row-price">{getPriceLabel(item, t)}</span>
        <button
          type="button"
          className="row-add-btn"
          onClick={() => onAdd(item)}
          aria-label={`${hasSizes ? t("menu.sizeAria") : t("menu.addAria")} ${item.name}`}
        >
          {hasSizes ? t("menu.chooseSize") : t("menu.addToOrder")}
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
  const { t } = useLang();

  if (!items || items.length === 0) {
    return (
      <div className="no-results">
        <i className="fa-solid fa-magnifying-glass" />
        <p>{t("menu.noResults")}</p>
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