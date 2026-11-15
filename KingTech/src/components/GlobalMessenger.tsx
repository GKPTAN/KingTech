import type { TypeStatus } from "@/context/AuthContext"

interface GlobalMessengerProps {
    status: TypeStatus | null;
    message: string;
}

const GlobalMessenger = ({ status, message }: GlobalMessengerProps) => {
  return (
    <div className={`message ${status}`}>
        <p>{message}</p>
    </div>
  )
}

export default GlobalMessenger