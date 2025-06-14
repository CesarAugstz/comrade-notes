import LoginForm from '../components/login-form'
import { useState } from 'react'
import SingupForm from '../components/singup-form'
import { AnimatePresence, motion } from 'motion/react'

export default function LoginPage() {
  const [isSingup, setIsSingup] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-base-content mb-2">
              Comrade Notes
            </h1>
            <p className="text-lg text-base-content/70 max-w-md">
              Your collaborative note-taking platform for seamless teamwork and
              productivity
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={isSingup ? 'signup' : 'login'}
              initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
            >
              {!isSingup ? (
                <LoginForm />
              ) : (
                <SingupForm
                  onSingup={() => {
                    setIsSingup(false)
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-1 text-sm text-base-content/70">
            <span>Don't have an account?</span>
            <button
              className="text-secondary font-medium cursor-pointer hover:text-secondary/80"
              onClick={() => setIsSingup(!isSingup)}
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
