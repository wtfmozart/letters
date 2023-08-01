import ReactDOM from 'react-dom/client'
import Game from './components/Game'
import './index.css'
import { VisibilityProvider } from './providers/VisibilityProvider'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<VisibilityProvider>
		<Game />
	</VisibilityProvider>
)
