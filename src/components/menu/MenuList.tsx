'use client'

interface Props {
  items: any[] // خليناها any[] مؤقتاً عشان نستقبل داتا الـ API براحتنا
  onAdd: (item: any) => void
}

export default function MenuList({ items, onAdd }: Props) {
  if (!items || items.length === 0) {
    return (
      <div className="no-results">
        <i className="fa-solid fa-magnifying-glass" />
        <p>No dishes found.</p>
      </div>
    )
  }

  return (
    <div className="menu-list">
      {items.map((item) => {
        // 💡 تريكة أمان: لو السيرفر بيبعت imageUrl أو image، الكود هيقرا المتاح منهم
        const dishImage = item.imageUrl || item.image || '/images/default-food.jpg' // صوره احتياطية لو السيرفر مبعتش صورة
        const dishPrice = item.price || 0

        return (
          <div key={item.id} className="menu-row">

            {/* الصورة */}
            <div className="menu-row-img">
              <img src={dishImage} alt={item.name} loading="lazy" />
            </div>

            {/* الاسم والوصف */}
            <div className="menu-row-info">
              <h3>{item.name}</h3>
              <p>{item.description || 'No description available.'}</p>
              
              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div style={{ marginTop: '0.4rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {item.tags.map((tag: string) => (
                    <span key={tag} className="size-tag">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* السعر والزرار */}
            <div className="menu-row-action">
              <span className="row-price">
                {/* بنشيك لو السيرفر فيه ميزة الأحجام، لو مفيش بنعرض السعر العادي علطول */}
                {item.sizes && item.sizes.length > 0 
                  ? `From $${item.sizes[0].price}` 
                  : `$${dishPrice}`}
              </span>
              <button
                className="row-add-btn"
                onClick={() => onAdd(item)}
              >
                {item.sizes && item.sizes.length > 0 ? 'Select Size' : 'Add to Order'}
              </button>
            </div>

          </div>
        )
      })}
    </div>
  )
}