interface Props {
  title: string
  subtitle?: string
}

export default function TopBar({ title, subtitle }: Props) {
  return (
    <div className="adm-topbar">
      <div className="adm-topbar-text">
        <h1 className="adm-topbar-title">{title}</h1>
        {subtitle && <p className="adm-topbar-subtitle">{subtitle}</p>}
      </div>
      <div className="adm-topbar-right">
        <div className="adm-avatar">A</div>
      </div>
    </div>
  )
}