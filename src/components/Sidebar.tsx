import Icon from '@/components/ui/icon';

type ViewType = 'tables' | 'users' | 'sql' | 'import-export' | 'logs' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const menuItems = [
  { id: 'tables' as ViewType, label: 'Таблицы', icon: 'Database' },
  { id: 'users' as ViewType, label: 'Пользователи', icon: 'Users' },
  { id: 'sql' as ViewType, label: 'SQL-редактор', icon: 'Code' },
  { id: 'import-export' as ViewType, label: 'Импорт/Экспорт', icon: 'Upload' },
  { id: 'logs' as ViewType, label: 'Логи', icon: 'FileText' },
  { id: 'settings' as ViewType, label: 'Настройки', icon: 'Settings' },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-xl font-semibold text-sidebar-foreground flex items-center gap-2">
          <Icon name="Database" size={24} className="text-sidebar-primary" />
          Admin Panel
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
              currentView === item.id
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
            }`}
          >
            <Icon name={item.icon} size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground text-sm font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin</p>
            <p className="text-xs text-sidebar-foreground/60 truncate">admin@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
