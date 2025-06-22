import { GithubLogoIcon } from '@phosphor-icons/react'
import styles from './styles.module.css'
import { Button } from '../../components/Button'
import { api } from '../../services/api'

export function Login() {


  async function handleAuth() {
    try {
      const { data } = await api.get('/auth');
      window.location.href = data.redirectUrl;
    } catch (error) {
      console.error('Erro ao autenticar:', error);
    }

  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1>Entrar com</h1>
        <Button
          onClick={handleAuth}
        ><GithubLogoIcon />GitHub</Button>
        <p>Ao entrar, eu concordo com o Termo de Serviço e Política de Privacidade.</p>
      </div>
    </div>
  )
}