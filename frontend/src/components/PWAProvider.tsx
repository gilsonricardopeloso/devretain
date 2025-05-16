import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);

  const updateServiceWorker = registerSW({
    onNeedRefresh() {
      setNeedRefresh(true);
    },
    onOfflineReady() {
      setOfflineReady(true);
    },
  });

  useEffect(() => {
    // Limpar os estados após 5 segundos
    if (offlineReady || needRefresh) {
      const timer = setTimeout(() => {
        setOfflineReady(false);
        setNeedRefresh(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [offlineReady, needRefresh]);

  return (
    <>
      {children}
      {(needRefresh || offlineReady) && (
        <div className="fixed bottom-0 right-0 m-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          {needRefresh ? (
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">
                Nova versão disponível!
              </p>
              <button
                onClick={() => updateServiceWorker(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Atualizar
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-700">
              Aplicativo pronto para uso offline
            </p>
          )}
        </div>
      )}
    </>
  );
} 