import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { ClockCounterClockwiseIcon, ListChecksIcon, SignOutIcon } from '@phosphor-icons/react';
import { useUser } from '../../hooks/use-user'
import clsx from 'clsx';


export function Sidebar() {
    const { userData, logout } = useUser();
    const navigate = useNavigate();
    const { pathname } = useLocation();



    function handleLogout() {
        logout();
        navigate('/entrar');
    }

    return (
        <div className={styles.container}>
            <img src={userData.avatarUrl} alt={userData.name} />
            <div className={styles.links}>
                <Link to='/'>
                    <ListChecksIcon className={clsx(pathname === '/' && styles.active)} />
                </Link>
                <Link to='/foco'>
                    <ClockCounterClockwiseIcon className={clsx(pathname === '/foco' && styles.active)} />
                </Link>
            </div>
            <SignOutIcon onClick={handleLogout} className={styles.signOut} />
        </div>
    )
}