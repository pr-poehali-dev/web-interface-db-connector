import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function ImportExport() {
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'SELECT * FROM users' }),
      });
      const data = await response.json();
      
      const jsonString = JSON.stringify(data.results, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `export_${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({ title: 'Успех', description: 'Данные экспортированы' });
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось экспортировать данные', variant: 'destructive' });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <h2 className="text-2xl font-semibold text-foreground">Импорт/Экспорт</h2>
        <p className="text-sm text-muted-foreground mt-1">Управление данными базы</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Download" size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Экспорт данных</h3>
                <p className="text-sm text-muted-foreground">
                  Экспортируйте данные в формате JSON
                </p>
              </div>
            </div>
            <Button onClick={handleExport} className="w-full gap-2">
              <Icon name="Download" size={16} />
              Экспортировать JSON
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Icon name="Upload" size={24} className="text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Импорт данных</h3>
                <p className="text-sm text-muted-foreground">
                  Загрузите данные из файла JSON
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Icon name="Upload" size={16} />
              Выбрать файл
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Icon name="FileDown" size={24} className="text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Экспорт схемы</h3>
                <p className="text-sm text-muted-foreground">
                  Получите SQL-схему базы данных
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Icon name="FileDown" size={16} />
              Экспортировать схему
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Icon name="Database" size={24} className="text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">Резервная копия</h3>
                <p className="text-sm text-muted-foreground">
                  Создайте полную копию базы данных
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <Icon name="Database" size={16} />
              Создать бэкап
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}