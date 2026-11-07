import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { OrderStatusCard } from '../components/OrderStatusCard';
import { GiftCardPreviewModal } from '../components/GiftCardPreviewModal';
import { ChevronLeft } from 'lucide-react';

export const OrderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { adapter } = useApp();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const ord = await adapter.getOrder(id);
        if (mounted) {
          setOrder(ord);
          setLoading(false);
        }
      } catch (e) {
        if (mounted) setLoading(false);
      }
    };

    fetchOrder();

    // Subscribe to reactive updates from adapter
    const unsub = adapter.subscribe(fetchOrder);

    // Also poll every 1.5s if pending or paid to ensure quick reaction
    const interval = setInterval(() => {
      if (order?.status === 'pending' || order?.status === 'paid') {
        fetchOrder();
      }
    }, 1500);

    return () => {
      mounted = false;
      unsub();
      clearInterval(interval);
    };
  }, [id, adapter, order?.status]);

  if (loading) {
    return (
      <div data-testid="site-page-order" className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="p-8 rounded-3xl bg-white dark:bg-[#1d1915] border border-[#e9dfcf] dark:border-[#3a3127] animate-pulse h-64" />
      </div>
    );
  }

  if (!order) {
    return (
      <div data-testid="site-page-order" className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif">Заказ не найден</h2>
        <p className="text-sm text-[#6b5f50] dark:text-[#b5a998]">
          Заказ #{id} не найден в системе.
        </p>
        <Link
          to="/tokens"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-700 text-white font-semibold text-sm"
        >
          В магазин жетонов
        </Link>
      </div>
    );
  }

  return (
    <div data-testid="site-page-order" className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <div>
        <Link
          to="/tokens"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6b5f50] dark:text-[#b5a998] hover:text-[#1f1a14] dark:hover:text-[#f5efe6] transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Магазин жетонов</span>
        </Link>
      </div>

      <OrderStatusCard
        order={order}
        onOpenGiftCard={() => setIsGiftCardOpen(true)}
      />

      {order.code && (
        <GiftCardPreviewModal
          code={order.code}
          tokens={order.tokens}
          isOpen={isGiftCardOpen}
          onClose={() => setIsGiftCardOpen(false)}
        />
      )}
    </div>
  );
};
