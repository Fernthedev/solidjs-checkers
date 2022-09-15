import { Router } from '@solidjs/router';
import { render } from 'solid-js/web';
import Game from './pages/Game';


render(() => (
    <Router>
        <Game />
    </Router>
), document.getElementById('root') as HTMLElement);
