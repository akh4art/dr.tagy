import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Info, 
  X, 
  Check, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  ChevronRight, 
  Star, 
  Smartphone, 
  MapPin, 
  Menu, 
  ClipboardList, 
  Award, 
  BarChart3,
  Flame, 
  Droplets, 
  Activity,
  ShoppingBag,
  Plus,
  Minus,
  Sparkle,
  Gift,
  Lock,
  ThumbsUp,
  UserCheck,
  RefreshCw,
  HeartHandshake,
  TrendingUp,
  Search,
  Filter,
  Trash2,
  Edit,
  Download,
  Percent,
  Coins,
  MessageSquare,
  Camera,
  FileText,
  Upload
} from 'lucide-react';
import { Product, Order } from './types';
import { products, reviews, faqs } from './data';
import { ADMIN_EMAIL, ADMIN_PASSWORD, WHATSAPP_NUMBER } from './config';
import HeroVideoBackground from './components/HeroVideoBackground';
import fourProductsImg from './assets/images/4products.webp';
import {
  fetchOrders,
  insertOrder,
  updateOrder,
  updateOrderStatus as dbUpdateOrderStatus,
  deleteOrder as dbDeleteOrder,
  fetchUploadedImages,
  insertUploadedImage,
  deleteUploadedImage,
} from './supabaseClient';

function BeforeAfterSlider({ beforeImg, afterImg, beforeLabel = "قبل", afterLabel = "بعد" }: { beforeImg: string; afterImg: string; beforeLabel?: string; afterLabel?: string }) {
  const [pos, setPos] = useState(50);
  const ref = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef(false);

  const update = (x: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.max(1, Math.min(99, ((x - r.left) / r.width) * 100)));
  };

  React.useEffect(() => {
    const mouseMove = (e: MouseEvent) => { if (drag.current) update(e.clientX); };
    const touchMove = (e: TouchEvent) => { if (drag.current) update(e.touches[0].clientX); };
    const end = () => { drag.current = false; };
    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseup', end);
    window.addEventListener('touchmove', touchMove);
    window.addEventListener('touchend', end);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', end);
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', end);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full h-full overflow-hidden select-none cursor-ew-resize"
      onMouseDown={(e) => { drag.current = true; update(e.clientX); }}
      onTouchStart={(e) => { drag.current = true; update(e.touches[0].clientX); }}
      dir="ltr"
    >
      <img src={afterImg} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ width: `${pos}%` }}>
        <img src={beforeImg} alt={beforeLabel} className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none" referrerPolicy="no-referrer" style={{ width: `${10000 / pos}%` }} />
      </div>
      <div className="absolute top-0 bottom-0 pointer-events-none" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="h-full w-[2px] bg-white/80 drop-shadow-[0_0_6px_rgba(0,0,0,0.3)]"></div>
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center border-2 border-gold-400">
          <div className="flex gap-0.5">
            <ChevronLeft className="w-3.5 h-3.5 text-gold-600" />
            <ChevronRight className="w-3.5 h-3.5 text-gold-600" />
          </div>
        </div>
      </div>
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="bg-red-600/80 text-white text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">{beforeLabel}</span>
      </div>
      <div className="absolute top-3 right-3 z-10 pointer-events-none">
        <span className="bg-emerald-700/80 text-white text-[9px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/10">{afterLabel}</span>
      </div>
    </div>
  );
}

export default function App() {
  // Navigation & UI States
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<'bundle' | 'single'>('bundle');
  const [selectedSingleProductId, setSelectedSingleProductId] = useState<string>(products[0].id);
  const [singleQuantity, setSingleQuantity] = useState<number>(1);
  const [bundleQuantity, setBundleQuantity] = useState<number>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Admin Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('dr_tagy_admin_auth') === 'true';
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (loginEmail === ADMIN_EMAIL && loginPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('dr_tagy_admin_auth', 'true');
      setLoginEmail('');
      setLoginPassword('');
    } else {
      setLoginError('البريد الإلكتروني أو كلمة السر غير صحيحة');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('dr_tagy_admin_auth');
    navigateTo('/');
  };
  
  // Custom reviews screenshots state — loaded from Supabase
  const [uploadedReviews, setUploadedReviews] = useState<string[]>([]);
  const [uploadedImageIds, setUploadedImageIds] = useState<number[]>([]);
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);

  // Touch Swipe Gesture support for testimonials card on mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    const total = mockReviewSlides.length + uploadedReviews.length;
    if (isLeftSwipe) {
      setActiveReviewIndex(prev => (prev + 1) % total);
    } else if (isRightSwipe) {
      setActiveReviewIndex(prev => (prev - 1 + total) % total);
    }
  };

  const mockReviewSlides = [
    {
      id: 'mock-1',
      type: 'image' as const,
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600',
      caption: 'نضارة وتوهج طبيعي متكامل للبشرة بعد 15 يوماً من الاستخدام ✨'
    },
    {
      id: 'mock-2',
      type: 'image' as const,
      imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
      caption: 'توصيات واعتمادات كبار أخصائيي الجلدية والعيادات التجميلية في تركيا 🏥'
    },
    {
      id: 'mock-3',
      type: 'image' as const,
      imageUrl: 'https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&q=80&w=600',
      caption: 'ببتيدات الذهب المزدوجة لتغذية حاجز البشرة الطبيعي وشد فوري 🏆'
    },
    {
      id: 'mock-4',
      type: 'image' as const,
      imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600',
      caption: 'فحص سريري في المعامل يثبت أمان الفعالية والملاءمة للبشرة الحساسة 🔬'
    }
  ];

  const handleReviewUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        const saved = await insertUploadedImage(base64String);
        if (saved) {
          const newUploaded = [...uploadedReviews, base64String];
          const newIds = [...uploadedImageIds, saved.id];
          setUploadedReviews(newUploaded);
          setUploadedImageIds(newIds);
          setActiveReviewIndex(newUploaded.length + mockReviewSlides.length - 1);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewDelete = async (indexToDelete: number) => {
    const uploadedIndex = indexToDelete - mockReviewSlides.length;
    if (uploadedIndex >= 0 && uploadedIndex < uploadedReviews.length) {
      const imgId = uploadedImageIds[uploadedIndex];
      await deleteUploadedImage(imgId);
      const newUploaded = uploadedReviews.filter((_, i) => i !== uploadedIndex);
      const newIds = uploadedImageIds.filter((_, i) => i !== uploadedIndex);
      setUploadedReviews(newUploaded);
      setUploadedImageIds(newIds);
      setActiveReviewIndex(prev => Math.max(0, Math.min(prev, newUploaded.length + mockReviewSlides.length - 1)));
    }
  };

  const renderTestimonialsCard = () => {
    const totalSlides = mockReviewSlides.length + uploadedReviews.length;
    return (
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative max-w-[380px] w-full mx-auto"
        id="hero-package-display-content"
      >
        <div className="absolute -inset-4 bg-gradient-to-b from-gold-200/20 via-transparent to-transparent rounded-[2rem] blur-xl pointer-events-none"></div>

        <div className="relative bg-white rounded-[1.25rem] border border-cream-300/40 overflow-hidden shadow-xl">

          <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-gold-400/20 to-transparent"></div>

          <div
            className="relative h-[280px] md:h-[320px] group"
            onWheel={(e) => {
              const total = totalSlides;
              if (e.deltaY > 0) {
                setActiveReviewIndex(prev => (prev + 1) % total);
              } else {
                setActiveReviewIndex(prev => (prev - 1 + total) % total);
              }
            }}
          >
            <AnimatePresence mode="wait">
              {(() => {
                const safeIndex = activeReviewIndex % totalSlides;
                const isUploaded = safeIndex >= mockReviewSlides.length;
                const currentSlide = isUploaded
                  ? { id: `uploaded-${safeIndex}`, type: 'uploaded' as const, imageUrl: uploadedReviews[safeIndex - mockReviewSlides.length] }
                  : mockReviewSlides[safeIndex];

                return (
                  <motion.div
                    key={safeIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                  >
                    {currentSlide.imageUrl ? (
                      <div className="h-full relative">
                        <img
                          src={currentSlide.imageUrl}
                          alt={('caption' in currentSlide && currentSlide.caption) || "تجربة مصورة"}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/30 to-transparent"></div>
                        {('caption' in currentSlide && currentSlide.caption) && (
                          <div className="absolute bottom-0 inset-x-0 p-5">
                            <p className="text-warm-700 text-[11px] font-bold leading-relaxed text-right">{currentSlide.caption}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center bg-cream-50">
                        <Camera className="w-8 h-8 text-cream-300 mb-2" />
                        <span className="text-[10px] text-warm-300 font-medium">ارفعي صورة تجربتك</span>
                      </div>
                    )}

                    <div className="absolute bottom-5 left-5 text-[10px] text-warm-300 font-mono font-bold tracking-widest" dir="ltr">
                      {String(safeIndex + 1).padStart(2, '0')}/{String(totalSlides).padStart(2, '0')}
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>

            <button
              onClick={() => setActiveReviewIndex(prev => (prev - 1 + totalSlides) % totalSlides)}
              className="absolute top-1/2 -translate-y-1/2 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-cream-300/50 flex items-center justify-center text-warm-500 hover:text-warm-800 hover:bg-gold-100 hover:border-gold-400/50 transition-all active:scale-90 shadow-lg"
              id="btn-prev-review-content"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveReviewIndex(prev => (prev + 1) % totalSlides)}
              className="absolute top-1/2 -translate-y-1/2 left-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm border border-cream-300/50 flex items-center justify-center text-warm-500 hover:text-warm-800 hover:bg-gold-100 hover:border-gold-400/50 transition-all active:scale-90 shadow-lg"
              id="btn-next-review-content"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>

          <div className="px-5 py-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gold-100 border border-gold-300/40 flex items-center justify-center">
                  <Award className="w-4 h-4 text-gold-600" />
                </div>
                <div>
                  <h3 className="text-[11px] font-black text-warm-800 tracking-wide">مجموعة دكتور تاجي</h3>
                  <p className="text-[8px] text-warm-400 font-medium">روتين متكامل · 4 عبوات</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveReviewIndex(prev => (prev - 1 + totalSlides) % totalSlides)}
                  className="w-7 h-7 rounded-full bg-cream-100 border border-cream-300/40 flex items-center justify-center text-warm-400 hover:text-warm-800 hover:bg-gold-100 hover:border-gold-400/40 transition-all active:scale-90"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalSlides }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveReviewIndex(i)}
                      className={`rounded-full transition-all duration-500 cursor-pointer ${
                        activeReviewIndex === i ? 'bg-gold-400 w-3.5 h-1' : 'bg-cream-300 w-1 h-1 hover:bg-gold-300'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setActiveReviewIndex(prev => (prev + 1) % totalSlides)}
                  className="w-7 h-7 rounded-full bg-cream-100 border border-cream-300/40 flex items-center justify-center text-warm-400 hover:text-warm-800 hover:bg-gold-100 hover:border-gold-400/40 transition-all active:scale-90"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="h-[1px] bg-gradient-to-r from-gold-400/20 via-gold-400/10 to-transparent"></div>

            <div className="flex items-center justify-between">
              <div className="text-right">
                <span className="text-[8px] text-gold-500/60 block font-medium leading-none">سعر الكشف</span>
                <span className="text-lg font-black text-gold-600 block leading-none mt-0.5 tracking-tight">2,050 TL</span>
              </div>
              <div className="text-center px-3 py-1 rounded-full bg-gold-100 border border-gold-300/30">
                <span className="text-[8px] text-gold-700 font-black tracking-wide">توفير 650 TL</span>
              </div>
              <div className="text-left">
                <span className="text-[9px] text-warm-300 block font-medium leading-none">السعر الأصلي</span>
                <span className="text-[11px] text-warm-300 line-through block mt-0.5">2,700 TL</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };
  
  // Checkout Form States
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Social Proof State (Live notifications ticker)
  const [activeNotification, setActiveNotification] = useState<{
    name: string;
    city: string;
    product: string;
    time: string;
  } | null>(null);

  // Orders Admin Panel for review
  const [savedOrders, setSavedOrders] = useState<Order[]>([]);
  
  // Custom SPA Router to make the control panel a separate page at '/orders'
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const path = window.location.pathname;
    if (path.includes('/orders') || window.location.hash.includes('orders') || window.location.search.includes('orders')) {
      return '/orders';
    }
    return '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path.includes('/orders') || window.location.hash.includes('orders') || window.location.search.includes('orders')) {
        setCurrentPath('/orders');
      } else {
        setCurrentPath('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateTo = (path: string) => {
    if (path === '/') {
      window.history.pushState({}, '', '/');
      setCurrentPath('/');
    } else if (path === '/orders') {
      window.history.pushState({}, '', '/orders');
      setCurrentPath('/orders');
    } else {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showAdminPanel = currentPath === '/orders';
  const [showStickyCta, setShowStickyCta] = useState<boolean>(false);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ hours: 3, minutes: 54, seconds: 48 });

  // Luxury Slider / Ticker state for announcements
  const [tickerIndex, setTickerIndex] = useState<number>(0);
  const announcementSlides = [
    "✨ عرض فاخر اليوم: احصلي على واقي الشمس الطبي SPF50 مجاناً بقيمة 650 TL عند اقتناء البكج الكامل!",
    "🚚 شحن مبرّد وسريع مجاناً بالكامل لكافة الولايات التركية + الدفع الآمن بعد المعاينة عند الاستلام",
    "👩‍⚕️ منتجات مصادق عليها معملياً، غنية بببتيدات الذهب الكولاجينية لتغيير ملموس وصحي لبشرتك"
  ];

  // Skincare Goals Active Selector
  const [skincareGoal, setSkincareGoal] = useState<'all' | 'anti-aging' | 'sun-care' | 'lashes' | 'clense'>('all');

  // Morning vs Evening Protocol State
  const [protocolTime, setProtocolTime] = useState<'morning' | 'evening'>('morning');

  // Skin Consultation Quiz State
  const [quizStep, setQuizStep] = useState<number>(1);
  const [quizSkinType, setQuizSkinType] = useState<string>('');
  const [quizMainConcern, setQuizMainConcern] = useState<string>('');
  const [quizRecommended, setQuizRecommended] = useState<boolean>(false);

  const buyerNames = ['سارة', 'فاطمة', 'أميرة', 'أروى', 'هند', 'مريم', 'ياسمين', 'رنا', 'ريهام', 'هديل', 'ليلى', 'آية', 'منال', 'سناء'];
  const citiesList = [
    'أضنة', 'أديامان', 'أفيون قره حصار', 'أغري', 'أقساراي', 'أماسيا', 'أنقرة', 'أنطاليا',
    'أردهان', 'أرتفين', 'أيدن', 'بالكسير', 'بارتن', 'باتمان', 'بايبورت', 'بيلجيك',
    'بينغول', 'بتليس', 'بولو', 'بردور', 'بورصة', 'جانق قلعة', 'جانكري', 'جوروم',
    'دنيزلي', 'ديار بكر', 'دوزجة', 'ألازيغ', 'إرزنجان', 'أرضروم', 'إسكيشهير',
    'غازي عنتاب', 'غيرسون', 'غوموشهانه', 'هكاري', 'هاتاي', 'إغدير', 'إسبارطة',
    'إسطنبول', 'إزمير', 'قهرمان مرعش', 'قرابوك', 'قره اهر', 'قاص', 'قاستامونو',
    'قيصري', 'كلس', 'قيرق لاريلي', 'قيرشهير', 'كوجه ايلي', 'قونية', 'كوتاهيا',
    'مالاطيا', 'مانيسا', 'ماردين', 'مرسين', 'موغلا', 'موش', 'نفشهير', 'نيغده',
    'أوردو', 'أوشاق', 'ريزه', 'سامسون', 'سيرت', 'سينوب', 'سيواس', 'شرناق',
    'طكرداغ', 'طوقات', 'طرابزون', 'تونجلي', 'شانلي أورفة', 'وان',
    'يالوفا', 'يوزغات', 'زونغولداق', 'سكاريا', 'قره اهر (كيليس)'
  ].filter((v, i, a) => a.indexOf(v) === i).sort();
  const boughtProducts = [
    'البكج العلاجي المتكامل والواقي المجاني',
    'البكج العلاجي المتكامل والواقي المجاني', 
    'كريم دكتور تاجي الفاخر 6 في 1',
    'سيروم الرموش المكثف Eyeluxe',
    'غسول الطحالب البحرية المنقي'
  ];

  // Load orders + uploaded images from Supabase on startup
  useEffect(() => {
    fetchOrders().then((dbOrders) => {
      const mapped: Order[] = dbOrders.map((o) => ({
        id: o.id,
        fullName: o.full_name,
        phone: o.phone,
        city: o.city,
        address: o.address,
        selectedOffer: o.selected_offer,
        selectedProductId: o.selected_product_id,
        selectedProductName: o.selected_product_name,
        quantity: o.quantity,
        totalPrice: o.total_price,
        createdAt: o.created_at,
        status: o.status,
      }));
      setSavedOrders(mapped);
    });
    fetchUploadedImages().then((imgs) => {
      setUploadedReviews(imgs.map((i) => i.image_url));
      setUploadedImageIds(imgs.map((i) => i.id));
    });
  }, []);

  // Countdown timer ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 45, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Announcement bar transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % announcementSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Simulated elegant notification manager
  useEffect(() => {
    const showNotification = () => {
      const randomName = buyerNames[Math.floor(Math.random() * buyerNames.length)];
      const randomCity = citiesList[Math.floor(Math.random() * citiesList.length)];
      const randomProduct = boughtProducts[Math.floor(Math.random() * boughtProducts.length)];
      const randomTime = Math.floor(Math.random() * 8) + 1;

      setActiveNotification({
        name: randomName,
        city: randomCity,
        product: randomProduct,
        time: `منذ ${randomTime} دقائق`
      });

      setTimeout(() => {
        setActiveNotification(null);
      }, 5500);
    };

    const firstTimeout = setTimeout(() => {
      showNotification();
    }, 3000);

    const interval = setInterval(() => {
      showNotification();
    }, 22000);

    return () => {
      clearTimeout(firstTimeout);
      clearInterval(interval);
    };
  }, []);

  // Sticky CTA Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowStickyCta(true);
      } else {
        setShowStickyCta(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculated Order Totals
  const selectedProductObj = products.find(p => p.id === selectedSingleProductId) || products[0];
  const totalPrice = selectedOffer === 'bundle'
    ? 2050 * bundleQuantity
    : (selectedProductObj.price * singleQuantity) + 160;

  const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>/g, '').slice(0, 200);
  };

  // Form submit handler
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      setOrderError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (fullName.trim().length < 3) {
      setOrderError('الاسم يجب أن يتكون من 3 أحرف على الأقل');
      return;
    }
    if (!/^05\d{9}$/.test(phone.trim())) {
      setOrderError('رقم الجوال غير صحيح. يجب أن يبدأ بـ 05 ويتكون من 11 رقماً');
      return;
    }

    setIsSubmitting(true);

    const cleanName = sanitizeInput(fullName.trim());
    const cleanPhone = sanitizeInput(phone.trim());
    const cleanCity = sanitizeInput(city.trim());
    const cleanAddress = sanitizeInput(address.trim()) || 'سيتم تأكيد العنوان بالكامل وموعد التسليم عبر الواتس آب';

    const orderId = 'TAGY-' + Math.floor(Math.random() * 90000 + 10000);
    const productName = selectedOffer === 'single' ? selectedProductObj.name : 'البكج العلاجي المتكامل (4 في 1)';
    const quantity = selectedOffer === 'bundle' ? bundleQuantity : singleQuantity;

    const newOrder: Order = {
      id: orderId,
      fullName: cleanName,
      phone: cleanPhone,
      city: cleanCity,
      address: cleanAddress,
      selectedOffer,
      selectedProductId: selectedOffer === 'single' ? selectedSingleProductId : undefined,
      selectedProductName: productName,
      quantity,
      totalPrice: totalPrice,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Save to Supabase with error handling
    insertOrder({
      id: newOrder.id,
      full_name: newOrder.fullName,
      phone: newOrder.phone,
      city: newOrder.city,
      address: newOrder.address,
      selected_offer: newOrder.selectedOffer,
      selected_product_id: newOrder.selectedProductId,
      selected_product_name: newOrder.selectedProductName,
      quantity: newOrder.quantity,
      total_price: newOrder.totalPrice,
      status: newOrder.status,
      created_at: newOrder.createdAt,
    })
      .then((result) => {
        if (!result) {
          setOrderError('حدث خطأ أثناء حفظ الطلب. الرجاء المحاولة مرة أخرى');
          setIsSubmitting(false);
          return;
        }
        const updatedOrders = [newOrder, ...savedOrders];
        setSavedOrders(updatedOrders);
        setIsSubmitting(false);
        setOrderSuccess(newOrder);
        document.getElementById('checkout-card')?.scrollIntoView({ behavior: 'smooth' });
      })
      .catch(() => {
        setOrderError('تعذر الاتصال بقاعدة البيانات. تم حفظ الطلب محلياً');
        const updatedOrders = [newOrder, ...savedOrders];
        setSavedOrders(updatedOrders);
        setIsSubmitting(false);
        setOrderSuccess(newOrder);
      });

    // Build WhatsApp message and open immediately
    const messageText = `📦 *طلب حجز منتجات دكتور تاجي (تركيا)*
----------------------------------
🆔 *كود الحجز:* ${orderId}
👤 *الاسم:* ${cleanName}
📞 *رقم الجوال:* ${cleanPhone}
📍 *الولاية:* ${cleanCity}
🗺️ *العنوان:* ${cleanAddress}
----------------------------------
🛍️ *الطلب:* ${productName}
🔢 *الكمية:* ${quantity} طرد
💰 *المستحق عند الاستلام للباب:* ${totalPrice} TL
🚚 *الشحن:* ${selectedOffer === 'bundle' ? 'مجاني ومبرد بالكامل 🎁' : '160 TL (شحن لمنتج منفرد)'}
----------------------------------
💬 *أرجو تأكيد هذا الطلب والبدء بالشحن الفوري.*`;

    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  // Smooth scroll
  const scrollToCheckout = () => {
    document.getElementById('checkout-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectRecommendation = (matchBundle: boolean, productId?: string) => {
    if (matchBundle) {
      setSelectedOffer('bundle');
    } else if (productId) {
      setSelectedOffer('single');
      setSelectedSingleProductId(productId);
    }
    scrollToCheckout();
  };

  const resetForm = () => {
    setFullName('');
    setPhone('');
    setCity('');
    setAddress('');
    setOrderSuccess(null);
  };

  const deleteOrder = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dbDeleteOrder(id).catch(() => {});
    const updated = savedOrders.filter(o => o.id !== id);
    setSavedOrders(updated);
  };

  // Editing Order States
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState<string>('');
  const [editPhone, setEditPhone] = useState<string>('');
  const [editCity, setEditCity] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editTotalPrice, setEditTotalPrice] = useState<number>(0);
  const [editProductName, setEditProductName] = useState<string>('');
  const [editQuantity, setEditQuantity] = useState<number>(1);

  const startEditingOrder = (ord: Order) => {
    setEditingOrderId(ord.id);
    setEditFullName(ord.fullName);
    setEditPhone(ord.phone);
    setEditCity(ord.city);
    setEditAddress(ord.address);
    setEditTotalPrice(ord.totalPrice);
    setEditProductName(ord.selectedProductName || '');
    setEditQuantity(ord.quantity || 1);
  };

  const saveEditedOrder = (orderId: string) => {
    updateOrder(orderId, {
      full_name: editFullName,
      phone: editPhone,
      city: editCity,
      address: editAddress,
      total_price: Number(editTotalPrice),
      selected_product_name: editProductName,
      quantity: Number(editQuantity),
    });
    const updated = savedOrders.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          fullName: editFullName,
          phone: editPhone,
          city: editCity,
          address: editAddress,
          totalPrice: Number(editTotalPrice),
          selectedProductName: editProductName,
          quantity: Number(editQuantity)
        };
      }
      return o;
    });
    setSavedOrders(updated);
    setEditingOrderId(null);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    dbUpdateOrderStatus(orderId, newStatus).catch(() => {});
    const updated = savedOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setSavedOrders(updated);
  };

  // Admin search, filter and sort states
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');
  const [adminSortBy, setAdminSortBy] = useState<string>('newest');

  // Statistics Calculations
  const statsTotalCount = savedOrders.length;
  const statsPendingCount = savedOrders.filter(o => o.status === 'pending' || !o.status).length;
  const statsPreparingCount = savedOrders.filter(o => o.status === 'preparing').length;
  const statsShippedCount = savedOrders.filter(o => o.status === 'shipped').length;
  const statsDeliveredCount = savedOrders.filter(o => o.status === 'delivered').length;
  const statsCancelledCount = savedOrders.filter(o => o.status === 'cancelled').length;

  // Active Financial Sales (delivered orders only)
  const statsDeliveredRevenue = savedOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Potential Revenue (all except cancelled)
  const statsPotentialRevenue = savedOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Total Packages Sold (delivered orders only)
  const statsDeliveredQuantity = savedOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.quantity || 1), 0);

  // Delivery Rate
  const statsDeliveryRate = statsTotalCount > 0 
    ? Math.round((statsDeliveredCount / statsTotalCount) * 100) 
    : 0;

  // Best Selling Product
  const getBestSellingProduct = () => {
    if (savedOrders.length === 0) return 'لا يوجد بيانات';
    const counts: { [key: string]: number } = {};
    savedOrders.forEach(o => {
      const pName = o.selectedProductName || 'البكج العلاجي';
      counts[pName] = (counts[pName] || 0) + (o.quantity || 1);
    });
    let bestProduct = '';
    let maxQty = -1;
    Object.entries(counts).forEach(([name, qty]) => {
      if (qty > maxQty) {
        maxQty = qty;
        bestProduct = name;
      }
    });
    return bestProduct ? `${bestProduct} (${maxQty} طرود)` : 'لا يوجد بيانات';
  };

  // Top demand cities/states
  const getTopDemandCity = () => {
    if (savedOrders.length === 0) return 'لا يوجد بيانات';
    const counts: { [key: string]: number } = {};
    savedOrders.forEach(o => {
      const city = o.city || 'غير محدد';
      counts[city] = (counts[city] || 0) + 1;
    });
    let topCity = '';
    let maxCount = -1;
    Object.entries(counts).forEach(([name, c]) => {
      if (c > maxCount) {
        maxCount = c;
        topCity = name;
      }
    });
    return topCity ? `${topCity} (${maxCount} طلبات)` : 'لا يوجد بيانات';
  };

  // Filtered and Sorted Orders for Admin
  const getFilteredAndSortedOrders = () => {
    return savedOrders
      .filter(ord => {
        // Status filter
        if (adminStatusFilter !== 'all') {
          const s = ord.status || 'pending';
          if (s !== adminStatusFilter) return false;
        }
        // Search query
        if (adminSearch.trim() !== '') {
          const query = adminSearch.toLowerCase();
          const matchesName = ord.fullName.toLowerCase().includes(query);
          const matchesPhone = ord.phone.includes(query);
          const matchesId = ord.id.toLowerCase().includes(query);
          const matchesCity = ord.city.toLowerCase().includes(query);
          const matchesProduct = (ord.selectedProductName || '').toLowerCase().includes(query);
          return matchesName || matchesPhone || matchesId || matchesCity || matchesProduct;
        }
        return true;
      })
      .sort((a, b) => {
        if (adminSortBy === 'newest') {
          return b.id.localeCompare(a.id);
        } else if (adminSortBy === 'oldest') {
          return a.id.localeCompare(b.id);
        } else if (adminSortBy === 'highest_value') {
          return (b.totalPrice || 0) - (a.totalPrice || 0);
        } else if (adminSortBy === 'lowest_value') {
          return (a.totalPrice || 0) - (b.totalPrice || 0);
        }
        return 0;
      });
  };

  const contactCustomerWhatsApp = (ord: Order) => {
    const messageText = `أهلاً بكِ أختي الكريمة 🌸 يسعدنا تواصلكِ مع عيادة دكتور تاجي للعناية بالبشرة.

لقد تلقينا طلب الحجز الخاص بكِ وتفاصيل الفاتورة كالتالي:
📦 *كود الحجز:* ${ord.id}
👤 *الاسم الكلي:* ${ord.fullName}
📞 *رقم الجوال:* ${ord.phone}
📍 *الولاية:* ${ord.city}
🗺️ *العنوان:* ${ord.address}
----------------------------------
🛍️ *الطلب الطبي:* ${ord.selectedProductName}
🔢 *الكمية:* ${ord.quantity} طرد
💰 *المستحق عند الاستلام للباب:* ${ord.totalPrice} TL
🚚 *الشحن:* مجاني ومبرّد بالكامل لكي 🎁

يرجى إفادتنا بتأكيد هذا الطلب لنباشر الشحن الفوري لباب منزلكِ وتزويدكِ برقم التتبع ✨`;

    const encoded = encodeURIComponent(messageText);
    let cleanPhone = ord.phone.replace(/\D/g, '');
    
    // Auto-replace Turkish phone starting with 05 with 905 for WhatsApp API
    if (cleanPhone.startsWith('05') && cleanPhone.length === 11) {
      cleanPhone = '90' + cleanPhone.substring(1);
    } else if (cleanPhone.startsWith('5') && cleanPhone.length === 10) {
      cleanPhone = '90' + cleanPhone;
    } else if (!cleanPhone.startsWith('90') && !cleanPhone.startsWith('0090')) {
      if (cleanPhone.length <= 11) {
        cleanPhone = '90' + cleanPhone;
      }
    }
    
    if (cleanPhone.startsWith('00')) {
      cleanPhone = cleanPhone.substring(2);
    }
    
    window.open(`https://wa.me/${cleanPhone}?text=${encoded}`, '_blank');
  };

  const handleSkinGoalClick = (goal: typeof skincareGoal) => {
    setSkincareGoal(goal);
    // Smooth scroll down to showcase with minor offset if desired
    const target = document.getElementById('products-showcase');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (showAdminPanel) {
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4" dir="rtl">
          <div className="max-w-sm w-full bg-white rounded-3xl border border-cream-300/40 shadow-xl p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mx-auto shadow-lg shadow-gold-500/20">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-black text-warm-800">لوحة التحكم</h2>
              <p className="text-xs text-warm-400 font-light">تسجيل دخول المسؤول</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-warm-600 block">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="admin@drtagy.com"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-300/50 rounded-xl text-xs text-warm-800 placeholder-warm-300 focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400/50 transition-all"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-warm-600 block">كلمة السر</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-300/50 rounded-xl text-xs text-warm-800 placeholder-warm-300 focus:outline-none focus:ring-2 focus:ring-gold-400/30 focus:border-gold-400/50 transition-all"
                  required
                />
              </div>

              {loginError && (
                <p className="text-xs text-red-500 font-bold text-center bg-red-50 border border-red-200/50 rounded-xl px-3 py-2">{loginError}</p>
              )}

              <button
                type="submit"
                className="w-full bg-warm-800 hover:bg-warm-700 text-white font-black text-sm py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
              >
                تسجيل الدخول
              </button>
            </form>

            <div className="text-center">
              <button
                onClick={() => navigateTo('/')}
                className="text-[11px] text-gold-600 hover:text-gold-700 font-bold cursor-pointer"
              >
                ← العودة للصفحة الرئيسية
              </button>
            </div>

          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-cream-50 text-warm-800 font-sans text-right pb-16" dir="rtl" id="admin-standalone-page">
        {/* Admin Header */}
        <header className="bg-white border-b border-cream-300/30 shadow-sm sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 py-4">
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="w-10 h-10 rounded-xl bg-warm-800 flex items-center justify-center shadow-sm">
                  <ClipboardList className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-sm md:text-base font-black text-warm-800">لوحة التحكم</h1>
                    <span className="bg-gold-100 border border-gold-300/30 text-[9px] text-gold-700 font-extrabold px-2 py-0.5 rounded-full">Admin</span>
                  </div>
                  <p className="text-[10px] text-warm-400 font-light leading-none mt-0.5">إدارة الطلبيات وتحليلات المبيعات</p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={() => navigateTo('/')}
                  className="bg-warm-800 hover:bg-warm-700 text-white font-bold text-[10px] py-2 px-3.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shadow-sm"
                  id="close-admin-standalone-btn"
                >
                  <span>المتجر</span>
                </button>

                <button 
                  onClick={handleLogout}
                  className="bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] py-2 px-3.5 rounded-xl border border-red-200/50 transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>خروج</span>
                </button>
              </div>

            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
          
          {/* Section: 1. Overview KPIs cards ("قسم النتائج وتحليل الطلبات والعائد المالي والإحصائيات") */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="admin-kpis-grid">
            
            {/* KPI 1 : Financial Sales Revenue */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 opacity-60"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-extrabold">العائد المالي الفعلي (تم التسليم)</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-650">
                  <Coins className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl md:text-3xl font-black text-warm-800 tracking-tight">{statsDeliveredRevenue} TL</span>
                <p className="text-[10px] text-neutral-450 mt-1 font-light">تم احتسابه من إجمالي مبيعات البكجات المسلمة فقط</p>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">العائد المالي المتوقع (شامل الكل):</span>
                <span className="font-bold text-[#aa843f]">{statsPotentialRevenue} TL</span>
              </div>
            </div>

            {/* KPI 2 : Delivery Rate & Packages */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-50 rounded-bl-full -z-10 opacity-60"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-extrabold">معدل التسليم (COD)</span>
                <div className="w-9 h-9 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-600">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-warm-800 tracking-tight">{statsDeliveryRate}%</span>
                <span className="text-xs text-neutral-400 font-light">({statsDeliveredCount} من {statsTotalCount})</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">مجموع الطرود المسلمة:</span>
                <span className="font-bold text-emerald-600">{statsDeliveredQuantity} طرد</span>
              </div>
            </div>

            {/* KPI 3 : Best Seller Product */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-bl-full -z-10 opacity-60"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-extrabold">الروتين الأكثر مبيعاً بالتعداد</span>
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                  <Sparkles className="w-5 h-5 text-rose-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xs font-black text-rose-950 block leading-tight max-w-xs line-clamp-2 font-sans">
                  {getBestSellingProduct()}
                </span>
                <p className="text-[10px] text-neutral-450 mt-1 font-light font-sans">الأعلى طلباً من قبل العميلات بالنموذج</p>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">إجمالي كميات المستودع المباعة:</span>
                <span className="font-bold text-warm-800">
                  {savedOrders.reduce((sum, o) => sum + (o.quantity || 1), 0)} طقم
                </span>
              </div>
            </div>

            {/* KPI 4 : Top Ordering City */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-60"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-extrabold">الولاية الأكثر طلباً للشحنات</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                  <MapPin className="w-4 h-4 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm font-black text-blue-950 block font-sans">
                  {getTopDemandCity()}
                </span>
                <p className="text-[10px] text-neutral-450 mt-1 font-light">الولاية التركية الأكثر كثافة للطلبيات</p>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">سرعة خدمة الشحن لجميع الولايات:</span>
                <span className="font-bold text-green-650">24-48 ساعة ⚡</span>
              </div>
            </div>

          </div>

          {/* Section: 2. Core Status Distribution Cards ("عدد الطلبات المؤكدة والطلبات المرفوضة والمعلقة والجديدة") */}
          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-warm-800 flex items-center gap-1.5 border-r-4 border-gold-500 pr-3">
              <span>تحليل الطلبات حسب الحالة التشغيلية الفورية</span>
              <span className="text-xs text-neutral-400 font-semibold font-sans">({statsTotalCount} طرد مسجل)</span>
            </h3>
            
            <div className="grid grid-cols-5 gap-2" id="order-types-distribution">
              
              {/* Box 1 : Pending orders */}
              <div className={`rounded-xl p-3 text-center border transition-all ${statsPendingCount > 0 ? 'bg-amber-50/80 border-amber-200/50' : 'bg-neutral-50 border-neutral-200/50'}`}>
                <span className="text-[9px] font-black text-amber-800 block">⏳ بالإنتظار</span>
                <span className="text-xl font-black text-amber-600 block font-mono mt-1 leading-tight">{statsPendingCount}</span>
                <span className="text-[9px] text-amber-500/70 font-bold">{statsTotalCount > 0 ? Math.round((statsPendingCount / statsTotalCount) * 100) : 0}%</span>
              </div>

              {/* Box 2 : Preparing orders */}
              <div className={`rounded-xl p-3 text-center border transition-all ${statsPreparingCount > 0 ? 'bg-blue-50/80 border-blue-200/50' : 'bg-neutral-50 border-neutral-200/50'}`}>
                <span className="text-[9px] font-black text-blue-800 block">📦 تم التجهيز</span>
                <span className="text-xl font-black text-blue-600 block font-mono mt-1 leading-tight">{statsPreparingCount}</span>
                <span className="text-[9px] text-blue-500/70 font-bold">{statsTotalCount > 0 ? Math.round((statsPreparingCount / statsTotalCount) * 100) : 0}%</span>
              </div>

              {/* Box 3 : Shipped orders */}
              <div className={`rounded-xl p-3 text-center border transition-all ${statsShippedCount > 0 ? 'bg-indigo-50/80 border-indigo-200/50' : 'bg-neutral-50 border-neutral-200/50'}`}>
                <span className="text-[9px] font-black text-indigo-800 block">🚚 تم الشحن</span>
                <span className="text-xl font-black text-indigo-600 block font-mono mt-1 leading-tight">{statsShippedCount}</span>
                <span className="text-[9px] text-indigo-500/70 font-bold">{statsTotalCount > 0 ? Math.round((statsShippedCount / statsTotalCount) * 100) : 0}%</span>
              </div>

              {/* Box 4 : Delivered orders */}
              <div className={`rounded-xl p-3 text-center border transition-all ${statsDeliveredCount > 0 ? 'bg-green-50/80 border-green-200/50' : 'bg-neutral-50 border-neutral-200/50'}`}>
                <span className="text-[9px] font-black text-green-800 block">✅ تم التسليم</span>
                <span className="text-xl font-black text-green-600 block font-mono mt-1 leading-tight">{statsDeliveredCount}</span>
                <span className="text-[9px] text-green-500/70 font-bold">{statsTotalCount > 0 ? Math.round((statsDeliveredCount / statsTotalCount) * 100) : 0}%</span>
              </div>

              {/* Box 5 : Cancelled orders */}
              <div className={`rounded-xl p-3 text-center border transition-all ${statsCancelledCount > 0 ? 'bg-gray-50/80 border-gray-200/50' : 'bg-neutral-50 border-neutral-200/50'}`}>
                <span className="text-[9px] font-black text-gray-700 block">✗ ملغي</span>
                <span className="text-xl font-black text-gray-600 block font-mono mt-1 leading-tight">{statsCancelledCount}</span>
                <span className="text-[9px] text-gray-500/70 font-bold">{statsTotalCount > 0 ? Math.round((statsCancelledCount / statsTotalCount) * 100) : 0}%</span>
              </div>

            </div>

            {/* Custom Multi-colored Stacked Progress Bar */}
            <div className="bg-gradient-to-br from-white to-cream-50/30 border border-gold-400/10 p-5 rounded-2xl shadow-sm space-y-5 font-sans relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"></div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400/20 to-gold-600/10 flex items-center justify-center border border-gold-400/20">
                    <BarChart3 className="w-4 h-4 text-gold-600" />
                  </div>
                  <div>
                    <span className="text-xs font-extrabold text-warm-800 block">التوزيع الإحصائي للحجوزات</span>
                    <span className="text-[9px] text-neutral-450">نسب وتوزيع الحالات التشغيلية</span>
                  </div>
                </div>
                <span className="text-[9px] bg-cream-100 text-neutral-500 px-2.5 py-1 rounded-full font-bold">تلقائي</span>
              </div>
              
              {statsTotalCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-neutral-300" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-neutral-400">لا توجد بيانات إحصائية</p>
                    <p className="text-[9px] text-neutral-350 mt-0.5">تظهر البيانات هنا فور تسجيل الحجوزات</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* The bar track */}
                  <div className="h-5 w-full rounded-full overflow-hidden flex shadow-inner bg-neutral-100/50 ring-1 ring-neutral-200/30">
                    {statsPendingCount > 0 && (
                      <div 
                        style={{ width: `${(statsPendingCount / statsTotalCount) * 100}%`, minWidth: statsPendingCount > 0 ? '4px' : '0' }} 
                        className="bg-gradient-to-r from-amber-400 to-amber-500 hover:brightness-110 transition-all relative group cursor-pointer"
                        title={`بالإنتظار: ${statsPendingCount}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(statsPendingCount / statsTotalCount * 100)}%
                        </span>
                      </div>
                    )}
                    {statsPreparingCount > 0 && (
                      <div 
                        style={{ width: `${(statsPreparingCount / statsTotalCount) * 100}%`, minWidth: statsPreparingCount > 0 ? '4px' : '0' }} 
                        className="bg-gradient-to-r from-blue-400 to-blue-500 hover:brightness-110 transition-all relative group cursor-pointer"
                        title={`تم التجهيز: ${statsPreparingCount}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(statsPreparingCount / statsTotalCount * 100)}%
                        </span>
                      </div>
                    )}
                    {statsShippedCount > 0 && (
                      <div 
                        style={{ width: `${(statsShippedCount / statsTotalCount) * 100}%`, minWidth: statsShippedCount > 0 ? '4px' : '0' }} 
                        className="bg-gradient-to-r from-indigo-400 to-indigo-500 hover:brightness-110 transition-all relative group cursor-pointer"
                        title={`تم الشحن: ${statsShippedCount}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(statsShippedCount / statsTotalCount * 100)}%
                        </span>
                      </div>
                    )}
                    {statsDeliveredCount > 0 && (
                      <div 
                        style={{ width: `${(statsDeliveredCount / statsTotalCount) * 100}%`, minWidth: statsDeliveredCount > 0 ? '4px' : '0' }} 
                        className="bg-gradient-to-r from-green-400 to-green-500 hover:brightness-110 transition-all relative group cursor-pointer"
                        title={`تم التسليم: ${statsDeliveredCount}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(statsDeliveredCount / statsTotalCount * 100)}%
                        </span>
                      </div>
                    )}
                    {statsCancelledCount > 0 && (
                      <div 
                        style={{ width: `${(statsCancelledCount / statsTotalCount) * 100}%`, minWidth: statsCancelledCount > 0 ? '4px' : '0' }} 
                        className="bg-gradient-to-r from-gray-400 to-gray-500 hover:brightness-110 transition-all relative group cursor-pointer"
                        title={`ملغي: ${statsCancelledCount}`}
                      >
                        <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {Math.round(statsCancelledCount / statsTotalCount * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Legend labels */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                    {statsPendingCount > 0 && (
                      <div className="bg-amber-50/60 border border-amber-200/40 rounded-xl p-2.5 text-center hover:border-amber-300/60 transition-all">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500"></div>
                        </div>
                        <p className="text-[10px] font-black text-amber-800">بالإنتظار</p>
                        <p className="text-xs font-black text-amber-600 mt-0.5">{statsPendingCount}</p>
                        <p className="text-[8px] text-amber-500/70 font-bold">{Math.round(statsPendingCount / statsTotalCount * 100)}%</p>
                      </div>
                    )}
                    {statsPreparingCount > 0 && (
                      <div className="bg-blue-50/60 border border-blue-200/40 rounded-xl p-2.5 text-center hover:border-blue-300/60 transition-all">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500"></div>
                        </div>
                        <p className="text-[10px] font-black text-blue-800">تم التجهيز</p>
                        <p className="text-xs font-black text-blue-600 mt-0.5">{statsPreparingCount}</p>
                        <p className="text-[8px] text-blue-500/70 font-bold">{Math.round(statsPreparingCount / statsTotalCount * 100)}%</p>
                      </div>
                    )}
                    {statsShippedCount > 0 && (
                      <div className="bg-indigo-50/60 border border-indigo-200/40 rounded-xl p-2.5 text-center hover:border-indigo-300/60 transition-all">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-500"></div>
                        </div>
                        <p className="text-[10px] font-black text-indigo-800">تم الشحن</p>
                        <p className="text-xs font-black text-indigo-600 mt-0.5">{statsShippedCount}</p>
                        <p className="text-[8px] text-indigo-500/70 font-bold">{Math.round(statsShippedCount / statsTotalCount * 100)}%</p>
                      </div>
                    )}
                    {statsDeliveredCount > 0 && (
                      <div className="bg-green-50/60 border border-green-200/40 rounded-xl p-2.5 text-center hover:border-green-300/60 transition-all">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-green-400 to-green-500"></div>
                        </div>
                        <p className="text-[10px] font-black text-green-800">تم التسليم</p>
                        <p className="text-xs font-black text-green-600 mt-0.5">{statsDeliveredCount}</p>
                        <p className="text-[8px] text-green-500/70 font-bold">{Math.round(statsDeliveredCount / statsTotalCount * 100)}%</p>
                      </div>
                    )}
                    {statsCancelledCount > 0 && (
                      <div className="bg-gray-50/60 border border-gray-200/40 rounded-xl p-2.5 text-center hover:border-gray-300/60 transition-all">
                        <div className="flex items-center justify-center gap-1.5 mb-1">
                          <div className="w-6 h-1.5 rounded-full bg-gradient-to-r from-gray-400 to-gray-500"></div>
                        </div>
                        <p className="text-[10px] font-black text-gray-700">ملغي</p>
                        <p className="text-xs font-black text-gray-600 mt-0.5">{statsCancelledCount}</p>
                        <p className="text-[8px] text-gray-500/70 font-bold">{Math.round(statsCancelledCount / statsTotalCount * 100)}%</p>
                      </div>
                    )}
                  </div>

                  {/* Total footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-dashed border-neutral-200/60">
                    <span className="text-[9px] text-neutral-400 font-bold">إجمالي الحجوزات</span>
                    <span className="text-xs font-black text-warm-700">{statsTotalCount} حجز</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Section 3: Advanced Workspace Filtering and Search Options */}
          <div className="bg-white border border-neutral-200/65 rounded-2xl p-5 shadow-sm space-y-4 font-sans text-right">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-warm-800 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-gold-500" />
                  <span>لوحة فرز وتصفية الحجوزات والطرود الحالية</span>
                </h4>
                <p className="text-[10px] text-neutral-450">ابحثي فوراً بالاسم، كود الطلب، رقم الهاتف، أو تفاصيل الروتين</p>
              </div>

              {savedOrders.length > 0 && (
                <button 
                  onClick={() => {
                    if (confirm("هل ترغبين بالتأكيد في حذف ومسح قاعدة البيانات وسجلات الطلبيات نهائياً؟")) {
                      setSavedOrders([]);
                      localStorage.removeItem('dr_tagy_orders');
                    }
                  }}
                  className="text-red-650 hover:text-white hover:bg-red-600 bg-red-50 text-xs px-4 py-2 rounded-xl transition-all border border-red-200 cursor-pointer text-center font-bold"
                >
                  حذف كافة السجلات شطب 🗑️
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3" id="admin-filters-controls">
              
              {/* Search input field */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-neutral-400 absolute top-3.5 right-3.5" />
                <input 
                  type="text"
                  placeholder="البحث بالاسم الكلي، الهاتف، الولاية، كود الحجز (مثلاً: DT-...)"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full pr-10 pl-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 focus:bg-white focus:ring-1 focus:ring-gold-500 focus:border-gold-500 text-xs font-medium focus:outline-none text-right"
                  dir="rtl"
                />
                {adminSearch && (
                  <button onClick={() => setAdminSearch('')} className="absolute top-3 left-3 text-neutral-400 hover:text-black">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Dropdown status Filter */}
              <div className="md:col-span-3">
                <select
                  value={adminStatusFilter}
                  onChange={(e) => setAdminStatusFilter(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 focus:bg-white text-xs font-extrabold focus:ring-1 focus:ring-gold-500 focus:outline-none"
                >
                  <option value="all">كل الحالات التشغيلية (All)</option>
                  <option value="pending">⏳ بالإنتظار</option>
                  <option value="preparing">📦 تم التجهيز</option>
                  <option value="shipped">🚚 تم الشحن</option>
                  <option value="delivered">✅ تم التسليم</option>
                  <option value="cancelled">❌ ملغي</option>
                </select>
              </div>

              {/* Dropdown Sorting */}
              <div className="md:col-span-3">
                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 focus:bg-white text-xs font-extrabold focus:ring-1 focus:ring-gold-500 focus:outline-none"
                >
                  <option value="newest">الترتيب من الأحدث للأقدم 📅</option>
                  <option value="oldest">الترتيب من الأقدم للأحدث ⏳</option>
                  <option value="highest_value">الأعلى قيمة مالية لفاتورة الزبون 💰</option>
                  <option value="lowest_value">الأقل قيمة مالية للفاتورة 📉</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 4: Live Orders Table/Grid */}
          <div className="space-y-4 text-right" dir="rtl">
            <h3 className="text-base font-extrabold text-warm-800 flex items-center gap-1.5 border-r-4 border-[#aa843f] pr-3">
              <span>سجلات الطرود المكتوبة والنشطة</span>
              <span className="text-xs text-neutral-400 font-bold font-sans">
                (يظهر {getFilteredAndSortedOrders().length} من إجمالي {statsTotalCount} حجوزات)
              </span>
            </h3>

            {getFilteredAndSortedOrders().length === 0 ? (
              <div className="bg-white border border-neutral-200 rounded-2xl p-16 text-center space-y-4 shadow-sm" id="empty-results">
                <ShoppingBag className="w-14 h-14 text-neutral-200 mx-auto" id="empty-bag-icon" />
                <div className="space-y-1">
                  <p className="text-sm font-black text-neutral-500">لا يوجد أي حجوزات تطابق خيارات الفرز والتصفيات!</p>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed font-light">
                    تأكدي من صحة مدخلات البحث أو انقري على "شحن طلبات تجريبية" أعلاه لتوليد عينات اختبار متكاملة في الحال.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="admin-orders-grid">
                {getFilteredAndSortedOrders().map((ord) => {
                  const isEditing = editingOrderId === ord.id;

                  if (isEditing) {
                    return (
                      <div key={ord.id} className="bg-gradient-to-br from-white to-gold-50/10 border-2 border-gold-400 p-6 rounded-2xl space-y-4 shadow-lg animate-scale" id={`editing-order-${ord.id}`}>
                        <div className="flex justify-between items-center border-b border-gold-200/30 pb-3">
                          <span className="font-mono font-black text-warm-800 text-xs">تعديل معلومات الحجز: {ord.id}</span>
                          <button onClick={() => setEditingOrderId(null)} className="text-neutral-400 hover:text-red-500 cursor-pointer">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-3 font-sans text-xs">
                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">الاسم الكامل للزبونة:</label>
                            <input 
                              type="text" 
                              value={editFullName} 
                              onChange={e => setEditFullName(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-xs font-semibold text-right"
                            />
                          </div>
                          
                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">رقم جوال المستلمة:</label>
                            <input 
                              type="text" 
                              value={editPhone} 
                              onChange={e => setEditPhone(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-xs font-mono font-bold text-left"
                              dir="ltr"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">الولاية التركية:</label>
                              <input 
                                type="text" 
                                value={editCity} 
                                onChange={e => setEditCity(e.target.value)} 
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-xs font-semibold text-right"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">العنوان بالتفصيل:</label>
                              <input 
                                type="text" 
                                value={editAddress} 
                                onChange={e => setEditAddress(e.target.value)} 
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-xs font-semibold text-right"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">البكج أو الروتين المختار:</label>
                            <input 
                              type="text" 
                              value={editProductName} 
                              onChange={e => setEditProductName(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white text-xs font-semibold text-right"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">الكمية:</label>
                              <input 
                                type="number" 
                                value={editQuantity} 
                                onChange={e => setEditQuantity(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white font-mono font-black text-xs text-center"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">المبلغ المطلوب TL:</label>
                              <input 
                                type="number" 
                                value={editTotalPrice} 
                                onChange={e => setEditTotalPrice(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-white font-mono font-black text-xs text-center text-gold-650"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-neutral-100 justify-end">
                          <button 
                            type="button"
                            onClick={() => setEditingOrderId(null)} 
                            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold rounded-xl transition-all cursor-pointer text-xs"
                          >
                            رجوع
                          </button>
                          <button 
                            type="button"
                            onClick={() => saveEditedOrder(ord.id)} 
                            className="px-5 py-2 bg-warm-800 hover:bg-gold-600 hover:text-white text-white font-black rounded-xl transition-all cursor-pointer shadow hover:scale-[1.01] text-xs"
                          >
                            حفظ 💾
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Styles & Status Translation mapping
                  let statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
                  let statusLabel = 'بالإنتظار ⏳';
                  if (ord.status === 'pending' || !ord.status) {
                    statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
                    statusLabel = 'بالإنتظار ⏳';
                  } else if (ord.status === 'preparing') {
                    statusBg = 'bg-blue-50 text-blue-700 border-blue-200';
                    statusLabel = 'تم التجهيز 📦';
                  } else if (ord.status === 'shipped') {
                    statusBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                    statusLabel = 'تم الشحن 🚚';
                  } else if (ord.status === 'delivered') {
                    statusBg = 'bg-green-50 text-green-700 border-green-200';
                    statusLabel = 'تم التسليم ✅';
                  } else if (ord.status === 'cancelled') {
                    statusBg = 'bg-gray-100 text-gray-600 border-gray-300';
                    statusLabel = 'ملغي ❌';
                  }

                  // Determine glow element for highlighting pending orders
                  const isNewOrder = ord.status === 'pending' || !ord.status;

                  return (
                    <div 
                      key={ord.id} 
                      className={`bg-white border rounded-2xl p-6 relative group transition-all duration-300 hover:shadow-md flex flex-col justify-between space-y-4 text-right ${
                        isNewOrder ? 'border-red-400 ring-2 ring-red-400/10 shadow-sm' : 'border-neutral-200/80 shadow-xs'
                      }`}
                      id={`order-card-${ord.id}`}
                      dir="rtl"
                    >
                      {/* Delete absolute button */}
                      <button
                        onClick={(e) => {
                          if (confirm('هل ترغبين بالتأكيد في تخطي وشطب هذا الحجز من المستودع نهائياً؟')) {
                            deleteOrder(ord.id, e);
                          }
                        }}
                        className="absolute top-4 left-4 text-neutral-300 hover:text-red-650 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        title="حذف هذا الحجز"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Top Code / Date */}
                      <div>
                        <div className="flex justify-between items-center border-b border-dashed border-neutral-100 pb-3">
                          <div className="flex items-center gap-1.5 bg-neutral-0">
                            {isNewOrder ? (
                              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                            ) : (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#aa843f]"></span>
                            )}
                            <span className="text-[#aa843f] font-mono font-black text-xs">{ord.id}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-bold">{ord.createdAt}</span>
                        </div>

                        {/* Customer Info Card */}
                        <div className="mt-4 bg-cream-100/40 p-4 rounded-xl border border-gold-400/10 space-y-2 font-sans text-xs text-right" dir="rtl">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">اسم العميل الكلي:</span>
                            <span className="font-bold text-neutral-850">{ord.fullName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">جوال المستلمة:</span>
                            <span className="font-mono font-bold text-neutral-850 text-left" dir="ltr">{ord.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">الولاية التركية:</span>
                            <span className="font-bold text-warm-800">{ord.city}</span>
                          </div>
                          <div className="pt-1 border-t border-neutral-100">
                            <span className="text-[10px] text-neutral-400 block mb-0.5">العنوان بالتفصيل:</span>
                            <span className="text-neutral-700 font-light leading-relaxed block overflow-hidden text-ellipsis line-clamp-2 text-right" title={ord.address}>
                              {ord.address}
                            </span>
                          </div>
                        </div>

                        {/* Order Purchase details */}
                        <div className="mt-4 bg-neutral-50 p-3.5 rounded-xl border border-neutral-200/50 space-y-1.5 font-sans text-xs text-right">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">البكج المطلوب:</span>
                            <span className="font-extrabold text-warm-800 max-w-[130px] truncate text-left" title={ord.selectedProductName}>
                              {ord.selectedProductName}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">الكمية المسجلة:</span>
                            <span className="font-black text-warm-800">{ord.quantity || 1} طرد</span>
                          </div>
                          <div className="flex justify-between items-center border-t border-dashed border-neutral-200 pt-2 mt-2">
                            <span className="font-extrabold text-[#111] text-[11px]">الدفع عند الاستلام لماتلقاه:</span>
                            <span className="font-black text-gold-700 text-sm font-mono">{ord.totalPrice} TL</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom action zone */}
                      <div className="space-y-3.5 pt-3 border-t border-neutral-100">
                        {/* Static indicator */}
                        <div className={`flex justify-center items-center py-2 px-3 rounded-xl border text-[11px] font-bold ${statusBg}`}>
                          <span>الوضعية: {statusLabel}</span>
                        </div>

                        {/* Interactive status selectors */}
                        <div className="space-y-2">
                          <span className="text-[10px] text-neutral-500 block font-black">تحيين رتبة وحالة حجز الطرد:</span>
                          <div className="grid grid-cols-5 gap-1">
                            {(['pending', 'preparing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => {
                              let label = '';
                              let buttonStyles = '';
                              if (st === 'pending') { label = 'انتظار'; buttonStyles = 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'; }
                              if (st === 'preparing') { label = 'تجهيز'; buttonStyles = 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'; }
                              if (st === 'shipped') { label = 'شحن'; buttonStyles = 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'; }
                              if (st === 'delivered') { label = 'تسليم'; buttonStyles = 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'; }
                              if (st === 'cancelled') { label = 'إلغاء'; buttonStyles = 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'; }

                              const isCurrent = (ord.status || 'pending') === st;
                              const currentSelected = isCurrent
                                ? st === 'pending'
                                  ? 'bg-amber-500 border-amber-600 text-white font-black scale-[1.02]'
                                  : st === 'preparing'
                                    ? 'bg-blue-600 border-blue-700 text-white font-black scale-[1.02]'
                                    : st === 'shipped'
                                      ? 'bg-indigo-600 border-indigo-700 text-white font-black scale-[1.02]'
                                      : st === 'delivered'
                                        ? 'bg-green-600 border-green-700 text-white font-black scale-[1.02]'
                                        : 'bg-gray-650 border-gray-700 text-white font-black scale-[1.02]'
                                : buttonStyles;

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, st)}
                                  className={`text-[10px] py-1.5 px-1 rounded-lg text-center font-bold transition-all cursor-pointer ${currentSelected}`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Customer interactive actions */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => startEditingOrder(ord)}
                            className="bg-neutral-100 hover:bg-neutral-200 text-[#011] border border-neutral-300 rounded-xl py-2.5 font-bold transition-all text-xs flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5 text-neutral-600" />
                            <span>تعديل</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => contactCustomerWhatsApp(ord)}
                            className="bg-warm-800 hover:bg-warm-700 text-gold-300 font-black py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer border border-gold-500/20"
                          >
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 317.4 319.92" fill="currentColor">
                                <path d="M271.56,47.06c-61.69-62.3-162.2-62.8-224.5-1.11C-1.98,94.5-14.03,169.19,17.25,230.71L.41,312.48c-.35,1.65,0,3.36.96,4.74,1.43,2.12,4.03,3.13,6.52,2.53l80.15-19c78.5,39.02,173.76,7.01,212.78-71.49,30.19-60.75,18.44-133.97-29.24-182.22h0ZM246.57,246.5c-37.79,37.68-95.41,47.05-143.19,23.27l-11.17-5.53-49.13,11.64.15-.61,10.18-49.45-5.47-10.79c-24.42-47.96-15.19-106.2,22.87-144.26,48.54-48.53,127.23-48.53,175.77,0,.2.23.41.44.64.64,47.92,48.63,47.64,126.82-.64,175.1Z"/>
                                <path d="M242.21,210.23c-6.02,9.48-15.53,21.09-27.49,23.97-20.95,5.06-53.09.17-93.09-37.12l-.49-.44c-35.17-32.61-44.31-59.75-42.09-81.28,1.22-12.22,11.4-23.27,19.99-30.49,4.8-4.1,12.02-3.53,16.12,1.27.73.85,1.32,1.8,1.77,2.83l12.95,29.09c1.71,3.84,1.17,8.32-1.43,11.64l-6.55,8.49c-2.87,3.59-3.28,8.56-1.02,12.57,3.67,6.43,12.45,15.88,22.2,24.64,10.94,9.89,23.07,18.94,30.75,22.02,4.2,1.72,9.03.7,12.19-2.56l7.59-7.65c2.98-2.94,7.32-4.05,11.35-2.91l30.75,8.73c6.14,1.88,9.6,8.39,7.71,14.54-.29.93-.69,1.82-1.2,2.66h0Z"/>
                              </svg>
                              واتساب
                            </span>
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#1D1B19] selection:bg-gold-200 selection:text-gold-900 overflow-x-hidden font-sans relative" dir="rtl">
      
      {/* 1. TOP SPECIAL BANNER SLIDESHOW TICKER (Luxury Ribbon) */}
      <div className="bg-cream-200 text-warm-800 py-3.5 px-6 text-xs md:text-sm font-medium border-b border-gold-300/30 shadow-lg relative z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-center">
          <Sparkles className="w-4 h-4 text-gold-600 shrink-0 animate-pulse" />
          <span className="font-extrabold text-gold-600 text-xs md:text-sm tracking-wide leading-relaxed">
             احصلي على واقي الشمس الطبي مجاناً بالكامل 
          </span>
        </div>
      </div>

      {/* 3. HERO & BEAUTY GOAL SELECTOR SECTION */}
      <section className="relative py-6 lg:py-28 px-6 md:px-12 lg:px-24 overflow-hidden h-[calc(100vh-53px)] lg:h-auto lg:min-h-[90vh] flex items-center bg-cream-50 isolate">
        {/* Aesthetic Background Video Loop */}
        <HeroVideoBackground />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 w-full">
          
          {/* Right Column: Catchy luxury typography and offer details */}
          <div className="lg:col-span-7 space-y-6 lg:space-y-8 text-center lg:text-right relative z-10">
            


            {/* Main title */}
            <h1 className="text-1xl md:text-5xl lg:text-6xl font-black text-warm-800 tracking-tight leading-[1.25]">
              تألقي ببشرة نضرة ومثالية خلال 15 يوماً <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-700 via-gold-500 to-gold-700 font-sans  text-3xl md:text-4xl lg:text-5xl font-light block mt-2 ">الروتين الفاخر <br /> لتجديد حيوية وصحة بشرتك</span>
            </h1>

            {/* Sub description */}
            <p className="text-sm md:text-lg text-warm-500 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light mb-[200px]">
              مجموعة متكاملة من المنتجات الطبيعية تعمل بتناغم لتمنحك تألقاً غير مسبوق
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3 relative z-20">
              <button
                onClick={scrollToCheckout}
                className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-white border border-gold-400 font-bold px-6.5 py-4.5 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 hover:shadow-lg shadow-md cursor-pointer"
                id="hero-cta-btn"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
                <span>ابدئي روتينكِ العلاجي الآن</span>
              </button>
              <a
                href="#clinical-quiz"
                className="w-full sm:w-auto bg-warm-800 hover:bg-warm-700 text-white border border-warm-300/30 font-bold px-6.5 py-4.5 rounded-xl text-xs transition-colors text-center flex items-center justify-center gap-2 hover:shadow-md"
                id="hero-secondary-btn"
              >
                <span>اكتشفي روتينكِ عبر المستشار الذكي</span>
                <ArrowRight className="w-4 h-4 rotate-180 text-gold-600" />
              </a>
            </div>

            {/* Elegant timer countdown framed in fine golden borders */}
            <div className="card-elegant text-warm-800 p-5.5 rounded-3xl shadow-2xl max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden group border border-gold-300/30">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-300/10 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="text-center sm:text-right relative z-10">
                <span className="text-[10px] text-gold-600 font-extrabold uppercase tracking-widest block">عرض حصري ينتهي قريباً</span>
                <span className="text-xs md:text-sm font-bold text-warm-800 block mt-1">المتبقي على انتهاء الهدايا المجانية والشحن المجاني:</span>
              </div>
              <div className="flex gap-3 text-center font-mono relative z-10">
                <div className="bg-cream-100/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-gold-300/30 min-w-[62px]">
                  <span className="block text-xl font-bold text-gold-600">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] text-neutral-300 block mt-0.5 font-sans">ثانية</span>
                </div>
                <div className="bg-cream-100/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-gold-300/30 min-w-[62px]">
                  <span className="block text-xl font-bold text-gold-600">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] text-neutral-300 block mt-0.5 font-sans">دقيقة</span>
                </div>
                <div className="bg-cream-100/50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-gold-300/30 min-w-[62px]">
                  <span className="block text-xl font-bold text-gold-600">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] text-neutral-300 block mt-0.5 font-sans">ساعة</span>
                </div>
              </div>
            </div>

          </div>

          {/* Left Column: Glassmorphic interactive visual card displaying the bundle stack */}
          <div className="lg:col-span-5 relative hidden lg:flex items-center justify-center lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-100/10 via-gold-200/5 to-transparent rounded-full filter blur-[80px]"></div>
            {renderTestimonialsCard()}
          </div>

        </div>
      </section>

      {/* Testimonials section below hero for mobile/tablet only */}
      <section className="block lg:hidden py-12 px-6 bg-cream-50 border-b border-gold-300/20">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-wider block">تجربة فريدة وموثقة</span>
            <h2 className="text-xl font-black text-warm-800">آراء وتجارب عملائنا </h2>
            <div className="w-12 h-1 bg-gold-400 mx-auto rounded-full"></div>
          </div>
          {renderTestimonialsCard()}
        </div>
      </section>

      {/* 4. WHY US — Medical Integrity Signals (تصميم فخم منظم) */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-[#FAFAF6] via-white to-[#FAF6EF] px-6 md:px-12 lg:px-24 relative overflow-hidden" id="why-us">
        {/* زخارف خلفية */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-gold-200/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-100/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-gold-300/20 to-transparent"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          
          {/* --- Header --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16 md:mb-20 space-y-4"
          >
            <span className="inline-flex items-center gap-2 bg-gold-100/50 border border-gold-400/20 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-gold-700 tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              الابتكار العلمي المتطور
            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black text-warm-800 leading-tight">
              لماذا تثقين في تركيبة<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold-700 to-gold-500 font-sans text-3xl md:text-4xl lg:text-5xl font-light">دكتور تاجي؟</span>
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="h-px w-12 bg-gradient-to-l from-gold-400/60 to-transparent"></div>
              <div className="w-2 h-2 rotate-45 bg-gold-400"></div>
              <div className="h-px w-12 bg-gradient-to-r from-gold-400/60 to-transparent"></div>
            </div>
          </motion.div>

          {/* --- المحتوى: Layout بعمودين --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            {/* العمود الأيسر: ختم الجودة + النقاط */}
            <div className="lg:col-span-5 relative">
              {/* عنصر زخرفي مركزي */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative mx-auto w-64 h-64 md:w-72 md:h-72"
              >
                {/* دوائر متحدة المركز */}
                <div className="absolute inset-0 rounded-full border border-gold-300/20 animate-spin-slow"></div>
                <div className="absolute inset-4 rounded-full border border-dashed border-gold-400/15 animate-spin-very-slow"></div>
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-gold-100/30 to-transparent backdrop-blur-sm border border-gold-400/20 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/20 mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-xs font-black text-gold-700">معتمد طبياً</span>
                  <span className="text-[9px] text-gold-500/60 font-medium">Dr. Tagy Certified</span>
                </div>
              </motion.div>

              {/* عناصر عائمة حول الدائرة */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute top-8 -right-4 bg-white/90 backdrop-blur-sm border border-gold-300/30 rounded-xl px-3.5 py-2 shadow-lg"
              >
                <span className="text-[10px] text-gold-700 font-bold whitespace-nowrap">معايير EU 🇪🇺</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-3 left-2 sm:left-4 z-20 bg-white/95 backdrop-blur-sm border border-gold-300/30 rounded-xl px-3.5 py-2 shadow-lg"
              >
                <span className="text-[10px] text-green-700 font-bold whitespace-nowrap">خالٍ من المواد الضارة ✦</span>
              </motion.div>
              <img src={fourProductsImg} alt="dr.tagy products" className="w-full h-auto object-contain -mt-10 sm:-mt-12 md:-mt-14" style={{ margin: '-50px 0px' }} />
            </div>

            {/* العمود الأيمن: النقاط الأربعة بشكل عمودي أنيق */}
            <div className="lg:col-span-7 space-y-5" dir="rtl">
              {[
                {
                  num: '01',
                  icon: Award,
                  title: 'اعتماد طبي ومخبري',
                  desc: 'مستحضرات مسجلة رسمياً وخاضعة لأدق الفحوصات الطبية لمطابقة المعايير الأوروبية والدولية.',
                  color: 'from-amber-500 to-gold-600',
                  bgLight: 'bg-amber-50',
                  border: 'border-amber-200/40',
                },
                {
                  num: '02',
                  icon: ShieldCheck,
                  title: 'تركيبة فائقة الأمان',
                  desc: 'خالية تماماً من البارابين، السيليكون، والمواد البترولية والمحسّسات. لطيفة وآمنة كلياً على البشرة الحساسة ومنطقة محيط العين.',
                  color: 'from-emerald-500 to-green-600',
                  bgLight: 'bg-emerald-50',
                  border: 'border-emerald-200/40',
                },
                {
                  num: '03',
                  icon: Droplets,
                  title: 'خلاصات طبيعية نشطة',
                  desc: 'تعتمد على قوة الطبيعة عبر دمج مستخلصات الطحالب البحرية، جذور السيكا، والبابونج النقي لتهدئة وترميم حاجز البشرة.',
                  color: 'from-sky-500 to-blue-600',
                  bgLight: 'bg-sky-50',
                  border: 'border-sky-200/40',
                },
                {
                  num: '04',
                  icon: Activity,
                  title: 'نتائج سريرية مثبتة',
                  desc: 'تأثير ملحوظ في شد البشرة، ملء الخطوط التعبيرية، وتعزيز كثافة الرموش خلال 14 إلى 21 يوماً من الاستخدام المنتظم.',
                  color: 'from-violet-500 to-purple-600',
                  bgLight: 'bg-violet-50',
                  border: 'border-violet-200/40',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className={`group relative flex items-start gap-4 md:gap-6 p-5 md:p-6 rounded-2xl bg-white border ${item.border} hover:shadow-lg hover:shadow-black/[0.02] transition-all duration-300 hover:-translate-y-0.5`}
                >
                  {/* خط عمودي جانبي */}
                  <div className={`absolute right-0 top-4 bottom-4 w-1 rounded-full bg-gradient-to-b ${item.color} opacity-40 group-hover:opacity-100 transition-opacity`}></div>

                  {/* الرقم */}
                  <div className="hidden md:block shrink-0 w-10 text-center">
                    <span className="text-xs font-black text-gold-400/40 font-mono">{item.num}</span>
                  </div>

                  {/* الأيقونة */}
                  <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${item.color} bg-opacity-10 flex items-center justify-center shadow-sm`}
                    style={{ backgroundImage: `linear-gradient(to bottom right, ${item.color.split(' ')[0].replace('from-', '')}, ${item.color.split(' ')[1].replace('to-', '')})` }}
                  >
                    <item.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>

                  {/* النص */}
                  <div className="flex-1 min-w-0 pt-0.5 text-right">
                    <h3 className="text-sm md:text-base font-black text-warm-800 mb-1.5 flex items-center gap-2">
                      {item.title}
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${item.color}`}></span>
                    </h3>
                    <p className="text-[11px] md:text-xs text-[#6A645D] leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>

                  {/* سهم */}
                  <div className="shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronLeft className="w-4 h-4 text-gold-400" />
                  </div>
                </motion.div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE SKIN ANALYSIS CLINIC QUIZ (مستشار العناية الذكي الفاخر) */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-[#FCFBF8] to-[#FAF6EF]" id="clinical-quiz">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white/80 backdrop-blur-xl border border-gold-300/30 p-8 md:p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-tr from-gold-100 to-transparent rounded-br-[100%]"></div>
            
            <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-[11px] text-[#aa843f] font-bold tracking-widest uppercase">
                <Sparkle className="w-3.5 h-3.5" />
                <span>الاستشارة الرقمية الفورية</span>
              </div>
              <h3 className="text-xl md:text-3xl font-black text-warm-800">مستشار دكتور تاجي الذكي</h3>
            </div>

            {/* Quiz Progress step indicator bar */}
            <div className="flex items-center justify-center gap-2 mb-8 max-w-xs mx-auto text-xs">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${quizStep >= 1 ? 'bg-gold-500 text-white' : 'bg-cream-100 text-warm-300'}`}>1</span>
              <span className={`w-12 h-0.5 ${quizStep >= 2 ? 'bg-gold-400' : 'bg-cream-200'}`}></span>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${quizStep >= 2 ? 'bg-gold-500 text-white' : 'bg-cream-100 text-warm-300'}`}>2</span>
              <span className={`w-12 h-0.5 ${quizStep >= 3 ? 'bg-gold-400' : 'bg-cream-200'}`}></span>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${quizStep >= 3 ? 'bg-gold-500 text-white' : 'bg-cream-100 text-warm-300'}`}>3</span>
            </div>

            <AnimatePresence mode="wait">
              {quizStep === 1 && (
                <motion.div 
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <h4 className="text-sm md:text-base font-bold text-warm-800">ما هو طبيعة ملمس وطبيعة بشرتك الحالية؟</h4>
                  <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                    {[
                      { key: 'oily', title: 'دهنية أو مختلطة (لمعان وبثور)', desc: 'تحتاج إلى موازنة الإفرازات وتنقية عميقة.' },
                      { key: 'dry', title: 'جافة أو خشنة (قشور ومظهر باهت)', desc: 'تحتاج إلى ترطيب مكثف ودعم كولاجيني.' },
                      { key: 'normal', title: 'عادية ومتوازنة', desc: 'تحتاج إلى حماية يومية وتجديد مستمر.' },
                      { key: 'sensitive', title: 'حساسة جداً وسريعة التهيج', desc: 'تحتاج إلى ترميم وتهدئة بمستخلص السنتتلا.' }
                    ].map(type => (
                      <button
                        key={type.key}
                        type="button"
                        onClick={() => {
                          setQuizSkinType(type.title);
                          setQuizStep(2);
                        }}
                        className="p-4.5 rounded-2xl border border-gold-300/20 hover:border-gold-500 bg-[#FCFBF8] hover:bg-gold-50/25 text-right transition-all transition-transform active:scale-95 cursor-pointer"
                      >
                        <span className="block text-xs md:text-sm font-bold text-warm-800">{type.title}</span>
                        <span className="block text-[10px] text-gray-500 font-light mt-0.5">{type.desc}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {quizStep === 2 && (
                <motion.div 
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6 text-center"
                >
                  <h4 className="text-sm md:text-base font-bold text-warm-800">ما هي المعضلة الأهم المطلوب تغييرها الفتر الحالية للوجه؟</h4>
                  <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto">
                    {[
                      { key: 'wrinkle', title: 'التجاعيد، التجاهيد، وخطوط حول الفم والوجه', desc: 'ببتيدات الذهب والكولاجين الثنائي' },
                      { key: 'oil-clens', title: 'المسام الواسعة وإفراز الدهون الزائد', desc: 'غسول الطحالب المنقي لعمق المسام' },
                      { key: 'lash-hair', title: 'ضعف رموش العين وتساقطها المزعج', desc: 'سيروم البيوتين المكثف الطبي' },
                      { key: 'sun-burn', title: 'التصبغات والبقع نتيجة حرارة الشمس', desc: 'حماية SPF50 المبيضة بالوقاية' }
                    ].map(concern => (
                      <button
                        key={concern.key}
                        type="button"
                        onClick={() => {
                          setQuizMainConcern(concern.title);
                          setQuizStep(3);
                        }}
                        className="p-4.5 rounded-2xl border border-gold-300/20 hover:border-gold-500 bg-[#FCFBF8] hover:bg-gold-50/25 text-right transition-all transition-transform active:scale-95 cursor-pointer"
                      >
                        <span className="block text-xs md:text-sm font-bold text-warm-800">{concern.title}</span>
                        <span className="block text-[10px] text-gray-500 font-light mt-0.5">{concern.desc}</span>
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setQuizStep(1)} 
                    className="text-xs font-bold text-gray-400 hover:text-warm-800 underline block bg-none cursor-pointer mt-4"
                  >
                    العودة للخطوة السابقة
                  </button>
                </motion.div>
              )}

              {quizStep === 3 && (
                <motion.div 
                  key="step-3"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="w-16 h-16 bg-gold-200/40 text-gold-600 rounded-full flex items-center justify-center mx-auto border border-gold-400/25 animate-bounce">
                    <Activity className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-base md:text-lg font-black text-warm-800">تم تشخيص وتحليل البشرة بنجاح!</h4>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      بناءً على اختيارك لبشرة <span className="font-bold text-gold-600">({quizSkinType})</span> واهتمامك الرئيسي <span className="font-bold text-gold-600">({quizMainConcern})</span>، نقترح عليك روتينكِ التالي:
                    </p>
                  </div>

                  {/* Diagnosed match recommendation box */}
                  <div className="bg-gradient-to-b from-[#FCFBF8] to-[#FAF6EF] p-5.5 rounded-3xl border border-gold-400/20 max-w-md mx-auto text-right space-y-4 shadow-sm">
                    <div className="flex gap-3 justify-start items-center">
                      <div className="w-10 h-10 rounded-full bg-gold-400/10 text-gold-600 flex items-center justify-center font-bold">✓</div>
                      <div>
                        <span className="text-[10px] text-[#aa843f] font-extrabold uppercase block font-sans">الأكثر فاعلية</span>
                        <span className="text-sm font-bold text-warm-800 block">مجموعة دكتور تاجي المتكاملة</span>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-[#6A645D] leading-relaxed">
                      البكج يبدأ بـ <span className="font-bold text-warm-800">غسول الطحالب</span> للتنظيف العميق وموازنة الإفرازات، ثم تطبيق <span className="font-bold text-warm-800">كريم 6 في 1</span> بببتيدات الذهب لشد وتجديد البشرة، يليه <span className="font-bold text-warm-800">سيروم الرموش المكثف</span>، وأخيراً <span className="font-bold text-red-600">واقي الشمس المهدي لكِ مجاناً</span> كجزء مدمج من باقة التوفير.
                    </p>

                    <div className="flex items-center justify-between border-t border-gold-400/15 pt-3.5 mt-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block line-through">2700 TL</span>
                        <span className="text-lg font-bold text-warm-800">2050 TL</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          selectRecommendation(true);
                          setQuizStep(1);
                        }}
                        className="bg-warm-800 hover:bg-gold-500 text-white hover:text-warm-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                        id="recommended-quiz-match-btn"
                      >
                        أضيفي الروتين للصندوق
                      </button>
                    </div>

                    <div className="pt-3 border-t border-dashed border-gold-300/20 text-center text-[11px] text-warm-500">
                      أو تفضلي بطلب استشارة طبية مخصصة بحالتكِ:
                      <a 
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=أهلاً دكتور تاجي، قمت بتشخيص بشرتي عبر المستشار الذكي ونتيجتي هي بشرة (${quizSkinType}) واهتمامي هو (${quizMainConcern})، أود استشارة الأخصائية مجاناً`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gold-700 hover:text-gold-600 font-black flex items-center justify-center gap-1.5 mt-1.5 text-xs bg-gold-50/50 hover:bg-gold-100/50 border border-gold-300/30 hover:border-gold-400/40 rounded-xl px-4 py-2.5 transition-all"
                      >
                        <span className="flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 317.4 319.92" fill="currentColor">
                            <path d="M271.56,47.06c-61.69-62.3-162.2-62.8-224.5-1.11C-1.98,94.5-14.03,169.19,17.25,230.71L.41,312.48c-.35,1.65,0,3.36.96,4.74,1.43,2.12,4.03,3.13,6.52,2.53l80.15-19c78.5,39.02,173.76,7.01,212.78-71.49,30.19-60.75,18.44-133.97-29.24-182.22h0ZM246.57,246.5c-37.79,37.68-95.41,47.05-143.19,23.27l-11.17-5.53-49.13,11.64.15-.61,10.18-49.45-5.47-10.79c-24.42-47.96-15.19-106.2,22.87-144.26,48.54-48.53,127.23-48.53,175.77,0,.2.23.41.44.64.64,47.92,48.63,47.64,126.82-.64,175.1Z"/>
                            <path d="M242.21,210.23c-6.02,9.48-15.53,21.09-27.49,23.97-20.95,5.06-53.09.17-93.09-37.12l-.49-.44c-35.17-32.61-44.31-59.75-42.09-81.28,1.22-12.22,11.4-23.27,19.99-30.49,4.8-4.1,12.02-3.53,16.12,1.27.73.85,1.32,1.8,1.77,2.83l12.95,29.09c1.71,3.84,1.17,8.32-1.43,11.64l-6.55,8.49c-2.87,3.59-3.28,8.56-1.02,12.57,3.67,6.43,12.45,15.88,22.2,24.64,10.94,9.89,23.07,18.94,30.75,22.02,4.2,1.72,9.03.7,12.19-2.56l7.59-7.65c2.98-2.94,7.32-4.05,11.35-2.91l30.75,8.73c6.14,1.88,9.6,8.39,7.71,14.54-.29.93-.69,1.82-1.2,2.66h0Z"/>
                          </svg>
                         استشارة فورية عبر واتساب
                        </span>
                      </a>
                    </div>
                  </div>


                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </section>

      {/* 6. CLINICAL MORNING / EVENING ROUTINE PROTOCOL (بروتوكول الاستخدام الفاخر) */}
      <section className="py-20 px-6 md:px-12 lg:px-24 bg-[#FAFAF6] border-t border-b border-gold-400/10" id="clinical-ritual">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">الروتين العلاجي اليومي</span>
            <h2 className="text-2xl md:text-5xl font-black text-warm-800">كيف تطبقين الروتين بفاعلية؟</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#706B65] font-light">
              للحصول على أقصى نضارة وتصحيح متكامل لعيوب البشرة، نوصي باتباع هذا الروتين الصباحي والمسائي المنسق بعناية:
            </p>
          </div>

          {/* Time protocol switcher buttons */}
          <div className="flex justify-center mb-12">
            <div className="card-elegant border border-gold-300/30 p-1.5 rounded-full flex gap-1 max-w-xs w-full shadow-md z-10">
              <button
                onClick={() => setProtocolTime('morning')}
                className={`flex-1 py-3 text-center rounded-full text-xs font-bold transition-all transition-transform active:scale-95 cursor-pointer ${protocolTime === 'morning' ? 'btn-warm text-white shadow-lg' : 'text-gray-500 hover:text-warm-800'}`}
              >
                🌞 الروتين الصباحي
              </button>
              <button
                onClick={() => setProtocolTime('evening')}
                className={`flex-1 py-3 text-center rounded-full text-xs font-bold transition-all transition-transform active:scale-95 cursor-pointer ${protocolTime === 'evening' ? 'btn-warm text-white shadow-lg' : 'text-gray-500 hover:text-warm-800'}`}
              >
                🌙 الروتين المسائي
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {protocolTime === 'morning' ? (
              <motion.div
                key="morning-protocol"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {/* Morning Step 1 */}
                <div className="card-elegant p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">الخطوة الاولى — 7:00 صباحاً</span>
                    <h3 className="text-base font-bold text-warm-800 mt-1">تطهير المسام بغسول الطحالب</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      دلكي رغوة غسول الطحالب المنقي بلطف لتنشيط الدورة الدموية الدقيقة بالوجه وإيقاظ ملمس البشرة بلانتعاش، ثم اغسلي بالماء الفاتر لتنظيف عميق يزيل شوائب الليل.
                    </p>
                  </div>
                  <span className="inline-block bg-cream-200/50 text-warm-800 text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: صقل المسام والتحييد الدهني
                  </span>
                </div>

                {/* Morning Step 2 */}
                <div className="card-elegant p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">الخطوة الثانيى — 7:05 صباحاً</span>
                    <h3 className="text-base font-bold text-warm-800 mt-1">ترميم نضارة الجلد بكريم 6 في 1</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      بعد تجفيف الوجه، ركزي على دورتين لثوانٍ بتدليك كريم دكتور تاجي الفاخر بحركات دائرية لأعلى. تعمل ببتيدات الذهب والكولاجين على الاحتفاظ بالمكونات النشطة وشد البشرة الفوري لليوم.
                    </p>
                  </div>
                  <span className="inline-block bg-cream-200/50 text-warm-800 text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: شد، مرونة وتغذية جزيئية
                  </span>
                </div>

                {/* Morning Step 3 */}
                <div className="card-elegant p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">الخطوة الثالثة — 7:15 صباحاً</span>
                    <h3 className="text-base font-bold text-warm-800 mt-1">حماية فائقة بواقي شمس SPF50</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      الخطوة الأكثر قدسية صباحاً! ضعي طبقة كافية من واقي الشمس الطبي (الهدية) لتشكيل درع شفاف يمنع ضرر الأشعة فوق البنفسجية UVA/UVB والحرارة من إفساد خلايا وتفتيح الجلد.
                    </p>
                  </div>
                  <span className="inline-block bg-red-50 text-red-600 text-[11px] font-bold px-3 py-1 rounded-full self-start border border-red-200">
                    الهدية المجانية • حماية كمنية متكاملة
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="evening-protocol"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
              >
                {/* Evening Step 1 */}
                <div className="card-elegant p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">الخطوة الاولى — 9:00 مسائاً</span>
                    <h3 className="text-base font-bold text-warm-800 mt-1">إزالة الأتربة والرواسب الجوية بالغسول</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      نظّفي خلايا بشرة من آثار التلوث وغبار اليوم وبواقي واقي الشمس. يعمل حمض الساليسيليك على تفكيك التراكمات داخل بصيلات الخلايا برقة وبدون تجفيف.
                    </p>
                  </div>
                  <span className="inline-block bg-cream-200/50 text-warm-800 text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: تهيئة جزيئية لامتصاص الليل
                  </span>
                </div>

                {/* Evening Step 2 */}
                <div className="card-elegant p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">الخطوة الثانيى — 9:05 مسائاً</span>
                    <h3 className="text-base font-bold text-warm-800 mt-1">تكثيف الرموش بسيروم Eyeluxe</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      بخط قلم دقيق، مرري سيروم تطويل الرموش على جذور رموشك وبصيلات الحاجبين الخاملة. ببتيدات البيوتين المزدوجة تقوم بتسريع تغذية الجذور بشكل مضاعف خلال فترات النوم الإمبراطورية.
                    </p>
                  </div>
                  <span className="inline-block bg-cream-200/50 text-warm-800 text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: تطويل زائد وتكثيف الفراغات طبيعياً
                  </span>
                </div>

                {/* Evening Step 3 */}
                <div className="card-elegant p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">الخطوة الثالثة — 9:15 مسائاً</span>
                    <h3 className="text-base font-bold text-warm-800 mt-1">تطبيق كريم ببتيدات الذهب الليلي</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      تتضاعف وتيرة تجديد الخلايا أثناء النوم. دلكي وجهك بـ كريم 6 في 1 بسخاء ليدخل في تناغم مع هرمونات بناء وتجديد الكولاجين، لتستيقظي ببشرة مشدودة ومروية كالورد صباحاً.
                    </p>
                  </div>
                  <span className="inline-block bg-gold-100 text-gold-800 text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: صقل مائي وإخفاء التجاعيد الدقيقة
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </section>

      {/* 7. PRODUCTS GRID SHOWCASE */}
      <section className="py-20 md:py-28 px-6 md:px-12 lg:px-24 bg-[#FCFBF8]" id="products-showcase">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">المستحضرات الطبية المنفردة</span>
            <h2 className="text-3xl md:text-5xl font-black text-warm-800">الروتين الفردي الراقي</h2>
            <div className="w-20 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#706B65] font-light leading-relaxed">
              استكشفي تفاصيل المكونات الطبية والفعالية العلاجية لكل مستحضر من مكونات دكتور تاجي المصاغة بدقة فائقة.
            </p>
          </div>

          <div className="space-y-16 md:space-y-24 mt-12 text-right" dir="rtl">
            <AnimatePresence mode="popLayout">
              {products
                .filter(p => {
                  if (skincareGoal === 'all') return true;
                  if (skincareGoal === 'anti-aging') return p.id === 'dr-cream-6in1';
                  if (skincareGoal === 'sun-care') return p.id === 'dr-sunscreen';
                  if (skincareGoal === 'lashes') return p.id === 'dr-eyeluxe';
                  if (skincareGoal === 'clense') return p.id === 'dr-cleanser';
                  return true;
                })
                .map((p, index) => {
                  const isEven = index % 2 === 0;
                  return (
                    <motion.div 
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                      className={`flex flex-col lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'} items-center bg-white rounded-[32px] shadow-lg relative overflow-hidden group transition-all duration-500 hover:shadow-xl`}
                      id={`product-row-${p.id}`}
                    >
                      {/* زخارف ذهبية أنيقة */}
                      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none">
                        <div className="absolute top-0 right-0 w-10 h-[1px] bg-gold-400/20"></div>
                        <div className="absolute top-0 right-0 w-[1px] h-10 bg-gold-400/20"></div>
                      </div>
                      <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none">
                        <div className="absolute bottom-0 left-0 w-10 h-[1px] bg-gold-400/20"></div>
                        <div className="absolute bottom-0 left-0 w-[1px] h-10 bg-gold-400/20"></div>
                      </div>

                      {/* 1. IMAGE CONTAINER */}
                      <div className="w-full lg:w-5/12 relative overflow-hidden min-h-[300px] md:min-h-[380px] flex flex-col items-center justify-center bg-white">
                        {/* خلفية متدرجة ذهبية ناعمة جداً */}
                        <div className="absolute inset-0 bg-gradient-to-b from-gold-50/60 to-white"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gold-100/50 blur-3xl pointer-events-none"></div>

                        {p.id === 'dr-sunscreen' && (
                          <div className="absolute top-3 right-3 z-30 bg-gradient-to-l from-warm-800 to-warm-700 text-white text-xs font-black px-4 py-2 rounded-full shadow-2xl border border-gold-400/30">
                            🎁 مجاناً مع البكج
                          </div>
                        )}

                        <motion.img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-contain p-6 md:p-8 scale-100 md:scale-110 relative z-10 drop-shadow-xl"
                          referrerPolicy="no-referrer"
                        />

                        <div className="absolute bottom-4 inset-x-4 flex flex-wrap gap-2 justify-center z-10">
                          <span className="bg-white/90 shadow-sm text-warm-800 text-[10px] font-bold px-3 py-1.5 rounded-full border border-gold-200/40">
                            <Award className="w-3 h-3 text-gold-500 inline mr-1" />
                            معتمد طبياً
                          </span>
                          <span className="bg-cream-200/90 text-warm-800/80 text-[10px] font-bold px-3 py-1.5 rounded-full border border-gold-400/20">
                            {p.size}
                          </span>
                        </div>
                      </div>

                      {/* 2. CONTENT PANEL — أبيض ناصع منظم */}
                      <div className="w-full lg:w-7/12 bg-white p-6 md:p-10 flex flex-col justify-between" dir="rtl">
                        <div className="space-y-5">
                          {/* Header */}
                          <div>
                            <span className="text-[10px] font-bold text-gold-600 tracking-[0.15em] block uppercase font-sans">
                              {p.englishName}
                            </span>
                            <h3 className="text-xl md:text-2xl font-black text-warm-800 mt-1 leading-snug">
                              {p.name}
                            </h3>
                          </div>

                          {/* Divider */}
                          <div className="h-px bg-gradient-to-l from-gold-400/30 via-gold-400/10 to-transparent"></div>

                          {/* Description */}
                          <p className="text-sm text-neutral-600 leading-relaxed">
                            {p.detailDescription}
                          </p>

                          {/* Specs: Active + Benefit — كروت جانبية أنيقة */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="bg-[#F8F6F1] border border-gold-200/30 rounded-xl p-4">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                                <span className="text-[10px] font-black text-gold-700">المادة الفعالة</span>
                              </div>
                              <p className="text-xs font-semibold text-neutral-800 leading-relaxed">
                                {p.activeSubst}
                              </p>
                            </div>
                            <div className="bg-[#F1F8F4] border border-emerald-200/30 rounded-xl p-4">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <Activity className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="text-[10px] font-black text-emerald-700">المنفعة المضمونة</span>
                              </div>
                              <p className="text-xs text-neutral-700 leading-relaxed">
                                {p.benefit}
                              </p>
                            </div>
                          </div>

                          {/* Ingredients */}
                          <div>
                            <span className="text-xs font-bold text-neutral-800 block mb-2">المكونات الفعالة:</span>
                            <div className="flex flex-wrap gap-1.5">
                              {p.ingredients.split('،').map((ingredient, ingIdx) => (
                                <span
                                  key={ingIdx}
                                  className="text-[10px] font-medium bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-lg text-neutral-600"
                                >
                                  {ingredient.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="pt-5 mt-5 border-t border-neutral-100">
                          <button
                            onClick={() => {
                              setSelectedOffer('bundle');
                              scrollToCheckout();
                            }}
                            className="w-full bg-gradient-to-l from-warm-800 to-warm-700 text-white font-black text-xs md:text-sm px-6 py-3.5 rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all active:scale-[0.97]"
                            id={`btn-select-to-buy-${p.id}`}
                          >
                            <ShoppingBag className="w-4 h-4" />
                            <span>اطلبي الآن — توصيل مجاني</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* 8. CHECKOUT — ORDER BOX */}
      <section className="py-20 md:py-28 bg-cream-50 px-6 md:px-12 lg:px-24" id="checkout-section">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="inline-flex items-center gap-2 bg-gold-100 border border-gold-300/30 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-gold-700 tracking-widest">
              <Lock className="w-3 h-3 text-gold-600" />
              طلب سريع وآمن
            </span>
            <h2 className="text-2xl md:text-5xl font-black text-warm-800">نموذج الحجز وتفاصيل التوصيل</h2>
            <div className="w-20 h-[1px] bg-gradient-to-l from-gold-400/60 via-gold-400/30 to-transparent mx-auto"></div>
            <p className="text-xs md:text-sm text-warm-500">
              إملأي الحقول بالبيانات المطلوبة لإرسال الطلب بسرعة
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="checkout-card">
            


            {/* RIGHT: Form */}
            <div className="lg:col-span-7 bg-white border border-cream-300/40 rounded-[24px] p-6 md:p-8 shadow-sm">
              
              {orderSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-300/30">
                    <Check className="w-8 h-8" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-black text-warm-800">تم تجهيز طلبك 🎉</h3>
                    <p className="text-xs text-warm-500 max-w-md mx-auto leading-relaxed">
                      أرسلي الطلب عبر واتساب لتأكيد الشحن الفوري.
                    </p>
                  </div>

                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`📦 *طلب حجز دكتور تاجي*
🆔 ${orderSuccess.id}
👤 ${orderSuccess.fullName}
📞 ${orderSuccess.phone}
📍 ${orderSuccess.city}
🛍️ ${orderSuccess.selectedProductName}
💰 ${orderSuccess.totalPrice} TL`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-warm-800 hover:bg-warm-700 text-gold-300 font-black text-sm px-8 py-4 rounded-xl transition-all shadow-lg shadow-warm-900/15 cursor-pointer hover:shadow-xl active:scale-[0.97] border border-gold-500/20"
                    id="btn-whatsapp-send-order"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 317.4 319.92" fill="currentColor">
                        <path d="M271.56,47.06c-61.69-62.3-162.2-62.8-224.5-1.11C-1.98,94.5-14.03,169.19,17.25,230.71L.41,312.48c-.35,1.65,0,3.36.96,4.74,1.43,2.12,4.03,3.13,6.52,2.53l80.15-19c78.5,39.02,173.76,7.01,212.78-71.49,30.19-60.75,18.44-133.97-29.24-182.22h0ZM246.57,246.5c-37.79,37.68-95.41,47.05-143.19,23.27l-11.17-5.53-49.13,11.64.15-.61,10.18-49.45-5.47-10.79c-24.42-47.96-15.19-106.2,22.87-144.26,48.54-48.53,127.23-48.53,175.77,0,.2.23.41.44.64.64,47.92,48.63,47.64,126.82-.64,175.1Z"/>
                        <path d="M242.21,210.23c-6.02,9.48-15.53,21.09-27.49,23.97-20.95,5.06-53.09.17-93.09-37.12l-.49-.44c-35.17-32.61-44.31-59.75-42.09-81.28,1.22-12.22,11.4-23.27,19.99-30.49,4.8-4.1,12.02-3.53,16.12,1.27.73.85,1.32,1.8,1.77,2.83l12.95,29.09c1.71,3.84,1.17,8.32-1.43,11.64l-6.55,8.49c-2.87,3.59-3.28,8.56-1.02,12.57,3.67,6.43,12.45,15.88,22.2,24.64,10.94,9.89,23.07,18.94,30.75,22.02,4.2,1.72,9.03.7,12.19-2.56l7.59-7.65c2.98-2.94,7.32-4.05,11.35-2.91l30.75,8.73c6.14,1.88,9.6,8.39,7.71,14.54-.29.93-.69,1.82-1.2,2.66h0Z"/>
                      </svg>
                      أرسلي عبر واتساب
                    </span>
                  </a>

                  <div className="bg-cream-50 border border-cream-200/60 rounded-xl p-4 max-w-md mx-auto space-y-2 text-[11px]">
                    <div className="flex justify-between border-b border-cream-200/60 pb-1.5">
                      <span className="text-warm-400">كود الحجز</span>
                      <span className="font-black text-warm-800">{orderSuccess.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-400">الاسم</span>
                      <span className="font-bold text-warm-800">{orderSuccess.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-warm-400">الإجمالي</span>
                      <span className="font-bold text-gold-600">{orderSuccess.totalPrice} TL</span>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-center">
                    <button onClick={resetForm} className="bg-cream-100 hover:bg-cream-200 text-warm-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer border border-cream-300/40">
                      طلب جديد
                    </button>
                    <button onClick={() => { resetForm(); navigateTo('/orders'); }} className="bg-gold-100 hover:bg-gold-200 text-gold-700 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer border border-gold-300/30">
                      حجوزاتي
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-6">
                  
                  {/* Step 1: Offer */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-warm-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center text-[10px] font-mono font-black">1</span>
                      <span>اختاري العرض المناسب</span>
                    </label>

                    <div onClick={() => setSelectedOffer('bundle')}
                      className={`relative p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedOffer === 'bundle' ? 'border-gold-500 bg-gold-50' : 'border-cream-300/40 bg-white hover:border-gold-300'
                      }`}
                      id="offer-bundle-card"
                    >
                      <div className="absolute -top-2.5 right-3 bg-gold-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full select-none">الأفضل توفيراً</div>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${selectedOffer === 'bundle' ? 'border-gold-500 bg-gold-500' : 'border-cream-300'}`}>
                            {selectedOffer === 'bundle' && <div className="w-2 h-2 rounded-full bg-white m-auto mt-0.5"></div>}
                          </div>
                          <div>
                            <span className="text-xs font-black text-warm-800 block">البكج العلاجي المتكامل</span>
                            <span className="text-[9px] text-warm-400 block mt-0.5">4 عبوات + واقي شمس SPF50 مجاناً + شحن مجاني</span>
                          </div>
                        </div>
                        <div className="text-left shrink-0">
                          <span className="text-[9px] text-warm-300 line-through block">2700 TL</span>
                          <span className="text-sm font-black text-gold-600 block">2050 TL</span>
                        </div>
                      </div>
                    </div>

                    <div onClick={() => setSelectedOffer('single')}
                      className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                        selectedOffer === 'single' ? 'border-gold-500 bg-gold-50' : 'border-cream-300/40 bg-white hover:border-gold-300'
                      }`}
                      id="offer-single-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 shrink-0 ${selectedOffer === 'single' ? 'border-gold-500 bg-gold-500' : 'border-cream-300'}`}>
                            {selectedOffer === 'single' && <div className="w-2 h-2 rounded-full bg-white m-auto mt-0.5"></div>}
                          </div>
                          <span className="text-xs font-black text-warm-800">مستحضر منفرد</span>
                        </div>
                        <span className="text-[9px] text-warm-400">+ 160 TL شحن</span>
                      </div>

                      <AnimatePresence>
                        {selectedOffer === 'single' && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                            <div className="grid grid-cols-2 gap-1.5">
                              {products.map((p) => (
                                <div key={p.id} onClick={() => setSelectedSingleProductId(p.id)}
                                  className={`p-2 rounded-lg border text-[10px] cursor-pointer flex items-center justify-between ${
                                    selectedSingleProductId === p.id ? 'border-gold-500 bg-gold-50 text-warm-800' : 'border-cream-200/60 text-warm-500 hover:border-gold-300'
                                  }`}
                                >
                                  <span className="truncate">{p.name.replace('دكتور تاجي ', '')}</span>
                                  <span className="text-gold-600 shrink-0">{p.price} TL</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Step 2: Quantity */}
                  <div className="bg-cream-50 border border-cream-200/60 rounded-xl p-4 flex items-center justify-between">
                    <label className="text-xs font-black text-warm-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center text-[10px] font-mono font-black">2</span>
                      <span>الكمية</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => { if (selectedOffer === 'bundle') { if (bundleQuantity > 1) setBundleQuantity(bundleQuantity - 1); } else { if (singleQuantity > 1) setSingleQuantity(singleQuantity - 1); } }}
                        className="w-8 h-8 bg-white border border-cream-300/40 rounded-lg flex items-center justify-center text-warm-600 hover:bg-cream-100 transition-colors cursor-pointer">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-warm-800 text-sm w-5 text-center">{selectedOffer === 'bundle' ? bundleQuantity : singleQuantity}</span>
                      <button type="button" onClick={() => { if (selectedOffer === 'bundle') setBundleQuantity(bundleQuantity + 1); else setSingleQuantity(singleQuantity + 1); }}
                        className="w-8 h-8 bg-white border border-cream-300/40 rounded-lg flex items-center justify-center text-warm-600 hover:bg-cream-100 transition-colors cursor-pointer">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Contact info */}
                  <div className="space-y-4">
                    <label className="text-xs font-black text-warm-800 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-gold-500 text-white flex items-center justify-center text-[10px] font-mono font-black">3</span>
                      <span>معلومات التوصيل</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-warm-500 font-bold block">الاسم الكامل</label>
                        <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="ياسمين يلماز"
                          className="w-full p-3 rounded-xl bg-cream-50 border border-cream-300/30 text-xs text-warm-800 placeholder-warm-300 focus:border-gold-500 focus:outline-none transition-colors text-right"
                          id="input-name" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-warm-500 font-bold block">جوال واتساب</label>
                        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05321234567" pattern="05[0-9]{9}"
                          className="w-full p-3 rounded-xl bg-cream-50 border border-cream-300/30 text-xs text-warm-800 placeholder-warm-300 focus:border-gold-500 focus:outline-none transition-colors text-right font-mono"
                          id="input-phone" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-warm-500 font-bold block">الولاية</label>
                        <select required value={city} onChange={(e) => setCity(e.target.value)}
                          className="w-full p-3 rounded-xl bg-cream-50 border border-cream-300/30 text-xs text-warm-800 focus:border-gold-500 focus:outline-none cursor-pointer transition-colors"
                          id="input-city">
                          <option value="" className="bg-cream-50">اختر الولاية</option>
                          {citiesList.map(c => <option key={c} value={c} className="bg-cream-50">{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-warm-500 font-bold block">العنوان (اختياري)</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="الفاتح، بجانب المترو"
                          className="w-full p-3 rounded-xl bg-cream-50 border border-cream-300/30 text-xs text-warm-800 placeholder-warm-300 focus:border-gold-500 focus:outline-none transition-colors text-right"
                          id="input-address" />
                      </div>
                    </div>

                    <div className="bg-cream-50 border border-dashed border-cream-300/40 rounded-xl p-3 text-center text-[10px] text-warm-400 leading-relaxed">
                      بعد الإرسال، سيتم تحويلك لواتساب لتأكيد الطلب فوراً
                    </div>
                  </div>

                  {/* Error alert */}
                  {orderError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                      <p className="text-[11px] font-bold text-red-700">{orderError}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button type="submit" disabled={isSubmitting}
                    className={`w-full bg-gradient-to-l from-gold-600 to-gold-500 text-white font-black text-sm py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30 transition-all active:scale-[0.98] cursor-pointer ${
                      isSubmitting ? 'opacity-80 cursor-wait' : ''
                    }`}
                    id="btn-submit-order"
                  >
                    {isSubmitting ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /><span>جاري التجهيز...</span></>
                    ) : (
                      <><span>أرسلي الطلب</span><ArrowRight className="w-4 h-4 rotate-180" /></>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-center text-[9px] text-warm-400 font-medium">
                    <Lock className="w-3 h-3" />
                    <span>معلوماتك آمنة — شحن مبرد لسلامة المنتجات</span>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 8.5 DELUXE BEFORE/AFTER CLINICAL CLINICAL DEMONSTRATION SECTION */}
      <section className="py-24 bg-gradient-to-b from-[#FAFAF6] to-[#FCFBF8] px-6 md:px-12 lg:px-24 border-t border-b border-gold-300/10" id="before-after-section">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-black tracking-widest text-gold-600 uppercase block">إثباتات سريرية مرئية</span>
            <h2 className="text-2xl md:text-5xl font-black text-warm-800">نتائج التحوّل الفائقة خلال 15 يوماً فقط</h2>
            <div className="w-20 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#736D67] font-light">
              شاهدي بالتفصيل والتوثيق الحقيقي كيف تتغير خلايا البشرة بنظام دكتور تاجي الطبي المتكامل. لقطات واقعية غير مبرمجة لعميلات حقيقيات.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Case 1 */}
            <div className="card-elegant overflow-hidden rounded-[2rem] border border-gold-300/20 shadow-xl flex flex-col group hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <BeforeAfterSlider
                  beforeImg="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600"
                  afterImg="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600"
                  beforeLabel="قبل الاستخدام"
                  afterLabel="بعد 15 يوماً"
                />
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <h3 className="text-base font-black text-warm-800">مكافحة الخطوط العميقة وامتلاء الوجه</h3>
                </div>
                <p className="text-xs text-[#7A746E] leading-relaxed">
                  تأثير الببتيدات الذهبية ثلاثية الأبعاد ساهم في ملء التجاعيد وشد خلايا الجلد المرتخية وإعطاء امتلاء طبيعي فوري للوجه ونضارة تظهر بوضوح تحت الضوء.
                </p>
                <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100">
                  <div className="text-[10px] bg-gold-100 text-[#aa843f] px-2.5 py-1 rounded-md font-bold">المنتج: كريم 6 في 1 المرمم</div>
                  <div className="text-[10px] bg-neutral-100 text-[#736D67] px-2.5 py-1 rounded-md">الحالة: عميلة موثقة لديها جفاف شديد</div>
                </div>
              </div>
            </div>

            {/* Case 2 */}
            <div className="card-elegant overflow-hidden rounded-[2rem] border border-gold-300/20 shadow-xl flex flex-col group hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <BeforeAfterSlider
                  beforeImg="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=600"
                  afterImg="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600"
                  beforeLabel="قبل الاستخدام"
                  afterLabel="بعد 15 يوماً"
                />
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <h3 className="text-base font-black text-warm-800">موازنة الدهون والمكياج مع تضييق المسام</h3>
                </div>
                <p className="text-xs text-[#7A746E] leading-relaxed">
                  بمساعدة ساليسيليك الطين الطبيعي المنظف، تمت تصفية البشرة بالكامل من الرؤوس السوداء وتنظيم الإفرازات الدهنية، مما تسبب بإنهاء لمعان البشرة المزعج وإعادة مرونتها وصقل ملمسها.
                </p>
                <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100">
                  <div className="text-[10px] bg-gold-100 text-[#aa843f] px-2.5 py-1 rounded-md font-bold">المنتج: غسول الطحالب + كريم الذهب</div>
                  <div className="text-[10px] bg-neutral-100 text-[#736D67] px-2.5 py-1 rounded-md">الحالة: بشرة دهنية ومعرضة للبثور</div>
                </div>
              </div>
            </div>

            {/* Case 3 */}
            <div className="card-elegant overflow-hidden rounded-[2rem] border border-gold-300/20 shadow-xl flex flex-col group hover:shadow-2xl transition-all duration-500">
              <div className="relative h-64 overflow-hidden">
                <BeforeAfterSlider
                  beforeImg="https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600"
                  afterImg="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600"
                  beforeLabel="قبل الاستخدام"
                  afterLabel="بعد 15 يوماً"
                />
              </div>
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500"></span>
                  <h3 className="text-base font-black text-warm-800">إنبات وتطويل الرموش وتكثيف الفراغات</h3>
                </div>
                <p className="text-xs text-[#7A746E] leading-relaxed">
                  تنشيط فائق للبصيلات الخاملة وزيادة في سماكة وطول الرمش وحواجب العين بمركب البيوتين السريري دون التسبب بأي عوارض أو صغار في الجلد المحيط.
                </p>
                <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100">
                  <div className="text-[10px] bg-gold-100 text-[#aa843f] px-2.5 py-1 rounded-md font-bold">المنتج: سيروم الرموش Eyeluxe</div>
                  <div className="text-[10px] bg-neutral-100 text-[#736D67] px-2.5 py-1 rounded-md">الحالة: تضرر الرموش بفعل الميك آب</div>
                </div>
              </div>
            </div>

          </div>

          {/* Luxury CTA invitation */}
          <div className="mt-14 text-center">
            <button
              onClick={scrollToCheckout}
              className="inline-flex items-center gap-2 bg-warm-800 hover:bg-warm-700 text-white font-sans font-black px-8 py-4 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg active:scale-95 transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-gold-600" />
              <span>ابدئي رحلتكِ الخاصة لبشرة مثالية اليوم</span>
            </button>
          </div>

        </div>
      </section>

      {/* 9. REVIEWS & TESTIMONIALS (قصص نجاح وإثباتات سريرية) */}
      <section className="py-20 bg-gradient-to-b from-[#FCFBF8] to-[#FAF6EF]" id="reviews">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">أراء موثقة</span>
            <h2 className="text-2xl md:text-5xl font-black text-warm-800">نتائج شهود عيان وطبابة حقيقية</h2>
            <div className="w-20 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#736D67] font-light">
              عميلات ممتنات وأكاديميات علمية تجميلية يلمسن النقلة النوعية لبشرتهن بدكتور تاجي.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="card-elegant p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 md:hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                id={`review-card-${rev.id}`}
              >
                <div className="space-y-4">
                  {/* Luxury Star Panel */}
                  <div className="flex gap-1 text-gold-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-gold-500" />
                    ))}
                  </div>
                  {/* review text content inside quotation marks styling */}
                  <p className="text-xs md:text-sm text-[#4E4843] leading-relaxed font-light">
                    "{rev.text}"
                  </p>
                </div>

                {/* Auther customer info details block */}
                <div className="flex items-center gap-3.5 pt-4 border-t border-gold-400/5">
                  <img 
                    src={rev.avatar} 
                    alt={rev.author} 
                    className="w-11 h-11 rounded-full object-cover border border-gold-500/20"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-xs md:text-sm font-black text-warm-800 block">{rev.author}</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-[#8C8680] font-sans">{rev.city} • {rev.date}</span>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-0.5 bg-green-50 text-green-700 text-[8px] font-black px-1.5 py-0.5 rounded-full border border-green-200">
                          <Check className="w-2.5 h-2.5" />
                          <span>عميلة موثقة</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. FAQS — SYSTEM ACCORDION */}
      <section className="py-20 md:py-28 bg-cream-50 px-6 md:px-12 lg:px-24 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"></div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-100/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-100/30 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-3xl mx-auto relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="inline-flex items-center gap-2 bg-gold-100 border border-gold-300/30 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-gold-700 tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              المعلومات الدقيقة
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-warm-800 leading-tight">الأسئلة الشائعة</h2>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-gradient-to-l from-gold-400/60 to-transparent"></div>
              <div className="w-1.5 h-1.5 rotate-45 bg-gold-400"></div>
              <div className="h-px w-8 bg-gradient-to-r from-gold-400/60 to-transparent"></div>
            </div>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl border border-cream-300/40 overflow-hidden transition-all duration-300 hover:border-gold-300/50 hover:shadow-md"
                  id={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className={`w-full p-5 md:p-6 text-right flex items-center justify-between gap-4 transition-all duration-300 cursor-pointer ${
                      isOpen ? 'bg-gold-50/50' : 'hover:bg-cream-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <span className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black font-mono transition-all duration-300 ${
                        isOpen ? 'bg-gold-500 text-white' : 'bg-cream-100 text-warm-400'
                      }`}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-bold text-warm-800 text-xs md:text-sm leading-relaxed pt-0.5">{faq.question}</span>
                    </div>
                    <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isOpen ? 'bg-gold-500 text-white rotate-180' : 'bg-cream-100 text-warm-400'
                    }`}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6">
                          <div className="h-px bg-gradient-to-r from-gold-400/30 via-gold-400/10 to-transparent mb-4"></div>
                          <div className="flex gap-3.5">
                            <div className="shrink-0 w-7"></div>
                            <p className="text-xs md:text-sm text-warm-500 leading-relaxed font-light">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="relative bg-cream-200 text-warm-800 overflow-hidden border-t border-gold-300/20">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent"></div>
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-gold-100/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-gold-100/40 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-16 pb-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 text-center lg:text-right">

            <div className="lg:col-span-5 space-y-6">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-lg shadow-gold-500/20">
                  <span className="text-white font-sans text-lg font-black tracking-wider">DT</span>
                </div>
                <div>
                  <span className="text-lg md:text-xl font-black text-warm-800 block leading-none">دُكتور تَاجي</span>
                  <span className="text-[8px] text-gold-600 block mt-1 font-sans tracking-[0.2em] font-black">DR. TAGY CLINICAL SKINCARE</span>
                </div>
              </div>
              <p className="text-xs text-warm-500 leading-relaxed font-light max-w-sm mx-auto lg:mx-0">
                دكتور تاجي هي علامة طبية تجميلية ريادية تسعى لاستعادة شباب وصحة حاجز البشرة والرموش بصيغ الذهب الكولاجينية الثنائية المتفوقة. معتمدة سريرياً، ومصممة بدقة لنشاط آمن ومستدام للوجه.
              </p>
              <div className="flex items-center gap-3 justify-center lg:justify-start pt-2">
                <div className="w-8 h-px bg-gradient-to-l from-gold-400/60 to-transparent"></div>
                <div className="w-1.5 h-1.5 rotate-45 bg-gold-400"></div>
                <div className="w-8 h-px bg-gradient-to-r from-gold-400/60 to-transparent"></div>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-5 text-xs text-warm-500">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <div className="w-5 h-px bg-gold-400/60"></div>
                <h4 className="text-xs font-extrabold text-warm-800 tracking-widest font-sans uppercase">الدعم والتوزيع</h4>
              </div>
              <div className="space-y-3 font-light">
                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <span className="text-gold-500 text-sm shrink-0">📍</span>
                  <span>المقر المركزي: الفاتح، إسطنبول، الجمهورية التركية</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <span className="text-gold-500 text-sm shrink-0">📧</span>
                  <span>الدعم والأبحاث: support@drtagy-beauty.online</span>
                </div>
                <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                  <span className="text-gold-500 text-sm shrink-0">💬</span>
                  <span>استفسارات الروتين واتساب: +90 551 158 4123</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-5 text-xs text-warm-500 font-light">
              <div className="flex items-center gap-2.5 justify-center lg:justify-start">
                <div className="w-5 h-px bg-gold-400/60"></div>
                <h4 className="text-xs font-extrabold text-warm-800 tracking-widest font-sans uppercase">تنويهات</h4>
              </div>
              <p className="leading-relaxed border-r-2 border-gold-400/30 pr-4">
                * جميع النتائج فردية ومبنية على الروتين الشخصي الملتزم الكافي بالبشرة ونوعية العناية المتوفرة ومستويات الغذاء المتكامل. جميع منتجاتنا معتمدة ومطابقة كلياً للتراخيص الدولية.
              </p>
            </div>

          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gold-400/30 to-transparent mb-6"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-warm-400">
            <p>© {new Date().getFullYear()} دكتور تاجي (Dr. Tagy Skincare) - جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-4">
              <span className="text-[9px] opacity-60 font-light">Clinical Excellence</span>
              <div className="w-1 h-1 rounded-full bg-gold-400/50"></div>
              <button 
                onClick={() => navigateTo('/orders')} 
                className="px-4 py-2 bg-white/70 hover:bg-white text-warm-600 text-[10px] uppercase tracking-wider font-extrabold rounded-xl border border-gold-300/40 transition-all flex items-center gap-1.5 cursor-pointer hover:border-gold-400 hover:shadow-sm active:scale-[0.97]"
                id="footer-admin-toggle-btn"
              >
                <ClipboardList className="w-3 h-3 text-gold-600" />
                <span>لوحة التحكم</span>
              </button>
            </div>
          </div>
        </div>
      </footer>



          {/* FLOATING WHATSAPP WIDGET */}
          <div className="fixed bottom-24 md:bottom-8 right-6 z-55">
            <a 
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=مرحباً دكتور تاجي، أود الحصول على استشارة طبية مجانية بخصوص الروتين العلاجي للبشرة في تركيا`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-warm-800 hover:bg-warm-700 text-gold-300 p-3.5 rounded-full shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-105 active:scale-95 border border-gold-500/30 relative shadow-warm-900/20"
              id="whatsapp-floating-widget"
              title="💬 استشارة واتساب مباشرة"
            >
              <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-gold-500 rounded-full flex items-center justify-center border-2 border-cream-100 animate-pulse"></span>

              <svg className="w-5 h-5 shrink-0" viewBox="0 0 317.4 319.92" fill="currentColor">
                <path d="M271.56,47.06c-61.69-62.3-162.2-62.8-224.5-1.11C-1.98,94.5-14.03,169.19,17.25,230.71L.41,312.48c-.35,1.65,0,3.36.96,4.74,1.43,2.12,4.03,3.13,6.52,2.53l80.15-19c78.5,39.02,173.76,7.01,212.78-71.49,30.19-60.75,18.44-133.97-29.24-182.22h0ZM246.57,246.5c-37.79,37.68-95.41,47.05-143.19,23.27l-11.17-5.53-49.13,11.64.15-.61,10.18-49.45-5.47-10.79c-24.42-47.96-15.19-106.2,22.87-144.26,48.54-48.53,127.23-48.53,175.77,0,.2.23.41.44.64.64,47.92,48.63,47.64,126.82-.64,175.1Z"/>
                <path d="M242.21,210.23c-6.02,9.48-15.53,21.09-27.49,23.97-20.95,5.06-53.09.17-93.09-37.12l-.49-.44c-35.17-32.61-44.31-59.75-42.09-81.28,1.22-12.22,11.4-23.27,19.99-30.49,4.8-4.1,12.02-3.53,16.12,1.27.73.85,1.32,1.8,1.77,2.83l12.95,29.09c1.71,3.84,1.17,8.32-1.43,11.64l-6.55,8.49c-2.87,3.59-3.28,8.56-1.02,12.57,3.67,6.43,12.45,15.88,22.2,24.64,10.94,9.89,23.07,18.94,30.75,22.02,4.2,1.72,9.03.7,12.19-2.56l7.59-7.65c2.98-2.94,7.32-4.05,11.35-2.91l30.75,8.73c6.14,1.88,9.6,8.39,7.71,14.54-.29.93-.69,1.82-1.2,2.66h0Z"/>
              </svg>

              <span className="text-xs font-extrabold font-sans max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap block text-gold-300">
                استشارة طبية مجانية
              </span>
            </a>
          </div>

      {/* 13. DETAILED QUICK VIEW MODAL FOR SINGLE SPECIAL PRODUCTS */}
      <AnimatePresence>
        {activeModalProduct && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white max-w-2xl w-full rounded-3xl overflow-hidden border border-gold-400/30 shadow-2xl max-h-[90vh] flex flex-col justify-between"
              id="product-detail-modal"
            >
              
              {/* Header inside modal dialog */}
              <div className="p-6 border-b border-gold-300/10 flex items-center justify-between sticky top-0 bg-white z-10">
                <div>
                  <span className="text-[9px] text-[#aa843f] font-mono tracking-widest block uppercase font-bold">{activeModalProduct.englishName}</span>
                  <h3 className="text-base md:text-xl font-black text-warm-800">{activeModalProduct.name}</h3>
                </div>
                <button 
                  onClick={() => setActiveModalProduct(null)}
                  className="p-2 hover:bg-neutral-50 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
                  id="close-modal-btn"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body content modal */}
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-grow text-right" dir="rtl">
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-5 aspect-square rounded-2xl bg-[#FCFBF8] border border-gold-300/10 flex items-center justify-center p-4 overflow-hidden">
                    <img 
                      src={activeModalProduct.image} 
                      alt={activeModalProduct.name} 
                      className="w-full max-h-[180px] object-cover mix-blend-multiply" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="sm:col-span-7 space-y-3.5 text-right" dir="rtl">
                    <span className="inline-block bg-gold-400/10 text-gold-800 text-[10px] font-bold px-3 py-1 rounded-full border border-gold-400/20">
                      حجم العبوة: {activeModalProduct.size}
                    </span>
                    <div className="text-[#3d6a5c] font-bold text-xs flex items-center gap-1.5 justify-end">
                      <Sparkle className="w-4 h-4 text-gold-500 shrink-0" />
                      <span>الصيغة الفعالة: {activeModalProduct.activeSubst}</span>
                    </div>
                    <p className="text-xs md:text-sm text-[#5D5751] leading-relaxed font-light" dir="rtl">
                      {activeModalProduct.detailDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-5 border-t border-neutral-100">
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-warm-800 flex items-center gap-1.5 justify-end">
                      <Check className="w-4 h-4 text-gold-500 shrink-0" />
                      <span>المزايا العلاجية للمستحضر:</span>
                    </h4>
                    <p className="text-xs text-[#6A645D] leading-relaxed font-light pr-5" dir="rtl">
                      {activeModalProduct.benefit}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2">
                    <h4 className="text-xs font-extrabold text-warm-800 flex items-center gap-1.5 justify-end">
                      <Check className="w-4 h-4 text-gold-500 shrink-0" />
                      <span>كامل المكونات الطبية للتركيبة:</span>
                    </h4>
                    <p className="text-xs text-[#6A645D] leading-relaxed font-light pr-5 bg-[#FCFBF8] p-3 rounded-xl border border-gold-300/5" dir="rtl">
                      {activeModalProduct.ingredients}
                    </p>
                  </div>
                </div>

              </div>

              {/* Action buttons inside Modal bottom footer */}
              <div className="p-5 bg-[#FAF6EF]/50 border-t border-gold-300/10 flex items-center justify-between sticky bottom-0">
                <div>
                  <span className="text-[10px] text-gray-500 block leading-none font-light">سعر العبوة المنفردة شامل الضريبة</span>
                  <span className="text-md md:text-lg font-black text-warm-800 block mt-1">{activeModalProduct.price} TL</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveModalProduct(null)}
                    className="bg-white border border-neutral-200 hover:bg-neutral-50 text-warm-800 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                  >
                    العـودة
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOffer('single');
                      setSelectedSingleProductId(activeModalProduct.id);
                      setActiveModalProduct(null);
                      scrollToCheckout();
                    }}
                    className="bg-warm-800 hover:bg-gold-500 text-white hover:text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm active:scale-95"
                    id={`modal-buy-btn-${activeModalProduct.id}`}
                  >
                    شراء فوري في الصندوق
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Standalone admin view loaded separately */}
      <AnimatePresence>
        {false && showAdminPanel && (
          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white z-50 shadow-2xl border-l border-gold-400/20 flex flex-col justify-between" id="admin-orders-panel">
            
            {/* Admin Header */}
            <div className="p-5 bg-gradient-to-r from-warm-800 to-warm-700 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gold-600" />
                <div>
                  <h3 className="font-black text-sm md:text-base">لوحة تأكيد حجز الطلبيات (المحلية)</h3>
                  <span className="text-[10px] text-gold-600 block -mt-1 font-sans">COD Admin Order Management Dashboard</span>
                </div>
              </div>
              <button 
                onClick={() => navigateTo('/')}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Admin body lists */}
            <div className="p-5 flex-grow overflow-y-auto space-y-4">
              
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs leading-relaxed space-y-1">
                <span className="font-bold flex items-center gap-1">💡 مراجعة الطلبيات:</span>
                <p className="font-light">
                  تمثّل هذه اللوحة مستغل حجوزات الطرد والبيانات المحلية المخزنة بالكامل على المتصفح عبر الـ <span className="font-mono bg-white px-1.5 py-0.5 rounded text-neutral-800 border border-amber-300">localStorage</span> للتحقق السلس.
                </p>
              </div>

              {savedOrders.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-neutral-200 mx-auto" />
                  <p className="text-xs text-neutral-400 font-bold">لا يوجد أي حجوزات طرود حتى اللحظة.</p>
                  <p className="text-[10px] text-neutral-400 max-w-xs mx-auto">قومي بتعبئة الاسم والجوال في صندوق الاستلام بالصفحة لتنشيط الحجز وتسجيل طرد جديد هنا فوراً!</p>
                </div>
              ) : (
                savedOrders.map((ord) => {
                  const isEditing = editingOrderId === ord.id;
                  
                  if (isEditing) {
                    return (
                      <div key={ord.id} className="bg-white border-2 border-[#aa843f]/30 p-4.5 rounded-2xl space-y-4 text-xs shadow-md">
                        <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                          <span className="font-mono font-bold text-warm-800 text-sm">تعديل معلومات الحجز: {ord.id}</span>
                          <button onClick={() => setEditingOrderId(null)} className="text-neutral-400 hover:text-red-500 cursor-pointer">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <div className="space-y-3 font-sans">
                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">الاسم الكامل:</label>
                            <input 
                              type="text" 
                              value={editFullName} 
                              onChange={e => setEditFullName(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-neutral-50/50"
                            />
                          </div>
                          
                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">رقم الجوال:</label>
                            <input 
                              type="tel" 
                              value={editPhone} 
                              onChange={e => setEditPhone(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-neutral-50/50 text-left font-mono"
                              dir="ltr"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">الولاية:</label>
                              <input 
                                type="text" 
                                value={editCity} 
                                onChange={e => setEditCity(e.target.value)} 
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-neutral-50/50"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">العنوان بالتفصيل:</label>
                              <input 
                                type="text" 
                                value={editAddress} 
                                onChange={e => setEditAddress(e.target.value)} 
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-neutral-50/50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">الروتين/المنتج المطلوب:</label>
                            <input 
                              type="text" 
                              value={editProductName} 
                              onChange={e => setEditProductName(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-neutral-50/50"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">الكمية:</label>
                              <input 
                                type="number" 
                                value={editQuantity} 
                                onChange={e => setEditQuantity(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-neutral-50/50 font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">المستحق (TL):</label>
                              <input 
                                type="number" 
                                value={editTotalPrice} 
                                onChange={e => setEditTotalPrice(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500 bg-neutral-50/50 font-mono"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-neutral-100 justify-end">
                          <button 
                            type="button"
                            onClick={() => setEditingOrderId(null)} 
                            className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold rounded-xl cursor-pointer"
                          >
                            رجوع
                          </button>
                          <button 
                            type="button"
                            onClick={() => saveEditedOrder(ord.id)} 
                            className="px-5 py-2 bg-gradient-to-r from-green-700 to-green-650 text-white font-black rounded-xl cursor-pointer hover:shadow-lg transition-all"
                          >
                            حفظ البيانات 💾
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Determine status styling
                  let statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
                  let statusLabel = 'بالإنتظار ⏳';
                  if (ord.status === 'pending' || !ord.status) {
                    statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
                    statusLabel = 'بالإنتظار ⏳';
                  } else if (ord.status === 'preparing') {
                    statusBg = 'bg-blue-50 text-blue-700 border-blue-200';
                    statusLabel = 'تم التجهيز 📦';
                  } else if (ord.status === 'shipped') {
                    statusBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                    statusLabel = 'تم الشحن 🚚';
                  } else if (ord.status === 'delivered') {
                    statusBg = 'bg-green-50 text-green-700 border-green-200';
                    statusLabel = 'تم التسليم ✅';
                  } else if (ord.status === 'cancelled') {
                    statusBg = 'bg-gray-100 text-gray-600 border-gray-300';
                    statusLabel = 'ملغي ❌';
                  }

                  return (
                    <div key={ord.id} className="bg-white border border-neutral-200 p-5 rounded-2xl space-y-4 text-xs shadow-sm transition-all hover:shadow relative group">
                      
                      {/* Delete button */}
                      <button
                        onClick={(e) => {
                          if (confirm('هل ترغبين بالتأكيد في حذف هذا الحجز نهائياً؟')) {
                            deleteOrder(ord.id, e);
                          }
                        }}
                        className="absolute top-4 left-4 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer duration-200"
                        title="حذف هذا الطلب"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      {/* Order Code & Time */}
                      <div className="flex justify-between items-center border-b border-dashed border-neutral-100 pb-2.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#aa843f] animate-pulse"></span>
                          <span className="text-[#aa843f] font-mono font-black text-xs">{ord.id}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-sans">{ord.createdAt}</span>
                      </div>

                      {/* Customer Details Grid */}
                      <div className="grid grid-cols-2 gap-2.5 text-neutral-600 bg-neutral-50/50 p-3 rounded-xl border border-neutral-100 font-sans">
                        <p className="leading-relaxed"><strong className="font-extrabold text-warm-800">الاسم:</strong> <span className="text-neutral-800 font-medium">{ord.fullName}</span></p>
                        <p className="leading-relaxed"><strong className="font-extrabold text-warm-800">الجوال:</strong> <span className="text-neutral-800 font-mono font-bold" dir="ltr">{ord.phone}</span></p>
                        <p className="leading-relaxed"><strong className="font-extrabold text-warm-800">الولاية:</strong> <span className="text-neutral-800 font-medium">{ord.city}</span></p>
                        <p className="leading-relaxed"><strong className="font-extrabold text-warm-800">العنوان:</strong> <span className="text-neutral-800 font-light truncate block" title={ord.address}>{ord.address}</span></p>
                      </div>

                      {/* Items Details */}
                      <div className="bg-white p-3 rounded-xl border border-neutral-105 space-y-1.5 shadow-sm font-sans">
                        <p className="flex justify-between"><strong className="font-bold text-neutral-550">الطلب المطلوب:</strong> <span className="font-extrabold text-warm-800">{ord.selectedProductName}</span></p>
                        <p className="flex justify-between"><strong className="font-bold text-neutral-550">الكمية:</strong> <span className="font-black text-warm-800">{ord.quantity} طرد</span></p>
                        <p className="flex justify-between border-t border-dashed border-neutral-100 pt-1.5"><strong className="font-bold text-neutral-700">المبلغ الإجمالي للتسليم:</strong> <span className="font-black text-gold-700 text-sm">{ord.totalPrice} TL</span></p>
                      </div>

                      {/* Status Indicator Bar */}
                      <div className={`flex justify-between items-center px-3 py-2 rounded-xl border ${statusBg} font-sans`}>
                        <span className="text-[10px] font-bold">الحالة: {statusLabel}</span>
                      </div>

                      {/* Status Select action list */}
                      <div className="space-y-2 pt-1.5 border-t border-neutral-100 font-sans">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-neutral-500 font-extrabold shrink-0">تحيين حالة الحجز:</span>
                          <div className="flex flex-wrap gap-1 flex-1">
                            {(['pending', 'preparing', 'shipped', 'delivered', 'cancelled'] as const).map((st) => {
                              let label = '';
                              let buttonTheme = '';
                              if (st === 'pending') { label = 'انتظار'; buttonTheme = 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'; }
                              if (st === 'preparing') { label = 'تجهيز'; buttonTheme = 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'; }
                              if (st === 'shipped') { label = 'شحن'; buttonTheme = 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'; }
                              if (st === 'delivered') { label = 'تسليم'; buttonTheme = 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'; }
                              if (st === 'cancelled') { label = 'إلغاء'; buttonTheme = 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'; }

                              const isCurrent = (ord.status || 'pending') === st;
                              const activeStyles = isCurrent 
                                ? st === 'pending' 
                                  ? 'bg-amber-500 text-white font-extrabold border border-amber-600 scale-[1.03]' 
                                  : st === 'preparing' 
                                    ? 'bg-blue-600 text-white font-extrabold border border-blue-700 scale-[1.03]'
                                    : st === 'shipped'
                                      ? 'bg-indigo-600 text-white font-extrabold border border-indigo-700 scale-[1.03]'
                                      : st === 'delivered'
                                        ? 'bg-green-600 text-white font-extrabold border border-green-700 scale-[1.03]'
                                        : 'bg-gray-650 text-white font-extrabold border border-gray-700 scale-[1.03]'
                                : buttonTheme;

                              return (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => updateOrderStatus(ord.id, st)}
                                  className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition-all duration-200 cursor-pointer ${activeStyles}`}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Order Management Actions (Edit, WhatsApp Contact) */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => startEditingOrder(ord)}
                            className="bg-neutral-55 hover:bg-neutral-100 text-warm-800 border border-neutral-200 font-extrabold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                          >
                            <span>تعديل التفاصيل</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => contactCustomerWhatsApp(ord)}
                            className="bg-warm-800 hover:bg-warm-700 text-gold-300 font-black py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-[11px] border border-gold-500/20"
                          >
                            <span className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 317.4 319.92" fill="currentColor">
                                <path d="M271.56,47.06c-61.69-62.3-162.2-62.8-224.5-1.11C-1.98,94.5-14.03,169.19,17.25,230.71L.41,312.48c-.35,1.65,0,3.36.96,4.74,1.43,2.12,4.03,3.13,6.52,2.53l80.15-19c78.5,39.02,173.76,7.01,212.78-71.49,30.19-60.75,18.44-133.97-29.24-182.22h0ZM246.57,246.5c-37.79,37.68-95.41,47.05-143.19,23.27l-11.17-5.53-49.13,11.64.15-.61,10.18-49.45-5.47-10.79c-24.42-47.96-15.19-106.2,22.87-144.26,48.54-48.53,127.23-48.53,175.77,0,.2.23.41.44.64.64,47.92,48.63,47.64,126.82-.64,175.1Z"/>
                                <path d="M242.21,210.23c-6.02,9.48-15.53,21.09-27.49,23.97-20.95,5.06-53.09.17-93.09-37.12l-.49-.44c-35.17-32.61-44.31-59.75-42.09-81.28,1.22-12.22,11.4-23.27,19.99-30.49,4.8-4.1,12.02-3.53,16.12,1.27.73.85,1.32,1.8,1.77,2.83l12.95,29.09c1.71,3.84,1.17,8.32-1.43,11.64l-6.55,8.49c-2.87,3.59-3.28,8.56-1.02,12.57,3.67,6.43,12.45,15.88,22.2,24.64,10.94,9.89,23.07,18.94,30.75,22.02,4.2,1.72,9.03.7,12.19-2.56l7.59-7.65c2.98-2.94,7.32-4.05,11.35-2.91l30.75,8.73c6.14,1.88,9.6,8.39,7.71,14.54-.29.93-.69,1.82-1.2,2.66h0Z"/>
                              </svg>
                              تواصل واتساب
                            </span>
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })
              )}

            </div>

            {/* Admin bottom action control */}
            <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex justify-between gap-3 text-xs">
              <button 
                onClick={() => {
                  if (confirm("هل تعتزم شطب وسجل الطلبيات المحفظ بالكامل؟")) {
                    setSavedOrders([]);
                    localStorage.removeItem('dr_tagy_orders');
                  }
                }}
                disabled={savedOrders.length === 0}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 py-3 px-4 rounded-xl transition-colors flex-1 cursor-pointer"
              >
                شطب جميع الطلبات
              </button>
              <button 
                onClick={() => navigateTo('/')}
                className="bg-warm-800 hover:bg-warm-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex-1 text-center cursor-pointer"
              >
                إغلاق اللوحة
              </button>
            </div>

          </div>
        )}
      </AnimatePresence>

      {/* Floating Sticky Mobile Quick-Purchase Bar */}
      <AnimatePresence>
        {showStickyCta && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
          >
            <div className="bg-gradient-to-t from-warm-900/95 via-warm-900/90 to-warm-900/85 backdrop-blur-xl border-t border-gold-500/20 px-4 pt-3 pb-6 shadow-[0_-12px_40px_rgba(45,24,16,0.35)]">
              <div className="flex items-center justify-between gap-3">
                <div className="text-right">
                  <span className="text-[9px] text-gold-400 font-extrabold tracking-widest block font-sans mb-1.5">عرض الـ 15 يوماً الحصري</span>
                  <span className="text-sm font-black text-white block leading-tight">
                    البكج الكامل + واقي شمس مجاني 🎁
                  </span>
                </div>
                <button
                  onClick={scrollToCheckout}
                  className="bg-warm-800 hover:bg-warm-700 border-2 border-gold-500/40 hover:border-gold-500/60 px-5 py-3 rounded-xl text-xs font-black text-gold-300 shadow-lg shadow-warm-900/30 flex items-center gap-1.5 cursor-pointer active:scale-95 hover:shadow-xl transition-all shrink-0"
                >
                  <ShoppingBag className="w-4 h-4 text-gold-400" />
                  <span>اشتري الآن</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
