import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TablesView from '@/components/TablesView';
import UsersView from '@/components/UsersView';
import SQLEditor from '@/components/SQLEditor';
import ImportExport from '@/components/ImportExport';
import LogsView from '@/components/LogsView';
import SettingsView from '@/components/SettingsView';

type ViewType = 'tables' | 'users' | 'sql' | 'import-export' | 'logs' | 'settings';

const Index = () => {
  const [currentView, setCurrentView] = useState<ViewType>('users');

  const renderView = () => {
    switch (currentView) {
      case 'tables':
        return <TablesView />;
      case 'users':
        return <UsersView />;
      case 'sql':
        return <SQLEditor />;
      case 'import-export':
        return <ImportExport />;
      case 'logs':
        return <LogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <UsersView />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default Index;
