import {
    DUIButton,
    DUINavigationButton,
    SourceStateManager,
} from '@paperback/types';

const DEFAULT_BASE_URL = 'https://luottruyen16.com';
const DEFAULT_COOKIE = '';
const DEFAULT_UA = '';

export const getDomain = async (stateManager: SourceStateManager): Promise<string> => {
    return (await stateManager.retrieve('baseUrl') as string) ?? DEFAULT_BASE_URL;
};

export const getCookie = async (stateManager: SourceStateManager): Promise<string> => {
    return (await stateManager.retrieve('cookie') as string) ?? DEFAULT_COOKIE;
};

export const getUserAgent = async (stateManager: SourceStateManager): Promise<string> => {
    return (await stateManager.retrieve('useragent') as string) ?? DEFAULT_UA;
};

export const domainSettings = (stateManager: SourceStateManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: 'domain_settings',
        label: 'Cài đặt nguồn',
        form: App.createDUIForm({
            sections: async () => [
                App.createDUISection({
                    isHidden: false,
                    id: 'content',
                    rows: async () => [
                        App.createDUIInputField({
                            id: 'baseUrl',
                            label: 'URL cơ sở',
                            value: App.createDUIBinding({
                                get: async () => await getDomain(stateManager),
                                set: async (value: string) => {
                                    const trimmed = value.trim().replace(/\/$/, '');
                                    await stateManager.store('baseUrl', trimmed || DEFAULT_BASE_URL);
                                },
                            }),
                        }),
                        App.createDUIInputField({
                            id: 'cookie',
                            label: 'Cookie (Tài khoản)',
                            value: App.createDUIBinding({
                                get: async () => await getCookie(stateManager),
                                set: async (value: string) => {
                                    await stateManager.store('cookie', value.trim() || DEFAULT_COOKIE);
                                },
                            }),
                        }),
                        App.createDUIInputField({
                            id: 'useragent',
                            label: 'User-Agent (Bắt buộc nếu dùng Cookie)',
                            value: App.createDUIBinding({
                                get: async () => await getUserAgent(stateManager),
                                set: async (value: string) => {
                                    await stateManager.store('useragent', value.trim() || DEFAULT_UA);
                                },
                            }),
                        }),
                    ],
                }),
            ],
        }),
    });
};

export function resetSettings(stateManager: SourceStateManager): DUIButton {
    return App.createDUIButton({
        id: 'reset',
        label: 'Đặt lại mặc định',
        onTap: async () => {
            await stateManager.store('baseUrl', DEFAULT_BASE_URL);
            await stateManager.store('cookie', DEFAULT_COOKIE);
            await stateManager.store('useragent', DEFAULT_UA);
        },
    });
}