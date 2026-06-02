
// ============================================================
//  TopBar.tsx — الشريط العلوي للأدمن
//  Server Component — بياخد الـ title كـ prop
// ============================================================

interface Props {
  title: string
}

export default function TopBar({ title }: Props) {
  return (
    <div className="adm-topbar">
      <h1 className="adm-topbar-title">{title}</h1>
      <div className="adm-topbar-right">
        {/* Avatar */}
        <div className="adm-avatar">A</div>
      </div>
    </div>
  )
}