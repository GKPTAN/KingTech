import '@/style/components/layout/loadingPage/LoadingPage.css';

interface LoadingPageProps {
    color?: string;
}

const LoadingPage = ({color = 'dark-green'}: LoadingPageProps) => {
  return (
    <div role='status' aria-live='polite' aria-busy="true" className="loading-page">
        <div className={`loader ${color}`}>
            <span className="circle-1"></span>
            <span className="circle-2"></span>
            <span className="circle-3"></span>
            <span className="circle-4"></span>
            <span className="circle-5"></span>
            <span className="circle-6"></span>
            <span className="circle-7"></span>
        </div>
        <span className="sr-only">Carregando…</span>
    </div>
  )
}

export default LoadingPage