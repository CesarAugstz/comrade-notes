import { ApolloProvider } from '@apollo/client'
import { apolloClient } from '../../api/apollo'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertCircle, RefreshCw } from 'lucide-react'

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-6">
      <div className="card bg-base-200 shadow-xl w-full max-w-md">
        <div className="card-body text-center">
          <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
          <h2 className="card-title justify-center text-error mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-base-content/70 mb-4">
            {error.message || 'An unexpected error occurred'}
          </p>
          <div className="card-actions justify-center">
            <button onClick={resetErrorBoundary} className="btn btn-primary">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </ErrorBoundary>
  )
}
