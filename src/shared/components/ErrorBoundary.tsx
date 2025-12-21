import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert } from 'lucide-react';

interface Props {
	children?: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false
	};

	public static getDerivedStateFromError(_: Error): State {
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("Uncaught error:", error, errorInfo);
	}

	public render() {
		if (this.state.hasError) {
			return this.props.fallback || (
				<div className="bg-red-950/30 rounded-xl p-6 border border-red-500/20 h-full flex items-center justify-center text-red-400 gap-2">
					<ShieldAlert size={20} />
					<span className="text-sm">Erro ao carregar componente.</span>
				</div>
			);
		}

		return this.props.children;
	}
}
