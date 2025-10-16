import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface Log {
  id: number;
  user_id: number;
  action: string;
  details: string;
  ip_address: string;
  created_at: string;
}

export default function LogsView() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50' }),
      });
      const data = await response.json();
      setLogs(data.results || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const getActionIcon = (action: string) => {
    if (action.includes('LOGIN')) return 'LogIn';
    if (action.includes('CREATE')) return 'Plus';
    if (action.includes('UPDATE')) return 'Pencil';
    if (action.includes('DELETE')) return 'Trash2';
    return 'Activity';
  };

  const getActionColor = (action: string) => {
    if (action.includes('LOGIN')) return 'text-blue-500';
    if (action.includes('CREATE')) return 'text-green-500';
    if (action.includes('UPDATE')) return 'text-yellow-500';
    if (action.includes('DELETE')) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <h2 className="text-2xl font-semibold text-foreground">Логи активности</h2>
        <p className="text-sm text-muted-foreground mt-1">История действий пользователей</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Icon name="Loader2" size={32} className="animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${getActionColor(log.action)}`}>
                    <Icon name={getActionIcon(log.action)} size={18} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="font-mono text-xs">
                        {log.action}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        User ID: {log.user_id}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground mb-2">{log.details}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        {formatDate(log.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        {log.ip_address}
                      </span>
                    </div>
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