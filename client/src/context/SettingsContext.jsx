import { createContext, useContext, useState } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
    const [settingsModal, setSettingsModal] = useState(null); // 'profile', 'password', 'system', 'logs', or null

    const openSettings = (tabName = 'profile') => setSettingsModal(tabName);
    const closeSettings = () => setSettingsModal(null);

    return (
        <SettingsContext.Provider value={{ settingsModal, openSettings, closeSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};
