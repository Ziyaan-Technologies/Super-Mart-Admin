export type ConfigProps = {
    Sidebar_drawer: any;
    Customizer_drawer: boolean;
    mini_sidebar: boolean;
    setRTLLayout: boolean;
    actTheme: string;
    inputBg:string;
    setBorderCard: boolean;
};

const config: ConfigProps = {
    Sidebar_drawer: null,
    Customizer_drawer: false,
    mini_sidebar: false,
    setRTLLayout: false, // RTL layout
    actTheme: 'BLUE_THEME',
    inputBg: 'BLUE_THEME',
    setBorderCard: false
};

export default config;
