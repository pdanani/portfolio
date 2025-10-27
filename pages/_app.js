import '@/styles/globals.css'
import { Poppins } from 'next/font/google'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={poppins.variable}>
      <Component {...pageProps} />
    </div>
  )
}
