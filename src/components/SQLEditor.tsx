import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function SQLEditor() {
  const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
  const [results, setResults] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const { toast } = useToast();

  const executeQuery = async () => {
    if (!query.trim()) {
      toast({ title: 'Ошибка', description: 'Введите SQL-запрос', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const startTime = performance.now();

    try {
      const response = await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      const data = await response.json();
      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      if (data.results && data.results.length > 0) {
        setResults(data.results);
        setColumns(Object.keys(data.results[0]));
        toast({ title: 'Успех', description: `Получено записей: ${data.results.length}` });
      } else {
        setResults([]);
        setColumns([]);
        toast({ title: 'Выполнено', description: 'Запрос выполнен успешно' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось выполнить запрос', variant: 'destructive' });
      setResults([]);
      setColumns([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <h2 className="text-2xl font-semibold text-foreground">SQL-редактор</h2>
        <p className="text-sm text-muted-foreground mt-1">Выполнение SQL-запросов</p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 space-y-4 border-b border-border bg-card">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">SQL-запрос</label>
              {executionTime && (
                <span className="text-xs text-muted-foreground">
                  Время выполнения: {executionTime.toFixed(2)}ms
                </span>
              )}
            </div>
            <Textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="font-mono text-sm min-h-[120px] resize-none"
              placeholder="SELECT * FROM users;"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={executeQuery} disabled={loading} className="gap-2">
              {loading ? (
                <Icon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <Icon name="Play" size={16} />
              )}
              Выполнить
            </Button>
            <Button variant="outline" onClick={() => setQuery('')} className="gap-2">
              <Icon name="X" size={16} />
              Очистить
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          {results.length > 0 ? (
            <div className="border border-border rounded-lg bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((col) => (
                      <TableHead key={col} className="font-mono text-xs">
                        {col}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={col} className="font-mono text-xs">
                          {row[col] !== null ? String(row[col]) : <span className="text-muted-foreground italic">null</span>}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Icon name="Database" size={48} className="mx-auto mb-4 opacity-20" />
                <p>Результаты запроса появятся здесь</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}