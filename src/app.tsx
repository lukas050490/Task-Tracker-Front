import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { MantineProvider } from '@mantine/core'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { UserProvider } from './hooks/use-user'

export function App() {
    return (
        <UserProvider>
            <MantineProvider defaultColorScheme='dark'>
                <RouterProvider router={router} />
            </MantineProvider>
        </UserProvider>
    )
}