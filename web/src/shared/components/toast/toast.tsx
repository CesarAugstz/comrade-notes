import { Toaster as ReactToaster } from 'react-hot-toast'

export default function Toaster() {
  return (
    <ReactToaster
      position="bottom-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: '',
        duration: 5000,
        removeDelay: 1000,
        style: {
          background: '#363636',
          color: '#fff',
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: 'green',
            secondary: 'black',
          },
        },
      }}
    />
  )
}
