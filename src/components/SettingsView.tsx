import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

export default function SettingsView() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <h2 className="text-2xl font-semibold text-foreground">Настройки</h2>
        <p className="text-sm text-muted-foreground mt-1">Конфигурация системы</p>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-3xl space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Database" size={20} />
              Подключение к базе данных
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Хост</Label>
                <Input defaultValue="localhost" />
              </div>
              <div className="space-y-2">
                <Label>Порт</Label>
                <Input defaultValue="5432" />
              </div>
              <div className="space-y-2">
                <Label>База данных</Label>
                <Input defaultValue="admin_panel" />
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>SSL подключение</Label>
                  <p className="text-xs text-muted-foreground">Использовать защищённое соединение</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Shield" size={20} />
              Безопасность
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Двухфакторная аутентификация</Label>
                  <p className="text-xs text-muted-foreground">Требовать 2FA для входа</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Логирование действий</Label>
                  <p className="text-xs text-muted-foreground">Сохранять историю действий</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2 pt-2">
                <Label>Время сессии (минуты)</Label>
                <Input type="number" defaultValue="60" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="Bell" size={20} />
              Уведомления
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email-уведомления</Label>
                  <p className="text-xs text-muted-foreground">Отправлять важные события на почту</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Уведомления о входе</Label>
                  <p className="text-xs text-muted-foreground">Сообщать о новых входах в систему</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button className="gap-2">
              <Icon name="Save" size={16} />
              Сохранить настройки
            </Button>
            <Button variant="outline" className="gap-2">
              <Icon name="RotateCcw" size={16} />
              Сбросить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
