import { useEffect, useState } from 'react';
import { Header, PageId } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { LeadCaptureModal } from './components/LeadCaptureModal';
import { HomePage } from './pages/HomePage';
import { CanopiesPage } from './pages/CanopiesPage';
import { StandardCanopiesPage } from './pages/StandardCanopiesPage';
import { FencesPage } from './pages/FencesPage';
import { HangarsPage } from './pages/HangarsPage';
import { ServicesPage } from './pages/ServicesPage';
import { PromotionsPage } from './pages/PromotionsPage';
import { GalleryPage } from './pages/GalleryPage';
import { VideoPage } from './pages/VideoPage';
import { ReviewsPage } from './pages/ReviewsPage';
import { ContactsPage } from './pages/ContactsPage';
import { Calculator } from './components/Calculator';
import { ProductItem } from './data/siteData';
import { EditorProvider, useEditor } from './editor/EditorContext';
import { EditorLauncher } from './editor/EditorToolbar';
import { pathForRoute, routeFromPath } from './routes';
import { requestFilter } from './editor/navFilter';

function AppInner() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => routeFromPath().page);
  const { editMode } = useEditor();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('Заявка на выезд замерщика (3 000 ₽ — вычитается из стоимости заказа)');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleOpenOrder = (title?: string) => {
    if (title) setModalTitle(title);
    else setModalTitle('Заявка на выезд замерщика (3 000 ₽ — вычитается из стоимости заказа)');
    setModalOpen(true);
  };

  const handleSelectProduct = (product: ProductItem) => {
    setModalTitle(`Заказ: ${product.title} (${product.price})`);
    setModalOpen(true);
  };

  const handleNavigate = (page: PageId, filter?: string, replace = false) => {
    if (filter) requestFilter(page, filter);
    setCurrentPage(page);
    const path = pathForRoute(page, filter);
    if (window.location.pathname !== encodeURI(path) && window.location.pathname !== path) {
      window.history[replace ? 'replaceState' : 'pushState']({ page, filter }, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const initial = routeFromPath();
    if (initial.filter) requestFilter(initial.page, initial.filter);
    const onPopState = () => {
      const route = routeFromPath();
      if (route.filter) requestFilter(route.page, route.filter);
      setCurrentPage(route.page);
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };

  return (
    <div
      className={`min-h-screen bg-white text-slate-800 flex flex-col selection:bg-orange-500 selection:text-white ${
        editMode ? 'mcs-edit-mode' : ''
      }`}
    >
      {/* Индикатор режима редактирования */}
      {editMode && (
        <div className="sticky top-0 z-[110] bg-gradient-to-r from-orange-600 to-amber-600 text-white text-xs font-bold text-center py-1.5 px-4 shadow-md">
          ✏️ Режим редактирования включён — наведите на любой текст или фото и нажмите, чтобы изменить. Изменения сохраняются автоматически.
        </div>
      )}

      {/* 1. Main Navigation Header with All Pages */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenOrder={handleOpenOrder}
      />

      {/* 3. Page Routing */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onOpenOrder={handleOpenOrder}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'standard' && (
          <StandardCanopiesPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'canopies' && (
          <CanopiesPage
            onOpenOrder={handleOpenOrder}
            onNavigateToStandard={() => handleNavigate('standard')}
          />
        )}

        {currentPage === 'fences' && (
          <FencesPage
            onSelectProduct={handleSelectProduct}
            onOpenOrder={handleOpenOrder}
          />
        )}

        {currentPage === 'hangars' && (
          <HangarsPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'services' && (
          <ServicesPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'promotions' && (
          <PromotionsPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'gallery' && (
          <GalleryPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'video' && (
          <VideoPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'reviews' && (
          <ReviewsPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'contacts' && (
          <ContactsPage onOpenOrder={handleOpenOrder} />
        )}

        {currentPage === 'calculator' && (
          <div className="bg-white py-6">
            <Calculator onSuccessOrder={(details) => showToast(details)} />
          </div>
        )}
      </main>

      {/* 4. Comprehensive White/Slate Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenOrder={handleOpenOrder}
      />

      {/* 5. Floating Quick Action Buttons */}
      <FloatingActions
        onOpenOrder={handleOpenOrder}
        onNavigate={handleNavigate}
      />

      {/* 6. Lead Capture Modal */}
      <LeadCaptureModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialTitle={modalTitle}
        onSuccess={(_info) => {
          showToast('Заявка успешно принята! Менеджер перезвонит в течение 10 минут.');
        }}
      />

      {/* 7. Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 border border-emerald-500/50 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 8. Панель редактора сайта */}
      <EditorLauncher />
    </div>
  );
}

export function App() {
  return (
    <EditorProvider>
      <AppInner />
    </EditorProvider>
  );
}

export default App;
