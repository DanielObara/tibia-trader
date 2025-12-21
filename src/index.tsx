import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { TransactionProvider } from './shared/context/TransactionContext';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);

root.render(
	<React.StrictMode>
		<TransactionProvider>
			<App />
		</TransactionProvider>
	</React.StrictMode>
);
