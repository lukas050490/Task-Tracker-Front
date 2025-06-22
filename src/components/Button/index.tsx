import { type ComponentProps } from "react"
import styles from './styles.module.css'
import clsx from "clsx";


type ButtonProps = ComponentProps<'button'> & {
    variant?: 'info' | 'error';
};


export const Button = ({ children, disabled, variant = 'info', ...props }: ButtonProps) => {
    return (
        <button {...props} className={clsx(styles.container, variant === 'error' && styles.error,
            disabled && styles.disabled
        )}>{children}</button>
    )
}
