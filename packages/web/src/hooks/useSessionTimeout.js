import { useEffect, useRef } from 'react';
import { SESSION_TIMEOUT } from '@wealthnest/shared';
export function useSessionTimeout(onTimeout) {
    const lastActivity = useRef(Date.now());
    useEffect(() => {
        const check = setInterval(() => {
            if (Date.now() - lastActivity.current > SESSION_TIMEOUT) {
                onTimeout();
            }
        }, 30000);
        const resetTimer = () => {
            lastActivity.current = Date.now();
        };
        window.addEventListener('click', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('touchstart', resetTimer);
        return () => {
            clearInterval(check);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
        };
    }, [onTimeout]);
}
//# sourceMappingURL=useSessionTimeout.js.map