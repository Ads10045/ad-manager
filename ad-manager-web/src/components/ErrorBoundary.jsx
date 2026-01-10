
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });

        // Log to backend
        fetch('http://localhost:3001/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                info: 'Frontend ErrorBoundary',
                error: `${error.toString()}\nComponent Stack: ${errorInfo.componentStack}`
            })
        }).catch(err => console.error('Failed to send log:', err));
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-purple-950 flex flex-col items-center justify-center p-8 text-white">
                    <h1 className="text-3xl font-bold mb-4">💥 Oups, une erreur est survenue !</h1>
                    <div className="bg-black/40 p-6 rounded-lg font-mono text-sm overflow-auto max-w-2xl w-full border border-white/10">
                        <p className="text-red-400 font-bold mb-2">{this.state.error && this.state.error.toString()}</p>
                        <pre className="opacity-60 whitespace-pre-wrap">{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition-all"
                    >
                        🔄 Rafraîchir la page
                    </button>
                    <p className="mt-4 text-xs opacity-40">L'erreur a été enregistrée dans les logs du serveur (logs/server.log).</p>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
