import { useState, useEffect, useCallback } from 'react';

const COCKPIT_API_URL: string = import.meta.env.VITE_COCKPIT_API_URL ?? '';
const ABOUT_RESOURCE: string = `${COCKPIT_API_URL}/api/cockpit/about`;

const useAbout = () => {
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchAbout = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        try {
            const response = await fetch(ABOUT_RESOURCE);
            if (!response.ok) {
                console.error(`${response.status} ${response.statusText}`);
                return;
            }
            const about = await response.json();
            setParagraphs(about.text.split('\n\n').filter((p: string) => p.trim() !== ''));
        }
        catch (e: unknown) {
            console.error(`${e}`);
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchAbout(); }, [fetchAbout]);

    return { paragraphs, isLoading };
};

export default useAbout;
