import useGlobalStore from '@config/store/useGlobalStore';
import { useRouter } from 'next/router';

export function PrivateRoute({ children }) {
    const router = useRouter();
    const user = useGlobalStore.getState().user;
    const token = useGlobalStore.getState().token;
    const isBrowser = () => typeof window !== 'undefined';

    if (isBrowser() && !user && !token) {
        router.replace({
            pathname: '/',
            query: {
                redirect: router.pathname,
            },
        });
        return <h1>Loading...</h1>;
    } else {
        return children;
    }
}
