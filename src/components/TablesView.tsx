import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface TableInfo {
  table_name: string;
  row_count: number;
}

export default function TablesView() {
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    setLoading(true);
    try {
      const query = `
        SELECT 
          tablename as table_name,
          0 as row_count
        FROM pg_tables 
        WHERE schemaname = 'public'
        ORDER BY tablename
      `;
      
      const response = await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      setTables(data.results || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <h2 className="text-2xl font-semibold text-foreground">Таблицы</h2>
        <p className="text-sm text-muted-foreground mt-1">Обзор таблиц базы данных</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tables.map((table) => (
              <Card key={table.table_name} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Table" size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{table.table_name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Таблица</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon name="Rows" size={14} />
                    <span>Записи</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}