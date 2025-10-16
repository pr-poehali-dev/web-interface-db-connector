import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface TableDataViewProps {
  tableName: string;
  tableSchema?: string;
  onBack: () => void;
}

interface ColumnInfo {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

export default function TableDataView({ tableName, tableSchema, onBack }: TableDataViewProps) {
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<ColumnInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editDialog, setEditDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fullTableName = tableSchema ? `"${tableSchema}"."${tableName}"` : `"${tableName}"`;

  useEffect(() => {
    fetchTableData();
    fetchColumns();
  }, [tableName, tableSchema]);

  const fetchColumns = async () => {
    try {
      const query = `
        SELECT column_name::text, data_type::text, is_nullable::text
        FROM information_schema.columns
        WHERE table_name = '${tableName}'
        ${tableSchema ? `AND table_schema = '${tableSchema}'` : ''}
        ORDER BY ordinal_position
      `;
      const response = await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      if (result.results) {
        setColumns(result.results);
      }
    } catch (error) {
      console.error('Error fetching columns:', error);
    }
  };

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const query = `SELECT * FROM ${fullTableName} LIMIT 100`;
      const response = await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      const result = await response.json();
      if (result.results) {
        setData(result.results);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row: any) => {
    setSelectedRow(row);
    setFormData(row);
    setEditDialog(true);
  };

  const handleDelete = (row: any) => {
    setSelectedRow(row);
    setDeleteDialog(true);
  };

  const handleAdd = () => {
    const newFormData: Record<string, any> = {};
    columns.forEach(col => {
      if (col.column_name !== 'id') {
        newFormData[col.column_name] = '';
      }
    });
    setFormData(newFormData);
    setAddDialog(true);
  };

  const executeUpdate = async () => {
    try {
      const setClauses = Object.entries(formData)
        .filter(([key]) => key !== 'id')
        .map(([key, value]) => `"${key}" = '${value}'`)
        .join(', ');
      
      const query = `UPDATE ${fullTableName} SET ${setClauses} WHERE id = ${selectedRow.id}`;
      
      await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      setEditDialog(false);
      fetchTableData();
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const executeDelete = async () => {
    try {
      const query = `DELETE FROM ${fullTableName} WHERE id = ${selectedRow.id}`;
      
      await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      setDeleteDialog(false);
      fetchTableData();
    } catch (error) {
      console.error('Error deleting:', error);
    }
  };

  const executeAdd = async () => {
    try {
      const columnNames = Object.keys(formData).map(k => `"${k}"`).join(', ');
      const values = Object.values(formData).map(v => `'${v}'`).join(', ');
      
      const query = `INSERT INTO ${fullTableName} (${columnNames}) VALUES (${values})`;
      
      await fetch('https://functions.poehali.dev/a20964af-6dfe-4727-aef3-f7f941e4abc4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      
      setAddDialog(false);
      fetchTableData();
    } catch (error) {
      console.error('Error adding:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icon name="Loader2" size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <Icon name="ArrowLeft" size={16} />
            </Button>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">{tableName}</h2>
              <p className="text-sm text-muted-foreground mt-1">{data.length} записей</p>
            </div>
          </div>
          <Button onClick={handleAdd} className="gap-2">
            <Icon name="Plus" size={16} />
            Добавить запись
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((col) => (
                  <TableHead key={col.column_name}>{col.column_name}</TableHead>
                ))}
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, idx) => (
                <TableRow key={idx}>
                  {columns.map((col) => (
                    <TableCell key={col.column_name}>
                      {row[col.column_name]?.toString() || '-'}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}>
                        <Icon name="Pencil" size={14} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(row)}>
                        <Icon name="Trash2" size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать запись</DialogTitle>
            <DialogDescription>Измените данные записи</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {columns.filter(col => col.column_name !== 'id').map((col) => (
              <div key={col.column_name} className="space-y-2">
                <Label>{col.column_name}</Label>
                <Input
                  value={formData[col.column_name] || ''}
                  onChange={(e) => setFormData({ ...formData, [col.column_name]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Отмена</Button>
            <Button onClick={executeUpdate}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить запись</DialogTitle>
            <DialogDescription>Вы уверены? Это действие нельзя отменить.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>Отмена</Button>
            <Button variant="destructive" onClick={executeDelete}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addDialog} onOpenChange={setAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить запись</DialogTitle>
            <DialogDescription>Заполните данные новой записи</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {columns.filter(col => col.column_name !== 'id').map((col) => (
              <div key={col.column_name} className="space-y-2">
                <Label>{col.column_name}</Label>
                <Input
                  value={formData[col.column_name] || ''}
                  onChange={(e) => setFormData({ ...formData, [col.column_name]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialog(false)}>Отмена</Button>
            <Button onClick={executeAdd}>Добавить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}