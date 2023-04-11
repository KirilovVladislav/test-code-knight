import styles from './Button.module.css'

type Props = {
  handleClick?: () => void,
  secondary?: boolean,
  primary?: boolean,
  children: string,
}

export function Button({ handleClick, secondary, primary, children }: Props) {
  return (
    <button
      onClick={handleClick}
      className={`
        ${styles.button}
        ${secondary && styles.secondary}
        ${primary && styles.primary}
      `}>
      {children}
    </button>
  )
}
