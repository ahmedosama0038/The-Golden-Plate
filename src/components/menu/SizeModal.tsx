"use client";

import { useEffect, useState } from "react";
import { MenuItem, MenuItemSize, Extra, SelectedExtra } from "@/types";
import { useLang, type DictKey } from "@/lib/i18n";

interface Props {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (item: MenuItem, size: MenuItemSize | undefined, extras: SelectedExtra[]) => void;
}

export default function SizeModal({ item, onClose, onAdd }: Props) {
  const { t } = useLang();
  const currency = t("currency");

  const sizeLabel = (label?: string) => {
    if (!label) return "";
    return t(`size.${label.toLowerCase()}` as DictKey) || label;
  };

  const [selected, setSelected] = useState<MenuItemSize | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);

  useEffect(() => {
    setSelected(null);
    setSelectedExtras([]);
  }, [item]);

  if (!item) return null;

  // إضافات المنتج نفسه (اتفلترت في الصفحة)
  const extras: Extra[] = item.extras ?? [];
  const hasSizes = !!item.sizes && item.sizes.length > 0;
  const canAdd = !hasSizes || !!selected;

  // إكسترا من غير أحجام: تشغيل/إيقاف. إكسترا بأحجام: كل حجم صف، واختيار حجم بيبدّل الحجم القديم.
  const toggleExtra = (extra: Extra, size?: { id?: string | number; size_name: string; price: number }) => {
    setSelectedExtras((prev) => {
      const current = prev.find((e) => e.id === extra.id);
      const without = prev.filter((e) => e.id !== extra.id);
      if (!size) return current ? without : [...prev, { ...extra }];
      if (current && current.sizeLabel === size.size_name) return without;
      return [
        ...without,
        { ...extra, price: size.price, sizeLabel: size.size_name, sizeId: size.id ?? null },
      ];
    });
  };

  const handleAdd = () => {
    if (!canAdd) return;
    onAdd(item, selected ?? undefined, selectedExtras);
    setSelected(null);
    setSelectedExtras([]);
    onClose();
  };

  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const total = (selected?.price ?? item.price ?? 0) + extrasTotal;

  return (
    <div
      className="size-modal-overlay open"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="size-modal"
        style={{
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div className="size-modal-header" style={{ paddingInline: "1rem" }}>
          <h3>{item.name}</h3>
          <button className="size-modal-close" onClick={onClose}>
            <i className="fa-solid fa-xmark" />
          </button>
        </div>

        {/* Body */}
        <div
          className="size-modal-body"
          style={{
            overflowY: "auto",
            flex: 1,
          }}
        >
          {item.sizes?.map((size) => (
            <div
              key={size.id}
              className={`size-option${selected?.id === size.id ? " selected" : ""}`}
              onClick={() => setSelected(size)}
            >
              <span className="size-option-label">{sizeLabel(size.label)}</span>
              <span className="size-option-price">
                {size.price} {currency}
              </span>
            </div>
          ))}

          {/* الإضافات */}
          {extras.length > 0 && (
            <>
              <p
                style={{
                  margin: "1rem 0 0.5rem",
                  paddingInline: "1rem",
                  fontWeight: 600,
                  color: "var(--gold)",
                }}
              >
                {t("menu.extras")}
              </p>

              {extras.map((extra) => {
                const sized = !!extra.hasSizes && !!extra.sizes?.length;
                const current = selectedExtras.find((e) => e.id === extra.id);
                const rows = sized
                  ? extra.sizes!.map((sz) => ({
                      key: `${extra.id}-${sz.size_name}`,
                      label: `${extra.name} (${sizeLabel(sz.size_name)})`,
                      price: sz.price,
                      checked: current?.sizeLabel === sz.size_name,
                      onClick: () => toggleExtra(extra, sz),
                    }))
                  : [
                      {
                        key: String(extra.id),
                        label: extra.name,
                        price: extra.price,
                        checked: !!current,
                        onClick: () => toggleExtra(extra),
                      },
                    ];
                return rows.map((row) => (
                  <div
                    key={row.key}
                    className={`size-option${row.checked ? " selected" : ""}`}
                    onClick={row.onClick}
                    style={{ cursor: "pointer" }}
                  >
                    <span className="size-option-label">
                      {row.checked && (
                        <i
                          className="fa-solid fa-check"
                          style={{ marginInlineEnd: "0.4rem", color: "var(--gold)" }}
                        />
                      )}
                      {row.label}
                    </span>
                    <span className="size-option-price">
                      +{row.price} {currency}
                    </span>
                  </div>
                ));
              })}
            </>
          )}

          {/* السعر الكلي */}
          {canAdd && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.8rem 1rem",
                borderTop: "1px solid var(--card-border)",
                marginTop: "0.5rem",
                fontWeight: 600,
                color: "var(--gold)",
              }}
            >
              <span>{t("cart.total")}</span>
              <span>
                {total} {currency}
              </span>
            </div>
          )}
        </div>

        {/* زرار Add — ثابت برا الـ body */}
        <div style={{ padding: "1rem" }}>
          <button
            className="size-modal-add"
            disabled={!canAdd}
            onClick={handleAdd}
            style={{
              width: "100%",
              padding: "0.8rem",
              background: "var(--gold)",
              color: "#000",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              cursor: canAdd ? "pointer" : "not-allowed",
              opacity: canAdd ? 1 : 0.5,
            }}
          >
            {t("menu.addToOrder")}
          </button>
        </div>
      </div>
    </div>
  );
}