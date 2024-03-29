/** @jsxImportSource @emotion/react */
import { createRoot } from 'react-dom/client';
import Curation from './pages/curation';
import Home from './pages/home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/header';

const App = () => (
	<Router>
		<div>
			<Header />
			<Routes>
				<Route path="/curation/:section/*" element={<Curation />} />
				<Route path="/" element={<Home />} />
			</Routes>
		</div>
	</Router>
);

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(<App />);
