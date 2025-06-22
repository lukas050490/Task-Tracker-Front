import styles from './styles.module.css'


type InfoProps = {
    value: string,
    label: string,
}

export const Info = ({ value, label }: InfoProps) => {
    return (
        <div className={styles.container}>
            <strong>{value}</strong>
            <span>{label}</span>
        </div>
    )
}