import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';
import { SettingsProvider, useSettings } from '../../context/SettingsContext';
import SettingsModal from '../settings/SettingsModal';

const DashboardContent = () => {
    const { settingsModal, closeSettings } = useSettings();
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex transition-colors duration-200">
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen min-w-0 overflow-hidden">
                <Topbar />
                <main className="flex-1 p-4 lg:p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>

            {/* Global Settings Modal Overlay */}
            {settingsModal && (
                <div className="fixed inset-0 z-[60]">
                    <SettingsModal initialTab={settingsModal} onClose={closeSettings} />
                </div>
            )}
        </div>
    );
};

const DashboardLayout = () => {
    return (
        <SettingsProvider>
            <DashboardContent />
        </SettingsProvider>
    );
};

export default DashboardLayout;
