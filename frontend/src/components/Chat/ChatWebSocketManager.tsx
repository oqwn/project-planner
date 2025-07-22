import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { chatWebSocketService } from '../../services/chatWebSocketService';

interface ChatWebSocketManagerProps {
  children: React.ReactNode;
}

/**
 * Chat WebSocket Manager Component
 * Handles WebSocket lifecycle based on authentication status
 * This runs at the application level, not component level
 */
export const ChatWebSocketManager: React.FC<ChatWebSocketManagerProps> = ({
  children,
}) => {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    let mounted = true;

    // Connect when authenticated
    if (user?.token && mounted) {
      // Only connect if not already connected
      if (!chatWebSocketService.isWebSocketConnected()) {
        console.log(
          '[ChatWSManager] Connecting WebSocket for user:',
          user.email
        );
        chatWebSocketService
          .connect({
            email: user.email,
            token: user.token,
          })
          .catch((error) => {
            console.error('[ChatWSManager] Failed to connect:', error);
          });
      }
    }

    // Disconnect when not authenticated
    if (!user && mounted) {
      console.log('[ChatWSManager] User logged out, disconnecting WebSocket');
      chatWebSocketService.disconnect();
    }

    return () => {
      mounted = false;
      // Don't disconnect here - let logout handle it
      // This prevents disconnection on component unmount
    };
  }, [user?.token, user?.email]);

  // Handle logout/login state changes
  useEffect(() => {
    const handleStorageChange = () => {
      // Handle auth state changes from other tabs
      if (!user) {
        chatWebSocketService.disconnect();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user]);

  return <>{children}</>;
};
