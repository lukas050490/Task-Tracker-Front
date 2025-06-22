import { Navigate } from 'react-router-dom'
import { localStorageKey } from '../hooks/use-user'
import type { ReactNode } from 'react';
import { Sidebar } from '../../src/components/sidebar'
import { AppContainer } from '../components/app-container';

type PrivateRouteProps = {
    component: ReactNode;
}


function PrivateRoute({ component }: PrivateRouteProps) {
    const userData = localStorage.getItem(localStorageKey);

    if (!userData) {
        return <Navigate to="/entrar" />
    }

    return (
        <AppContainer>
            <Sidebar />
            {component}
        </AppContainer>
    )
}

export default PrivateRoute;