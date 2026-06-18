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

export default function App() {
  // Navigation & UI States
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [selectedOffer, setSelectedOffer] = useState<'bundle' | 'single'>('bundle');
  const [selectedSingleProductId, setSelectedSingleProductId] = useState<string>(products[0].id);
  const [singleQuantity, setSingleQuantity] = useState<number>(1);
  const [bundleQuantity, setBundleQuantity] = useState<number>(1);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Custom reviews screenshots state
  const [uploadedReviews, setUploadedReviews] = useState<string[]>(() => {
    const saved = localStorage.getItem('dr_tagy_uploaded_reviews');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeReviewIndex, setActiveReviewIndex] = useState<number>(0);

  const mockReviewSlides = [
    {
      id: 'mock-1',
      type: 'whatsapp' as const,
      sender: 'مريم العتيبي (عميلة موثقة)',
      time: '11:42 ص',
      avatarLetter: 'م',
      chatBubbles: [
        {
          text: 'السلام عليكم دكتورة، حبيت أشكر دكتور تاجي من كل قلبي على البكج المتكامل 😭❤️ بشرتي تغيرت 180 درجة وصارت ممتلئة وفيها نضارة تجنن.. حتى الخطوط حول شفايفي خفت حيل وصديقاتي يسألوني وش مسوية!',
          sender: 'client',
          time: '11:40 ص'
        },
        {
          text: 'أهلاً بكِ عزيزتي مريم، يسعدنا جداً سماع هذه النتائج المذهلة! ببتيدات الذهب دقيقة التأثير في كريم 6 في 1 تعمل بتناغم لتسريع التجديد الطبيعي. استمري على الروتين لتحافظي على هذه الرطوبة الفائقة ✨',
          sender: 'support',
          time: '11:41 ص'
        },
        {
          text: 'أكيد مستمرة، وواقي الشمس اللي مع البكج هدية خياااال وخفيف للميك أب.. الله يسعدكم على هالتركيبة الفخمة 🙏🏼',
          sender: 'client',
          time: '11:42 ص'
        }
      ]
    },
    {
      id: 'mock-2',
      type: 'certificate' as const,
      title: 'شهادة مطابقة وتوصية علمية',
      certNo: 'TR-DRT-90823',
      authority: 'جمعية الجلدية والتجميل لجامعة إيجة التركية',
      stamps: ['مُصادق عليه كيميائياً 🔬', 'ببتيدات ذهب نقية 🏆', 'أمان سريري 100% 🩺'],
      text: 'بناءً على الفحوصات الطبية وعينات الفحص السريري المعتمدة، نؤكد أن روتين دكتور تاجي (Dr. Tagy Skin Routine) بما يحتويه من ببتيدات كولاجين الذهب والبيوتين المزدوج وغسول الطحالب الزرقاء يعيد بناء ألياف البشرة طبيعياً ويعد آمناً وخالياً بالكامل من البارابين والزيوت المفرطة وموصى به لعلاج تصبغات وتجاعيد الوجه والرقبة.'
    },
    {
      id: 'mock-3',
      type: 'whatsapp' as const,
      sender: 'فاطمة الحربي (عميلة موثقة)',
      time: '04:15 م',
      avatarLetter: 'ف',
      chatBubbles: [
        {
          text: 'هلا حبيبتي طلبت البكج المتكامل عشان سيروم الرموش وغسول الطحالب الشافي، والله العظيم رموشي صارت كثيفة وطويلة والكل يسألني وش مسوية لرموشك! 😍',
          sender: 'client',
          time: '04:12 م'
        },
        {
          text: 'يا هلا بكِ يا غالية! مركب البيوتين المزدوج العضوي يغذي البصيلات من الجذور. تتهنين بالجمال الطبيعي الفاتن 🌸',
          sender: 'support',
          time: '04:14 م'
        }
      ]
    }
  ];

  const handleReviewUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const newUploaded = [...uploadedReviews, base64String];
        setUploadedReviews(newUploaded);
        localStorage.setItem('dr_tagy_uploaded_reviews', JSON.stringify(newUploaded));
        setActiveReviewIndex(newUploaded.length + mockReviewSlides.length - 1); // Select the newly uploaded item
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReviewDelete = (indexToDelete: number) => {
    const uploadedIndex = indexToDelete - mockReviewSlides.length;
    if (uploadedIndex >= 0 && uploadedIndex < uploadedReviews.length) {
      const newUploaded = uploadedReviews.filter((_, i) => i !== uploadedIndex);
      setUploadedReviews(newUploaded);
      localStorage.setItem('dr_tagy_uploaded_reviews', JSON.stringify(newUploaded));
      setActiveReviewIndex(prev => Math.max(0, Math.min(prev, newUploaded.length + mockReviewSlides.length - 1)));
    }
  };
  
  // Checkout Form States
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<Order | null>(null);

  // Social Proof State (Live notifications ticker)
  const [activeNotification, setActiveNotification] = useState<{
    name: string;
    city: string;
    product: string;
    time: string;
  } | null>(null);

  // Orders Admin Panel for review
  const [savedOrders, setSavedOrders] = useState<Order[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(false);

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
  const citiesList = ['إسطنبول', 'أنقرة', 'إزمير', 'بورصة', 'أنطاليا', 'غازي عنتاب', 'أضنة', 'مرسين', 'قونية', 'طرابزون', 'يالوفا', 'سامسون', 'سكاريا', 'أورفة'];
  const boughtProducts = [
    'البكج العلاجي المتكامل والواقي المجاني',
    'البكج العلاجي المتكامل والواقي المجاني', 
    'كريم دكتور تاجي الفاخر 6 في 1',
    'سيروم الرموش المكثف Eyeluxe',
    'غسول الطحالب البحرية المنقي'
  ];

  // Load orders on startup
  useEffect(() => {
    const orders = localStorage.getItem('dr_tagy_orders');
    if (orders) {
      try {
        const parsed: Order[] = JSON.parse(orders);
        const uniqueOrders: Order[] = [];
        const seenIds = new Set<string>();
        parsed.forEach((ord) => {
          let targetId = ord.id;
          if (!targetId) {
            targetId = 'TAGY-' + Math.floor(Math.random() * 90000 + 10000);
          }
          let finalId = targetId;
          let tracker = 1;
          while (seenIds.has(finalId)) {
            finalId = `${targetId}-${tracker}`;
            tracker++;
          }
          seenIds.add(finalId);
          uniqueOrders.push({
            ...ord,
            id: finalId
          });
        });
        setSavedOrders(uniqueOrders);
        localStorage.setItem('dr_tagy_orders', JSON.stringify(uniqueOrders));
      } catch (e) {
        console.error("Error reading saved orders", e);
      }
    }
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

  // Calculated Order Totals
  const selectedProductObj = products.find(p => p.id === selectedSingleProductId) || products[0];
  const totalPrice = selectedOffer === 'bundle'
    ? 2050 * bundleQuantity
    : (selectedProductObj.price * singleQuantity) + 160;

  // Form submit handler
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || !city.trim()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const orderId = 'TAGY-' + Math.floor(Math.random() * 90000 + 10000);
      const finalAddress = address.trim() || 'سيتم تأكيد العنوان بالكامل وموعد التسليم عبر الواتس آب';
      const productName = selectedOffer === 'single' ? selectedProductObj.name : 'البكج العلاجي المتكامل (4 في 1)';
      const quantity = selectedOffer === 'bundle' ? bundleQuantity : singleQuantity;

      const newOrder: Order = {
        id: orderId,
        fullName,
        phone,
        city,
        address: finalAddress,
        selectedOffer,
        selectedProductId: selectedOffer === 'single' ? selectedSingleProductId : undefined,
        selectedProductName: productName,
        quantity,
        totalPrice: totalPrice,
        createdAt: new Date().toLocaleString('ar-SA'),
        status: 'new'
      };

      const updatedOrders = [newOrder, ...savedOrders];
      setSavedOrders(updatedOrders);
      localStorage.setItem('dr_tagy_orders', JSON.stringify(updatedOrders));

      setIsSubmitting(false);
      setOrderSuccess(newOrder);

      // Scroll to checkout success screen
      document.getElementById('checkout-card')?.scrollIntoView({ behavior: 'smooth' });

      // Build WhatsApp message and open immediately
      const messageText = `📦 *طلب حجز منتجات دكتور تاجي (تركيا)*
----------------------------------
🆔 *كود الحجز:* ${orderId}
👤 *الاسم:* ${fullName}
📞 *رقم الجوال:* ${phone}
📍 *الولاية:* ${city}
🗺️ *العنوان:* ${finalAddress}
----------------------------------
🛍️ *الطلب:* ${productName}
🔢 *الكمية:* ${quantity} طرد
💰 *المستحق عند الاستلام للباب:* ${totalPrice} TL
🚚 *الشحن:* ${selectedOffer === 'bundle' ? 'مجاني ومبرد بالكامل 🎁' : '160 TL (شحن لمنتج منفرد)'}
----------------------------------
💬 *أرجو تأكيد هذا الطلب والبدء بالشحن الفوري.*`;

      const encodedText = encodeURIComponent(messageText);
      const waUrl = `https://wa.me/905511584123?text=${encodedText}`;

      // Gracefully attempt automatic redirect
      try {
        window.open(waUrl, '_blank');
      } catch (err) {
        console.log('Popup blocked, standard button is available on UI.', err);
      }
    }, 1200);
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
    const updated = savedOrders.filter(o => o.id !== id);
    setSavedOrders(updated);
    localStorage.setItem('dr_tagy_orders', JSON.stringify(updated));
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
    localStorage.setItem('dr_tagy_orders', JSON.stringify(updated));
    setEditingOrderId(null);
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = savedOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setSavedOrders(updated);
    localStorage.setItem('dr_tagy_orders', JSON.stringify(updated));
  };

  // Admin search, filter and sort states
  const [adminSearch, setAdminSearch] = useState<string>('');
  const [adminStatusFilter, setAdminStatusFilter] = useState<string>('all');
  const [adminSortBy, setAdminSortBy] = useState<string>('newest');

  // Statistics Calculations
  const statsTotalCount = savedOrders.length;
  const statsNewCount = savedOrders.filter(o => o.status === 'new' || !o.status).length;
  const statsConfirmedCount = savedOrders.filter(o => o.status === 'confirmed').length;
  const statsPendingCount = savedOrders.filter(o => o.status === 'pending').length;
  const statsCancelledCount = savedOrders.filter(o => o.status === 'cancelled').length;

  // Active Financial Sales (confirmed orders only)
  const statsConfirmedRevenue = savedOrders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Potential Revenue (all orders except cancelled)
  const statsPotentialRevenue = savedOrders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  // Total Packages Sold (confirmed orders only)
  const statsConfirmedQuantity = savedOrders
    .filter(o => o.status === 'confirmed')
    .reduce((sum, o) => sum + (o.quantity || 1), 0);

  // Confirmation/Conversion Rate
  const statsConfirmationRate = statsTotalCount > 0 
    ? Math.round((statsConfirmedCount / statsTotalCount) * 100) 
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
          const s = ord.status || 'new';
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
    return (
      <div className="min-h-screen bg-[#F4F2EE] text-[#1D1B19] font-sans text-right pb-16" dir="rtl" id="admin-standalone-page">
        {/* Luxury Admin Page Banner/Header */}
        <header className="bg-gradient-to-r from-[#092B21] via-[#124939] to-[#092B21] text-white border-b border-gold-300/20 py-6 px-4 md:px-8 shadow-xl sticky top-0 z-30">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-gold-400/30 text-gold-300 font-serif font-black text-sm shadow">
                DT
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg md:text-2xl font-black text-[#F7F2EA] tracking-tight">دكتور تاجي (Dr. Tagy Skincare)</h1>
                  <span className="bg-gold-500/15 border border-gold-400/40 text-[10px] text-gold-300 font-extrabold px-2 py-0.5 rounded-full uppercase">المسؤول</span>
                </div>
                <p className="text-xs md:text-sm text-gold-200/85 font-light">لوحة التحكم التفاعلية، تحليل البيانات والمبيعات من مستودع الطلبيات المحلي</p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => {
                  // Generate sample orders if merchant wants to try the platform with data
                  const testOrders: Order[] = [
                    {
                      id: `DT-839201-${Math.floor(1000 + Math.random() * 9000)}`,
                      fullName: "عائشة عبد الله الحربي",
                      phone: "0556677889",
                      city: "إسطنبول",
                      address: "الفاتح - شارع فوزي باشا بناء 42 شقة 10",
                      selectedOffer: "bundle",
                      selectedProductName: "الروتين الثلاثي المصحح بزهور الساكورا والتين الشوكي",
                      quantity: 2,
                      totalPrice: 2800,
                      createdAt: new Date().toLocaleString('ar-SA'),
                      status: "confirmed"
                    },
                    {
                      id: `DT-219405-${Math.floor(1000 + Math.random() * 9000)}`,
                      fullName: "مريم فاروق التركي",
                      phone: "05391234567",
                      city: "أنقرة",
                      address: "تشانكايا - محلة أتاتورك زقاق الياسمين شقة 5",
                      selectedOffer: "bundle",
                      selectedProductName: "الروتين الثنائي لنقاء النياسيناميد وتفتيح الأربوتين",
                      quantity: 1,
                      totalPrice: 1300,
                      createdAt: new Date().toLocaleString('ar-SA'),
                      status: "pending"
                    },
                    {
                      id: `DT-773129-${Math.floor(1000 + Math.random() * 9000)}`,
                      fullName: "فاطمة أحمد الغامدي",
                      phone: "0554321987",
                      city: "بورصة",
                      address: "نيلوفر - شارع كوروغان مجمع النخيل فيلا 2",
                      selectedOffer: "bundle",
                      selectedProductName: "الروتين الطبي الفاخر للتجاعيد العميقة والترطيب",
                      quantity: 1,
                      totalPrice: 1950,
                      createdAt: new Date().toLocaleString('ar-SA'),
                      status: "new"
                    },
                    {
                      id: `DT-442110-${Math.floor(1000 + Math.random() * 9000)}`,
                      fullName: "منى عيسى السبيعي",
                      phone: "0561234567",
                      city: "غازي عنتاب",
                      address: "شاهين بيه - جادة الجامعات بناء الوفاق الطابق 3",
                      selectedOffer: "bundle",
                      selectedProductName: "الروتين الثلاثي المصحح بزهور الساكورا والتين الشوكي",
                      quantity: 1,
                      totalPrice: 1650,
                      createdAt: new Date().toLocaleString('ar-SA'),
                      status: "cancelled"
                    }
                  ];
                  setSavedOrders([...savedOrders, ...testOrders]);
                  localStorage.setItem('dr_tagy_orders', JSON.stringify([...savedOrders, ...testOrders]));
                }}
                className="bg-white/10 hover:bg-white/20 text-gold-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-gold-400/20 transition-all cursor-pointer flex items-center gap-1.5"
                title="توليد عينات حقيقية للتجريب الفوري"
                id="generate-mock-orders-btn"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>شحن طلبات تجريبية ✨</span>
              </button>

              <button 
                onClick={() => setShowAdminPanel(false)}
                className="bg-gold-500 hover:bg-gold-600 text-[#092B21] font-black text-xs py-2.5 px-5 rounded-xl transition-all shadow-md shadow-black/10 flex items-center gap-1.5 cursor-pointer hover:scale-[1.01]"
                id="close-admin-standalone-btn"
              >
                <span>العودة للمتجر 🏪</span>
              </button>
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
                <span className="text-xs text-neutral-500 font-extrabold">العائد المالي الفعلي (التأكيدات)</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-650">
                  <Coins className="w-5 h-5 animate-pulse" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl md:text-3xl font-black text-[#092B21] tracking-tight">{statsConfirmedRevenue} TL</span>
                <p className="text-[10px] text-neutral-450 mt-1 font-light">تم احتسابه من إجمالي مبيعات البكجات المؤكدة فقط</p>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">العائد المالي المتوقع (شامل المعلق):</span>
                <span className="font-bold text-[#aa843f]">{statsPotentialRevenue} TL</span>
              </div>
            </div>

            {/* KPI 2 : Confirmation Rate & Packages */}
            <div className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold-50 rounded-bl-full -z-10 opacity-60"></div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 font-extrabold">معدل تأكيد الطلبيات (COD)</span>
                <div className="w-9 h-9 rounded-xl bg-gold-400/10 flex items-center justify-center text-gold-600">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-2xl md:text-3xl font-black text-[#092B21] tracking-tight">{statsConfirmationRate}%</span>
                <span className="text-xs text-neutral-400 font-light">({statsConfirmedCount} من {statsTotalCount})</span>
              </div>
              <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">مجموع الطرود المؤكدة للشحن:</span>
                <span className="font-bold text-emerald-600">{statsConfirmedQuantity} طرد</span>
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
                <span className="font-bold text-[#092B21]">
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
            <h3 className="text-base font-extrabold text-[#092B21] flex items-center gap-1.5 border-r-4 border-gold-500 pr-3">
              <span>تحليل الطلبات حسب الحالة التشغيلية الفورية</span>
              <span className="text-xs text-neutral-400 font-semibold font-sans">({statsTotalCount} طرد مسجل)</span>
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="order-types-distribution">
              
              {/* Box 1 : New orders */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm text-center relative hover:border-red-400 transition-all">
                <div className="w-3 h-3 rounded-full bg-red-600 absolute top-4 left-4 animate-ping"></div>
                <p className="text-neutral-450 text-xs font-bold mb-1.5 flex items-center justify-center gap-1">
                  <span>الطلبات الجديدة (البداية)</span>
                  <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded-full font-sans font-black">🆕</span>
                </p>
                <span className="text-3xl font-black text-red-600 block font-mono">{statsNewCount}</span>
                <p className="text-[10px] text-neutral-450 mt-2">
                  تمثل <span className="font-bold font-sans">{statsTotalCount > 0 ? Math.round((statsNewCount / statsTotalCount) * 100) : 0}%</span> من إجمالي الطلبات
                </p>
              </div>

              {/* Box 2 : Confirmed orders */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm text-center relative hover:border-green-400 transition-all">
                <p className="text-neutral-450 text-xs font-bold mb-1.5 flex items-center justify-center gap-1">
                  <span>الطلبات المؤكدة والجاهزة</span>
                  <span className="bg-green-100 text-green-800 text-[10px] px-1.5 py-0.5 rounded-full font-sans font-black">✓</span>
                </p>
                <span className="text-3xl font-black text-green-600 block font-mono">{statsConfirmedCount}</span>
                <p className="text-[10px] text-neutral-450 mt-2">
                  تمثل <span className="font-bold font-sans">{statsTotalCount > 0 ? Math.round((statsConfirmedCount / statsTotalCount) * 100) : 0}%</span> ومصدقة لدى شركة المندوب
                </p>
              </div>

              {/* Box 3 : Pending response */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm text-center relative hover:border-amber-400 transition-all">
                <p className="text-neutral-450 text-xs font-bold mb-1.5 flex items-center justify-center gap-1">
                  <span>الطلبات المعلقة والمتابعة</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.5 rounded-full font-sans font-black">⏳</span>
                </p>
                <span className="text-3xl font-black text-amber-500 block font-mono">{statsPendingCount}</span>
                <p className="text-[10px] text-neutral-450 mt-2">
                  تمثل <span className="font-bold font-sans">{statsTotalCount > 0 ? Math.round((statsPendingCount / statsTotalCount) * 100) : 0}%</span> بانتظار معاودة الهاتف
                </p>
              </div>

              {/* Box 4 : Cancelled orders */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm text-center relative hover:border-gray-400 transition-all">
                <p className="text-neutral-450 text-xs font-bold mb-1.5 flex items-center justify-center gap-1">
                  <span>الطلبات المرفوضة والملغية</span>
                  <span className="bg-gray-100 text-gray-800 text-[10px] px-1.5 py-0.5 rounded-full font-sans font-black">✗</span>
                </p>
                <span className="text-3xl font-black text-gray-500 block font-mono">{statsCancelledCount}</span>
                <p className="text-[10px] text-neutral-450 mt-2">
                  تمثل <span className="font-bold font-sans">{statsTotalCount > 0 ? Math.round((statsCancelledCount / statsTotalCount) * 100) : 0}%</span> ملغية برغبة الزبونة
                </p>
              </div>

            </div>

            {/* Custom Multi-colored Stacked Progress Bar */}
            <div className="bg-white border border-neutral-200/50 p-4.5 rounded-2xl shadow-sm space-y-3 font-sans">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-[#092B21]">رسم بياني توزيعي لحالة لجميع الحجوزات المستلمة (Statistics Visualizer)</span>
                <span className="text-[10px] text-neutral-450">تحديث فوري ديناميكي مع كل نقرة ومراجعة</span>
              </div>
              
              {statsTotalCount === 0 ? (
                <div className="h-6 w-full bg-neutral-100 rounded-full text-center text-[10px] text-neutral-400 flex items-center justify-center">
                  لا يتوفر بيانات لبناء المخطط البياني للتحليلات (قومي بالنقر على شحن طلبات تجريبية أعلاه لتفعيلها!)
                </div>
              ) : (
                <div className="space-y-4">
                  {/* The bar track */}
                  <div className="h-4.5 w-full rounded-full overflow-hidden flex shadow-inner">
                    {statsNewCount > 0 && (
                      <div 
                        style={{ width: `${(statsNewCount / statsTotalCount) * 100}%` }} 
                        className="bg-red-500 hover:opacity-90 transition-all relative group cursor-help"
                        title={`جديد: ${statsNewCount}`}
                      ></div>
                    )}
                    {statsConfirmedCount > 0 && (
                      <div 
                        style={{ width: `${(statsConfirmedCount / statsTotalCount) * 100}%` }} 
                        className="bg-green-500 hover:opacity-90 transition-all relative group cursor-help"
                        title={`مؤكد: ${statsConfirmedCount}`}
                      ></div>
                    )}
                    {statsPendingCount > 0 && (
                      <div 
                        style={{ width: `${(statsPendingCount / statsTotalCount) * 100}%` }} 
                        className="bg-amber-400 hover:opacity-90 transition-all relative group cursor-help"
                        title={`معلق: ${statsPendingCount}`}
                      ></div>
                    )}
                    {statsCancelledCount > 0 && (
                      <div 
                        style={{ width: `${(statsCancelledCount / statsTotalCount) * 100}%` }} 
                        className="bg-gray-400 hover:opacity-90 transition-all relative group cursor-help"
                        title={`ملغي: ${statsCancelledCount}`}
                      ></div>
                    )}
                  </div>
                  
                  {/* Legend labels */}
                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] text-neutral-500 pt-1">
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-3 h-3 rounded-md bg-red-500"></span>
                      <span>جديد ({Math.round(statsNewCount / statsTotalCount * 100)}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-3 h-3 rounded-md bg-green-500"></span>
                      <span>مؤكد ومصدق للباب ({Math.round(statsConfirmedCount / statsTotalCount * 100)}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-3 h-3 rounded-md bg-amber-400"></span>
                      <span>معلق للمكالمة ({Math.round(statsPendingCount / statsTotalCount * 100)}%)</span>
                    </span>
                    <span className="flex items-center gap-1.5 font-bold">
                      <span className="w-3 h-3 rounded-md bg-gray-400"></span>
                      <span>ملغي ومرفوض للتسليم ({Math.round(statsCancelledCount / statsTotalCount * 100)}%)</span>
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Section 3: Advanced Workspace Filtering and Search Options */}
          <div className="bg-white border border-neutral-200/65 rounded-2xl p-5 shadow-sm space-y-4 font-sans text-right">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#092B21] flex items-center gap-1.5">
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
                  className="w-full pr-10 pl-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 focus:bg-white focus:ring-1 focus:ring-[#092B21] focus:border-[#092B21] text-xs font-medium focus:outline-none text-right"
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
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 focus:bg-white text-xs font-extrabold focus:ring-1 focus:ring-[#092B21] focus:outline-none"
                >
                  <option value="all">كل الحالات التشغيلية (All)</option>
                  <option value="new">🆕 الطلبات الجديدة فقط</option>
                  <option value="confirmed">✅ المؤكدة والجاهزة للشحن</option>
                  <option value="pending">⏳ قيد الانتظار والمعاودة</option>
                  <option value="cancelled">❌ الملغية أو المرفوضة</option>
                </select>
              </div>

              {/* Dropdown Sorting */}
              <div className="md:col-span-3">
                <select
                  value={adminSortBy}
                  onChange={(e) => setAdminSortBy(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-200 rounded-xl bg-neutral-50/50 focus:bg-white text-xs font-extrabold focus:ring-1 focus:ring-[#092B21] focus:outline-none"
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
            <h3 className="text-base font-extrabold text-[#092B21] flex items-center gap-1.5 border-r-4 border-[#aa843f] pr-3">
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
                          <span className="font-mono font-black text-[#092B21] text-xs">تعديل معلومات الحجز: {ord.id}</span>
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
                              className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-white text-xs font-semibold text-right"
                            />
                          </div>
                          
                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">رقم جوال المستلمة:</label>
                            <input 
                              type="text" 
                              value={editPhone} 
                              onChange={e => setEditPhone(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-white text-xs font-mono font-bold text-left"
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
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-white text-xs font-semibold text-right"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">العنوان بالتفصيل:</label>
                              <input 
                                type="text" 
                                value={editAddress} 
                                onChange={e => setEditAddress(e.target.value)} 
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-white text-xs font-semibold text-right"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">البكج أو الروتين المختار:</label>
                            <input 
                              type="text" 
                              value={editProductName} 
                              onChange={e => setEditProductName(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-white text-xs font-semibold text-right"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">الكمية:</label>
                              <input 
                                type="number" 
                                value={editQuantity} 
                                onChange={e => setEditQuantity(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-white font-mono font-black text-xs text-center"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">المبلغ المطلوب TL:</label>
                              <input 
                                type="number" 
                                value={editTotalPrice} 
                                onChange={e => setEditTotalPrice(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-xl focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-white font-mono font-black text-xs text-center text-gold-650"
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
                            className="px-5 py-2 bg-[#092B21] hover:bg-gold-600 hover:text-[#092B21] text-white font-black rounded-xl transition-all cursor-pointer shadow hover:scale-[1.01] text-xs"
                          >
                            حفظ 💾
                          </button>
                        </div>
                      </div>
                    );
                  }

                  // Styles & Status Translation mapping
                  let statusBg = 'bg-neutral-50 text-neutral-800 border-neutral-250';
                  let statusLabel = 'حجز جديد';
                  if (ord.status === 'new' || !ord.status) {
                    statusBg = 'bg-red-50 text-red-650 border-red-200/60';
                    statusLabel = 'جديد بانتظار اتصالكِ لتأكيد الطلب 🆕';
                  } else if (ord.status === 'confirmed') {
                    statusBg = 'bg-green-50 text-green-700 border-green-200';
                    statusLabel = 'تم تأكيد الطلب وجاهز فوراً للشحن ✅';
                  } else if (ord.status === 'pending') {
                    statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
                    statusLabel = 'معلق (لم يتم الرد على الهاتف) ⏳';
                  } else if (ord.status === 'cancelled') {
                    statusBg = 'bg-gray-100 text-gray-600 border-gray-300';
                    statusLabel = 'طلب ملغي / مرفوض الشحن ❌';
                  }

                  // Determine glow element for highlighting new orders
                  const isNewOrder = ord.status === 'new' || !ord.status;

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
                        <div className="mt-4 bg-[#F7F2EA]/40 p-4 rounded-xl border border-gold-400/10 space-y-2 font-sans text-xs text-right" dir="rtl">
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
                            <span className="font-bold text-[#092B21]">{ord.city}</span>
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
                            <span className="font-extrabold text-[#092B21] max-w-[130px] truncate text-left" title={ord.selectedProductName}>
                              {ord.selectedProductName}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500">الكمية المسجلة:</span>
                            <span className="font-black text-[#092B21]">{ord.quantity || 1} طرد</span>
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
                          <div className="grid grid-cols-4 gap-1">
                            {(['new', 'confirmed', 'pending', 'cancelled'] as const).map((st) => {
                              let label = '';
                              let buttonStyles = '';
                              if (st === 'new') { label = 'جديد'; buttonStyles = 'bg-red-50 text-red-650 hover:bg-red-100 border border-red-200'; }
                              if (st === 'confirmed') { label = 'تأكيد'; buttonStyles = 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'; }
                              if (st === 'pending') { label = 'انتظار'; buttonStyles = 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'; }
                              if (st === 'cancelled') { label = 'إلغاء'; buttonStyles = 'bg-gray-150 text-gray-700 hover:bg-gray-200 border border-gray-300'; }

                              const isCurrent = (ord.status || 'new') === st;
                              const currentSelected = isCurrent
                                ? st === 'new'
                                  ? 'bg-red-600 border-red-700 text-white font-black scale-[1.02]'
                                  : st === 'confirmed'
                                    ? 'bg-green-600 border-green-700 text-white font-black scale-[1.02]'
                                    : st === 'pending'
                                      ? 'bg-amber-500 border-amber-600 text-white font-black scale-[1.02]'
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
                            className="bg-green-600 hover:bg-green-500 text-white font-black py-2.5 rounded-xl transition-all text-xs flex items-center justify-center gap-1 shadow-sm cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.454L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.328 1.977 13.9 1.023 12.01 1.022c-5.444 0-9.866 4.372-9.87 9.802 0 1.914.5 3.774 1.454 5.376L2.474 21.39l5.173-1.356zM15.53 17.65c-.247-.124-1.462-.72-1.689-.803-.227-.081-.393-.123-.558.124-.166.247-.64.803-.785.967-.145.165-.29.185-.537.061-.247-.123-1.044-.384-1.988-1.226-.735-.656-1.232-1.467-1.376-1.714-.145-.247-.015-.38.109-.503.111-.11.247-.29.37-.433.124-.144.166-.247.248-.412.082-.165.04-.31-.02-.433-.062-.124-.558-1.345-.764-1.84-.2-.487-.402-.42-.558-.428-.145-.007-.31-.008-.475-.008-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.06 0 1.214.887 2.39 1.01 2.555.124.165 1.747 2.664 4.233 3.734.59.255 1.053.407 1.412.52.595.189 1.136.162 1.564.098.477-.071 1.462-.597 1.668-1.173.206-.576.206-1.07.144-1.173-.061-.103-.227-.165-.474-.289z" />
                            </svg>
                            <span>واتساب</span>
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
      <div className="bg-[#092B21] text-[#F7F2EA] py-3 px-4 text-xs md:text-sm font-medium border-b border-gold-400/30 shadow-md relative z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1 flex justify-center items-center gap-2 overflow-hidden h-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tickerIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-1.5 justify-center text-center text-[11px] md:text-xs tracking-wide"
              >
                <Sparkle className="w-3.5 h-3.5 text-gold-300 shrink-0" />
                <span className="font-medium text-gold-100">{announcementSlides[tickerIndex]}</span>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <button 
            onClick={scrollToCheckout} 
            className="hidden sm:inline-flex items-center gap-1 bg-[#d1ba84] hover:bg-[#aa843f] text-[#092B21] hover:text-white px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm shadow-gold-900/10"
            id="cta-top-ticker"
          >
            <Flame className="w-3 h-3 animate-pulse" />
            <span>اقتني العرض فوراٌ</span>
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION BAR (Aesthetic Classy Frosting Block) */}
      <header className="glass-card-light !bg-white/60 backdrop-blur-xl border-b border-[#ebd7be]/30 py-4.5 px-6 md:px-12 flex items-center justify-between z-30 sticky top-0 transition-transform shadow-md">
        
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-gold-300 flex items-center justify-center bg-gradient-to-br from-[#092B21] to-[#124939] shadow-md">
            <span className="text-[#f4edd9] font-serif text-[15px] font-extrabold tracking-widest">DT</span>
          </div>
          <div>
            <span className="text-xl md:text-2xl font-black text-[#092B21] tracking-tight block">دُكتور تَاجي</span>
            <span className="text-[9px] uppercase tracking-widest text-gold-500 block -mt-1.5 font-serif font-bold">DR. TAGY CLINICAL SKINCARE</span>
          </div>
        </div>

        {/* Desktop premium Menu links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-bold uppercase tracking-wider text-[#092B21]/95">
          <a href="#why-us" className="hover:text-gold-500 transition-colors relative group py-1">
            <span>ميزتنا السريرية</span>
            <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#clinical-ritual" className="hover:text-gold-500 transition-colors relative group py-1">
            <span>طقوس الاستخدام</span>
            <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#products-showcase" className="hover:text-gold-500 transition-colors relative group py-1">
            <span>مجموعتنا العلاجية</span>
            <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#reviews" className="hover:text-gold-500 transition-colors relative group py-1">
            <span>أراء الطبيبات</span>
            <span className="absolute bottom-0 right-0 w-0 h-0.5 bg-gold-400 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a 
            href="https://wa.me/905511584123?text=مرحباً دكتور تاجي، أود الحصول على استشارة طبية مجانية بخصوص الروتين العلاجي للبشرة في تركيا"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-700 hover:text-green-600 transition-colors flex items-center gap-1 group py-1 font-extrabold"
            id="nav-whatsapp-lnk"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span>استشارة واتساب</span>
          </a>
        </nav>

        {/* Right Nav Options & Local Storage Orders Admin panel */}
        <div className="flex items-center gap-3.5">
          <button 
            onClick={() => setShowAdminPanel(!showAdminPanel)} 
            className="p-2.5 text-[#092B21] hover:text-gold-500 hover:bg-gold-50/70 rounded-full transition-all relative border border-gold-200/10"
            title="حجوزاتكِ"
            id="orders-admin-btn"
          >
            <ClipboardList className="w-5 h-5" />
            {savedOrders.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white font-sans text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-scale shadow-sm">
                {savedOrders.length}
              </span>
            )}
          </button>

          <button
            onClick={scrollToCheckout}
            className="glass-btn-gold px-5 py-2.5 rounded-full text-xs font-black shadow-md hover:shadow-xl transition-all duration-300"
            id="header-cta"
          >
            حجز البكج الفوري
          </button>
        </div>
      </header>

      {/* 3. HERO & BEAUTY GOAL SELECTOR SECTION */}
      <section className="relative py-12 lg:py-24 px-6 md:px-12 lg:px-24 overflow-hidden bg-gradient-to-b from-[#FCFBF8] via-[#FAF6EF] to-[#FCFBF8]">
        {/* Soft elegant golden glow orbs */}
        <div className="absolute top-1/4 left-10 w-{450px} h-{450px} rounded-full bg-gold-200/15 blur-[120px] -z-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full bg-[#3d6a5c]/8 blur-[130px] -z-10"></div>
        
        {/* Fine background thin elegant ring decorations */}
        <div className="absolute top-10 right-[25%] w-[400px] h-[400px] border border-gold-300/10 rounded-full -z-10 animate-spin-very-slow"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Catchy luxury typography and offer details */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-right">
            
            {/* Top clinical seal indicator */}
            <div className="inline-flex items-center gap-2 glass-card-light !bg-white/40 !border-gold-300/30 px-4.5 py-2 rounded-full text-[#092B21] text-xs font-bold leading-none">
              <Sparkles className="w-4 h-4 text-[#aa843f]" />
              <span>أرقى مختبرات بروتوكول تجميل البشرة الطبي بأوروبا</span>
            </div>

            {/* Main title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#092B21] tracking-tight leading-[1.25]">
              الروتين العلاجي الفاخر لبشرتك.. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-400 to-gold-700 font-serif italic text-3xl md:text-5xl font-light block mt-2 text-right">الآن بفاعلية الذهب السريرية</span>
            </h1>

            {/* Sub description */}
            <p className="text-sm md:text-lg text-[#5A544F] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              مستحضرات دكتور تاجي المصاغة بببتيدات الذهب والبيوتين المزدوج. احصلي على <span className="font-semibold text-[#092B21] underline decoration-gold-400 decoration-2">واقي الشمس الطبي الفاخر SPF50 مجاناً بالكامل</span> عند اختياركِ البكج المتكامل للتجدد والنضارة الفائقة.
            </p>

            {/* Elegant timer countdown framed in fine golden borders */}
            <div className="glass-card-emerald text-[#F7F2EA] p-5.5 rounded-3xl shadow-2xl max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-300/5 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className="text-center sm:text-right relative z-10">
                <span className="text-[10px] text-gold-300 font-extrabold uppercase tracking-widest block">عرض حصري محدود لنهاية اليوم</span>
                <span className="text-xs md:text-sm font-bold text-white block mt-1">تبقى على انتهاء الهدايا المجانية والشحن:</span>
              </div>
              <div className="flex gap-3 text-center font-mono relative z-10">
                <div className="bg-[#124939]/80 px-3.5 py-2.5 rounded-xl border border-gold-300/20 min-w-[62px]">
                  <span className="block text-xl font-bold text-gold-300">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="text-[10px] text-neutral-300 block mt-0.5 font-sans">ثانية</span>
                </div>
                <div className="bg-[#124939]/80 px-3.5 py-2.5 rounded-xl border border-gold-300/20 min-w-[62px]">
                  <span className="block text-xl font-bold text-gold-300">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="text-[10px] text-neutral-300 block mt-0.5 font-sans">دقيقة</span>
                </div>
                <div className="bg-[#124939]/80 px-3.5 py-2.5 rounded-xl border border-gold-300/20 min-w-[62px]">
                  <span className="block text-xl font-bold text-gold-300">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="text-[10px] text-neutral-300 block mt-0.5 font-sans">ساعة</span>
                </div>
              </div>
            </div>

            

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
              <button
                onClick={scrollToCheckout}
                className="w-full sm:w-auto glass-btn-gold liquid-sheen text-[#092B21] font-sans font-black px-8.5 py-4.5 rounded-xl text-md cursor-pointer flex items-center justify-center gap-2.5 shadow-lg active:scale-95"
                id="hero-cta-btn"
              >
                <ShoppingBag className="w-5 h-5 text-[#092B21]" />
                <span>اطلبي البكج العلاجي المتكامل</span>
              </button>
              <a
                href="#clinical-quiz"
                className="w-full sm:w-auto glass-card-light !bg-white/40 border border-[#ebd7be]/40 font-bold px-6.5 py-4.5 rounded-xl text-xs transition-all text-center flex items-center justify-center gap-2 hover:shadow-md"
                id="hero-secondary-btn"
              >
                <span>ابدئي مستشار العناية الذكي</span>
                <ArrowRight className="w-4 h-4 rotate-180 text-[#092B21]" />
              </a>
            </div>

          </div>

          {/* Left Column: Glassmorphic interactive visual card displaying the bundle stack */}
          <div className="lg:col-span-5 relative flex items-center justify-center mt-6 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-100/10 via-gold-200/5 to-transparent rounded-full filter blur-[80px]"></div>
            
            {/* Glowing ring borders */}
            <div className="absolute w-[380px] h-[380px] border border-gold-300/15 rounded-full -z-10 animate-spin-slow"></div>

            {/* Luxury Dynamic WhatsApp Chat & Client Testimonials Showcase Card */}
            <div className="relative glass-card-light liquid-sheen p-5 md:p-6 rounded-[2rem] shadow-2xl !border-gold-300/30 max-w-[420px] w-full flex flex-col justify-between overflow-hidden" id="hero-package-display">
              
              {/* Dynamic status/ribbon header badge */}
              <div className="absolute -top-3.5 -right-3.5 bg-gradient-to-r from-[#092B21] to-[#1a5141] text-white text-[9px] font-black px-4.5 py-1.5 rounded-full shadow-md select-none flex items-center gap-1 border border-gold-400/20 z-10">
                <Sparkles className="w-3 h-3 text-gold-300 shrink-0" />
                <span>أحدث تجارب العميلات والاعتمادات الرسمية 🏆</span>
              </div>

              {/* Slider content view */}
              <div className="min-h-[350px] flex flex-col justify-between group mt-3">
                <AnimatePresence mode="wait">
                  {(() => {
                    const totalSlides = mockReviewSlides.length + uploadedReviews.length;
                    // Guard active index
                    const safeIndex = activeReviewIndex % totalSlides;
                    const isUploaded = safeIndex >= mockReviewSlides.length;
                    const currentSlide = isUploaded
                      ? { id: `uploaded-${safeIndex}`, type: 'uploaded' as const, imageUrl: uploadedReviews[safeIndex - mockReviewSlides.length] }
                      : mockReviewSlides[safeIndex];

                    return (
                      <motion.div
                        key={safeIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex-grow flex flex-col justify-between"
                      >
                        {/* 1. MOCK WHATSAPP SCREEN VIEW */}
                        {currentSlide.type === 'whatsapp' && 'chatBubbles' in currentSlide && (
                          <div className="bg-[#efeae2] rounded-2xl border border-neutral-200 overflow-hidden shadow-inner flex flex-col h-[300px]">
                            {/* WhatsApp Simulated Header Bar */}
                            <div className="bg-[#075E54] text-white px-3 py-2.5 flex items-center justify-between shadow-sm shrink-0">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-200 flex items-center justify-center font-black text-xs border border-gold-400/30">
                                  {currentSlide.avatarLetter}
                                </div>
                                <div className="text-right leading-none">
                                  <span className="text-[11px] font-black block">{currentSlide.sender}</span>
                                  <span className="text-[8px] text-green-300 font-medium block mt-0.5">متصل الآن • تجربة مؤكدة ✅</span>
                                </div>
                              </div>
                              <div className="flex gap-2.5 items-center opacity-80 text-white">
                                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse"></span>
                                <MessageSquare className="w-3.5 h-3.5" />
                              </div>
                            </div>
                            
                            {/* Conversations message stream body */}
                            <div className="p-3 overflow-y-auto space-y-2.5 flex-grow text-[11px] scrollbar-thin select-none">
                              {currentSlide.chatBubbles.map((bubble, bIdx) => {
                                const isClient = bubble.sender === 'client';
                                return (
                                  <div 
                                    key={bIdx}
                                    className={`flex w-full ${isClient ? 'justify-start' : 'justify-end'}`}
                                  >
                                    <div 
                                      className={`max-w-[85%] p-2.5 rounded-xl text-right relative shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
                                        isClient 
                                          ? 'bg-white text-[#202020] rounded-tr-none' 
                                          : 'bg-[#d9fdd3] text-[#202020] rounded-tl-none'
                                      }`}
                                    >
                                      <p className="leading-relaxed font-normal">{bubble.text}</p>
                                      <span className="text-[8px] text-gray-400 block text-left mt-1 font-sans leading-none">{bubble.time}</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* 2. MOCK MEDICAL CERTIFICATE VIEW */}
                        {currentSlide.type === 'certificate' && 'title' in currentSlide && (
                          <div className="bg-gradient-to-br from-[#FAF8F5] via-white to-[#F6F1EA] rounded-2xl border-2 border-double border-gold-400/40 p-4 shadow-md flex flex-col justify-between h-[300px] text-center relative overflow-hidden select-none">
                            {/* Watermark logo decoration */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold-500/5 rotate-12 pointer-events-none scale-150">
                              <Award className="w-32 h-32" />
                            </div>

                            <div className="space-y-2.5 shrink-0">
                              <div className="flex justify-between items-center text-[8px] text-gold-700 font-mono">
                                <span>الرقم: {currentSlide.certNo}</span>
                                <Award className="w-4 h-4 text-gold-500" />
                                <span>التاريخ: ٢٠٢٦/٠٣</span>
                              </div>
                              <h4 className="text-xs font-black text-gold-700 font-sans tracking-wide">{currentSlide.title}</h4>
                              <p className="text-[10px] text-neutral-400 leading-none">{currentSlide.authority}</p>
                            </div>

                            <p className="text-[10px] text-neutral-700 leading-relaxed font-light py-2 text-justify px-2 h-[135px] overflow-y-auto">
                              "{currentSlide.text}"
                            </p>

                            <div className="border-t border-gold-300/20 pt-2.5 flex justify-between items-center shrink-0">
                              <div className="flex gap-1">
                                {currentSlide.stamps.map((stamp, sIdx) => (
                                  <span key={sIdx} className="text-[8px] bg-gold-200/10 border border-gold-300/25 text-gold-800 px-1.5 py-0.5 rounded">
                                    {stamp}
                                  </span>
                                ))}
                              </div>
                              <span className="text-[8px] text-neutral-500 font-semibold italic">رؤية طبية سريرية 🩺</span>
                            </div>
                          </div>
                        )}

                        {/* 3. UPLOADED CUSTOM REVIEWS VIEW */}
                        {currentSlide.type === 'uploaded' && 'imageUrl' in currentSlide && (
                          <div className="bg-neutral-50 rounded-2xl border border-neutral-200 overflow-hidden shadow-inner flex flex-col justify-center items-center h-[300px] relative">
                            {currentSlide.imageUrl ? (
                              <img 
                                src={currentSlide.imageUrl} 
                                alt="تجربة عميلة معدلة" 
                                className="w-full h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="text-center p-6 space-y-2 text-neutral-400">
                                <Camera className="w-8 h-8 mx-auto stroke-1" />
                                <span className="text-xs block">الصورة المرفوعة تظهر هنا</span>
                              </div>
                            )}

                            {/* Option to delete uploaded image */}
                            <button
                              onClick={() => handleReviewDelete(safeIndex)}
                              className="absolute bottom-3 left-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                              title="حذف هذه التجربة المرفوعة"
                              id="btn-delete-custom-review"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })()}
                </AnimatePresence>

                {/* Pricing / Promo Banner below showcase */}
                <div className="bg-[#092B21] p-3.5 rounded-xl border border-gold-400/20 flex items-center justify-between text-white shadow-inner mt-4">
                  <div className="text-right">
                    <span className="text-[9px] text-[#A6CDC1] block">مجموعة دكتور تاجي (4 عبوات)</span>
                    <span className="text-[10px] text-neutral-400 font-serif line-through font-light leading-none">2700 TL</span>
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="text-[8px] text-gold-300 font-black bg-[#124939] px-2 py-0.5 rounded block">وفرتِ 650 ليرة تركية</span>
                    <span className="text-md font-black text-white block leading-none">2050 TL</span>
                  </div>
                </div>

                {/* Navigation controls & Image adding */}
                <div className="flex items-center justify-between gap-3 mt-4.5">
                  
                  {/* Slider controls arrow keys */}
                  <div className="flex gap-1.5 items-center justify-start">
                    <button
                      onClick={() => {
                        const total = mockReviewSlides.length + uploadedReviews.length;
                        setActiveReviewIndex(prev => (prev - 1 + total) % total);
                      }}
                      className="w-8 h-8 rounded-full border border-gold-300 bg-white hover:bg-gold-50 text-[#092B21] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                      id="btn-prev-review"
                      title="المراجعة السابقة"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    {/* Tiny dots indicator */}
                    <div className="flex gap-1 px-1">
                      {Array.from({ length: mockReviewSlides.length + uploadedReviews.length }).map((_, dIdx) => (
                        <button
                          key={dIdx}
                          onClick={() => setActiveReviewIndex(dIdx)}
                          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                            activeReviewIndex === dIdx ? 'bg-gold-500 w-3.5' : 'bg-gold-300/40'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const total = mockReviewSlides.length + uploadedReviews.length;
                        setActiveReviewIndex(prev => (prev + 1) % total);
                      }}
                      className="w-8 h-8 rounded-full border border-gold-300 bg-white hover:bg-gold-50 text-[#092B21] flex items-center justify-center transition-all cursor-pointer shadow-sm active:scale-90"
                      id="btn-next-review"
                      title="المراجعة التالية"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Add Experience Image Action */}
                  <div>
                    <label 
                      className="bg-[#092B21] hover:bg-gold-500 text-white hover:text-[#092B21] text-[10px] font-black px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
                      id="btn-upload-review-image"
                    >
                      <Upload className="w-3 h-3 text-gold-400" />
                      <span>إضافة تجربة مصورة 📸</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleReviewUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. PREMIUM SKINS MEDICAL INTEGRITY SIGNALS */}
      <section className="py-16 bg-[#FAFAF6] border-t border-b border-gold-400/10 px-6 md:px-12 relative" id="why-us">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">الابتكار التجميلي المتطور</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#092B21]">لماذا تثقين في تركيبة دكتور تاجي؟</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#7A746E]">
              قمنا بإلغاء التنازلات بتقديم روتين علاجي يجمع بين المكونات السريرية فائقة الأمان وطاقة الذهب التجديدية السريعة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-7">
            
            <div className="glass-card-light p-7 rounded-2xl cursor-default transition-all text-center hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-gold-500/10 text-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#092B21] mb-2 font-sans">تراخيص طبية معتمدة</h3>
              <p className="text-xs text-[#736D67] leading-relaxed">
                مستحضرات مسجلة رسمياً وخاضعة لجميع الفحوصات الطبية لمطابقة أرفع المعايير.
              </p>
            </div>

            <div className="glass-card-light p-7 rounded-2xl cursor-default transition-all text-center hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-gold-500/10 text-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#092B21] mb-2 font-sans">فائقة الأمان للبشرة</h3>
              <p className="text-xs text-[#736D67] leading-relaxed">
                خالٍ من البارابين، السيليكون والمحسسات والمواد البترولية. لطيف ومجرب كلياً للعيون والجلد الحساس.
              </p>
            </div>

            <div className="glass-card-light p-7 rounded-2xl cursor-default transition-all text-center hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-gold-500/10 text-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#092B21] mb-2 font-sans">خلاصة طاقة طبيعية</h3>
              <p className="text-xs text-[#736D67] leading-relaxed">
                تكامل تام بوجود خلاصة الطحالب البحرية وجذور السيكا ونبات البابونج النقي لتهدئة حاجز الجلد.
              </p>
            </div>

            <div className="glass-card-light p-7 rounded-2xl cursor-default transition-all text-center hover:shadow-xl hover:-translate-y-1 duration-300">
              <div className="w-12 h-12 bg-gold-500/10 text-gold-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#092B21] mb-2 font-sans">تأثير ملموس قياسي</h3>
              <p className="text-xs text-[#736D67] leading-relaxed">
                نتائج ملحوظة وعلاجية في شد البشرة، إخفاء الخطوط التعبيرية وتطويل الرموش خلال ١٤ إلى ٢١ يوماً بانتظام.
              </p>
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
                <span>الاستشارة الطبية الفورية</span>
              </div>
              <h3 className="text-xl md:text-3xl font-black text-[#092B21]">مستشار دكتور تاجي الذكي للبشرة</h3>
              <p className="text-xs text-[#706B65] font-light">أجيبي عن سؤالين سريعاً لمعرفة ريفيرنس البرمجية الأكثر مواءمة لنوع بشرتكِ!</p>
            </div>

            {/* Quiz Progress step indicator bar */}
            <div className="flex items-center justify-center gap-2 mb-8 max-w-xs mx-auto text-xs">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${quizStep >= 1 ? 'bg-[#092B21] text-white' : 'bg-neutral-100 text-neutral-400'}`}>1</span>
              <span className={`w-12 h-0.5 ${quizStep >= 2 ? 'bg-[#092B21]' : 'bg-neutral-100'}`}></span>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${quizStep >= 2 ? 'bg-[#092B21] text-white' : 'bg-neutral-100 text-neutral-400'}`}>2</span>
              <span className={`w-12 h-0.5 ${quizStep >= 3 ? 'bg-[#092B21]' : 'bg-neutral-100'}`}></span>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold font-mono ${quizStep >= 3 ? 'bg-[#092B21] text-white' : 'bg-neutral-100 text-neutral-400'}`}>3</span>
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
                  <h4 className="text-sm md:text-base font-bold text-[#092B21]">الخطوة الأولى: ما هو طبيعة ملمس وطبيعة بشرتك الحالية؟</h4>
                  <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
                    {[
                      { key: 'oily', title: 'دهنية أو مختلطة (لمعان وبثور)', desc: 'تحتاج موازنة وتطهير عميق' },
                      { key: 'dry', title: 'جافة أو خشنة (قشور وضيق)', desc: 'تحتاج ترطيب كولاجيني مكثف' },
                      { key: 'normal', title: 'عادية ومتوازنة الملمس', desc: 'تحتاج حماية وتجديد يومي' },
                      { key: 'sensitive', title: 'رقيقة وحساسة جداً للحرارة', desc: 'تحتاج حماية سنتيلا مهدئة' }
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
                        <span className="block text-xs md:text-sm font-bold text-[#092B21]">{type.title}</span>
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
                  <h4 className="text-sm md:text-base font-bold text-[#092B21]">الخطوة الثانية: ما هي المعضلة الأهم المطلوب تغييرها الفتر الحالية للوجه؟</h4>
                  <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
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
                        <span className="block text-xs md:text-sm font-bold text-[#092B21]">{concern.title}</span>
                        <span className="block text-[10px] text-gray-500 font-light mt-0.5">{concern.desc}</span>
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setQuizStep(1)} 
                    className="text-xs font-bold text-gray-400 hover:text-[#092B21] underline block bg-none cursor-pointer"
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
                    <h4 className="text-base md:text-lg font-black text-[#092B21]">تم تشخيص وتحليل البشرة بنجاح!</h4>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto">
                      بناءً على اختيارك لبشرة <span className="font-bold text-gold-600">({quizSkinType})</span> واهتمامك برئيسي <span className="font-bold text-gold-600">({quizMainConcern})</span>، نقترح عليك روتينكِ التالي:
                    </p>
                  </div>

                  {/* Diagnosed match recommendation box */}
                  <div className="bg-gradient-to-b from-[#FCFBF8] to-[#FAF6EF] p-5.5 rounded-3xl border border-gold-400/20 max-w-md mx-auto text-right space-y-4 shadow-sm">
                    <div className="flex gap-3 justify-start items-center">
                      <div className="w-10 h-10 rounded-full bg-gold-400/10 text-gold-600 flex items-center justify-center font-bold">✓</div>
                      <div>
                        <span className="text-[10px] text-[#aa843f] font-extrabold uppercase block font-serif">THE CLINICAL MATCH</span>
                        <span className="text-sm font-bold text-[#092B21] block">مجموعة بروتوكول دكتور تاجي المتكاملة</span>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-[#6A645D] leading-relaxed">
                      البكج يبدأ بـ <span className="font-bold text-[#092B21]">غسول الطحالب</span> للتنظيف العميق وموازنة الإفرازات، ثم تطبيق <span className="font-bold text-[#092B21]">كريم 6 في 1</span> بببتيدات الذهب لشد وتجديد البشرة، بمرور <span className="font-bold text-[#092B21]">سيروم الرموش المكثف</span>، وأخيراً <span className="font-bold text-red-600">واقي الشمس المهدي لكِ مجاناً</span> كجزء مدمج من باقة التوفير.
                    </p>

                    <div className="flex items-center justify-between border-t border-gold-400/15 pt-3.5 mt-2">
                      <div>
                        <span className="text-[10px] text-gray-400 block line-through">2700 TL</span>
                        <span className="text-lg font-bold text-[#092B21]">2050 TL (عرض مدمج)</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          selectRecommendation(true);
                          setQuizStep(1);
                        }}
                        className="bg-[#092B21] hover:bg-gold-500 text-white hover:text-[#092B21] text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                        id="recommended-quiz-match-btn"
                      >
                        أضيفي الروتين للصندوق
                      </button>
                    </div>

                    <div className="pt-3 border-t border-dashed border-neutral-200 text-center text-[11px] text-neutral-500">
                      أو تفضلي بطلب استشارة طبية مخصصة بحالتكِ:
                      <a 
                        href={`https://wa.me/905511584123?text=أهلاً دكتور تاجي، قمت بتشخيص بشرتي عبر المستشار الذكي ونتيجتي هي بشرة (${quizSkinType}) واهتمامي هو (${quizMainConcern})، أود استشارة الأخصائية مجاناً`}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-green-700 hover:text-green-600 font-black flex items-center justify-center gap-1 mt-1 text-xs"
                      >
                        <span>💬 استمري بالاستشارة الطبية الفورية عبر واتساب</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-4 justify-center items-center pt-2">
                    <button 
                      onClick={() => setQuizStep(1)}
                      className="text-xs font-bold text-gray-400 hover:text-gold-600 cursor-pointer underline"
                    >
                      إعادة التحليل من جديد
                    </button>
                    <span className="text-gray-300">|</span>
                    <button 
                      onClick={() => {
                        // Recommend cleanser only for single item
                        selectRecommendation(false, 'dr-cleanser');
                        setQuizStep(1);
                      }}
                      className="text-xs font-bold text-gray-400 hover:text-[#092B21] cursor-pointer underline"
                    >
                      أريد غسول الطحالب منفردة فقط
                    </button>
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
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">طقوس العناية السريرية</span>
            <h2 className="text-2xl md:text-5xl font-black text-[#092B21]">كيف تطبقين مجموعة دكتور تاجي اليومية؟</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#706B65] font-light">
              لتحقيق أقصى إشراقة وتصحيح كامل لعيوب البشرة، ابتكرنا هذا التسلسل الصباحي والمسائي السلس.
            </p>
          </div>

          {/* Time protocol switcher buttons */}
          <div className="flex justify-center mb-12">
            <div className="glass-card-light border border-gold-300/30 p-1.5 rounded-full flex gap-1 max-w-xs w-full shadow-md z-10">
              <button
                onClick={() => setProtocolTime('morning')}
                className={`flex-1 py-3 text-center rounded-full text-xs font-bold transition-all transition-transform active:scale-95 cursor-pointer ${protocolTime === 'morning' ? 'glass-btn-dark text-white shadow-lg' : 'text-gray-500 hover:text-[#092B21]'}`}
              >
                🌞 الطقوس الصباحية
              </button>
              <button
                onClick={() => setProtocolTime('evening')}
                className={`flex-1 py-3 text-center rounded-full text-xs font-bold transition-all transition-transform active:scale-95 cursor-pointer ${protocolTime === 'evening' ? 'glass-btn-dark text-white shadow-lg' : 'text-gray-500 hover:text-[#092B21]'}`}
              >
                🌙 الطقوس المسائية
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
                <div className="glass-card-light p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">STEP 01 — 7:00 AM</span>
                    <h3 className="text-base font-bold text-[#092B21] mt-1">تطهير المسام بغسول الطحالب</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      دلكي رغوة غسول الطحالب المنقي بلطف لتنشيط الدورة الدموية الدقيقة بالوجه وإيقاظ ملمس البشرة بلانتعاش، ثم اغسلي بالماء الفاتر لتنظيف عميق يزيل شوائب الليل.
                    </p>
                  </div>
                  <span className="inline-block bg-[#092B21]/5 text-[#092B21] text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: صقل المسام والتحييد الدهني
                  </span>
                </div>

                {/* Morning Step 2 */}
                <div className="glass-card-light p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">STEP 02 — 7:05 AM</span>
                    <h3 className="text-base font-bold text-[#092B21] mt-1">ترميم نضارة الجلد بكريم 6 في 1</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      بعد تجفيف الوجه، ركزي على دورتين لثوانٍ بتدليك كريم دكتور تاجي الفاخر بحركات دائرية لأعلى. تعمل ببتيدات الذهب والكولاجين على الاحتفاظ بالمكونات النشطة وشد البشرة الفوري لليوم.
                    </p>
                  </div>
                  <span className="inline-block bg-[#092B21]/5 text-[#092B21] text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: شد، مرونة وتغذية جزيئية
                  </span>
                </div>

                {/* Morning Step 3 */}
                <div className="glass-card-light p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">STEP 03 — 7:15 AM</span>
                    <h3 className="text-base font-bold text-[#092B21] mt-1">حماية فائقة بواقي شمس SPF50</h3>
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
                <div className="glass-card-light p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">STEP 01 — 9:00 PM</span>
                    <h3 className="text-base font-bold text-[#092B21] mt-1">إزالة الأتربة والرواسب الجوية بالغسول</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      نظّفي خلايا بشرة من آثار التلوث وغبار اليوم وبواقي واقي الشمس. يعمل حمض الساليسيليك على تفكيك التراكمات داخل بصيلات الخلايا برقة وبدون تجفيف.
                    </p>
                  </div>
                  <span className="inline-block bg-[#092B21]/5 text-[#092B21] text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: تهيئة جزيئية لامتصاص الليل
                  </span>
                </div>

                {/* Evening Step 2 */}
                <div className="glass-card-light p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">STEP 02 — 9:05 PM</span>
                    <h3 className="text-base font-bold text-[#092B21] mt-1">تكثيف الرموش بسيروم Eyeluxe</h3>
                    <p className="text-xs text-neutral-500 mt-2 leading-relaxed font-light">
                      بخط قلم دقيق، مرري سيروم تطويل الرموش على جذور رموشك وبصيلات الحاجبين الخاملة. ببتيدات البيوتين المزدوجة تقوم بتسريع تغذية الجذور بشكل مضاعف خلال فترات النوم الإمبراطورية.
                    </p>
                  </div>
                  <span className="inline-block bg-[#092B21]/5 text-[#092B21] text-[11px] font-bold px-3 py-1 rounded-full self-start">
                    الهدف: تطويل زائد وتكثيف الفراغات طبيعياً
                  </span>
                </div>

                {/* Evening Step 3 */}
                <div className="glass-card-light p-6.5 rounded-3xl flex flex-col justify-between space-y-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div>
                    <span className="text-[10px] text-gold-500 font-extrabold uppercase tracking-widest block font-mono">STEP 03 — 9:15 PM</span>
                    <h3 className="text-base font-bold text-[#092B21] mt-1">تطبيق كريم ببتيدات الذهب الليلي</h3>
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
            <h2 className="text-3xl md:text-5xl font-black text-[#092B21]">البروتوكول الفردي الراقي</h2>
            <div className="w-20 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#706B65] font-light leading-relaxed">
              استكشفي تفاصيل المكونات الطبية والفعالية العلاجية لكل مستحضر من مكونات دكتور تاجي المصاغة بدقة فائقة.
            </p>
          </div>

          <div className="space-y-16 md:space-y-24 mt-12 text-right">
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
                      className={`flex flex-col lg:flex-row ${isEven ? '' : 'lg:flex-row-reverse'} gap-10 lg:gap-16 items-center glass-card-light p-6 md:p-12 rounded-[32px] !border-gold-300/20 shadow-xl relative overflow-hidden group transition-all duration-500 hover:shadow-2xl`}
                      id={`product-row-${p.id}`}
                    >
                      {/* Decorative elements for ultimate luxury */}
                      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-gold-400/15 pointer-events-none rounded-tr-[32px]"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-gold-400/15 pointer-events-none rounded-bl-[32px]"></div>

                      {/* 1. IMAGE DISPLAY CONTAINER (Asymmetric Look) */}
                      <div className="w-full lg:w-5/12 flex flex-col items-center justify-center relative p-6 bg-[#FCFBF8] rounded-2xl border border-gold-200/10 shadow-inner group/img overflow-hidden min-h-[300px] md:min-h-[380px]">
                        {/* Soft gold backing highlight to give 3D product feel */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gold-200/15 blur-3xl pointer-events-none group-hover/img:scale-125 transition-transform duration-1000"></div>
                        
                        {p.id === 'dr-sunscreen' && (
                          <div className="absolute top-4 right-4 bg-red-600 text-white text-[10px] font-black tracking-wide px-3.5 py-1.5 rounded-full z-10 shadow-sm animate-pulse select-none">
                            موهوب مجاناً بالكامل مع البكج 🎁
                          </div>
                        )}

                        <motion.img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-44 h-44 md:w-60 md:h-60 object-cover mix-blend-multiply group-hover/img:scale-105 transition-transform duration-750 relative z-10"
                          referrerPolicy="no-referrer"
                        />

                        {/* Custom visual specifications */}
                        <div className="absolute bottom-4 inset-x-4 flex flex-wrap gap-2 justify-center z-10">
                          <span className="bg-[#092B21]/95 backdrop-blur-sm text-[#F7F2EA] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 border border-gold-400/20">
                            <Award className="w-3 h-3 text-gold-400" />
                            <span>مختبر سريرياً وطبياً</span>
                          </span>
                          <span className="bg-white/95 backdrop-blur-sm text-[#092B21] text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 border border-gold-200/40">
                            <span className="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
                            <span>{p.size}</span>
                          </span>
                        </div>
                      </div>

                      {/* 2. PRODUCT DETAILED INFO PANEL */}
                      <div className="w-full lg:w-7/12 space-y-6 flex flex-col justify-between text-right">
                        <div className="space-y-4">
                          <div className="space-y-1.5">
                            <span className="text-[10px] md:text-xs font-bold text-gold-600 tracking-widest font-serif block uppercase">
                              {p.englishName}
                            </span>
                            <h3 className="text-xl md:text-3xl font-black text-[#092B21] tracking-tight leading-snug">
                              {p.name}
                            </h3>
                          </div>

                          <p className="text-sm md:text-base text-neutral-600 font-light leading-relaxed">
                            {p.detailDescription}
                          </p>

                          {/* Detail Specifications (Active Agents vs Benefit) */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="p-4.5 bg-gold-50/20 border border-gold-300/12 rounded-2xl space-y-1">
                              <span className="text-[11px] font-black text-gold-700 flex items-center gap-1.5 justify-end">
                                <span>المادة الفعالة الرئيسية</span>
                                <Sparkles className="w-4 h-4 text-gold-500 shrink-0" />
                              </span>
                              <p className="text-xs text-neutral-700 leading-relaxed font-semibold">
                                {p.activeSubst}
                              </p>
                            </div>

                            <div className="p-4.5 bg-gold-50/20 border border-gold-300/12 rounded-2xl space-y-1">
                              <span className="text-[11px] font-black text-[#092B21] flex items-center gap-1.5 justify-end">
                                <span>المنفعة الطبية المضمونة</span>
                                <Activity className="w-4 h-4 text-[#092B21] shrink-0" />
                              </span>
                              <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                                {p.benefit}
                              </p>
                            </div>
                          </div>

                          {/* Key Ingredients custom pills layout */}
                          <div className="space-y-2.5 pt-2">
                            <span className="text-xs font-bold text-neutral-800 block">تركيب المكونات الفعالة الدقيقة:</span>
                            <div className="flex flex-wrap gap-1.5 justify-start md:justify-start">
                              {p.ingredients.split('،').map((ingredient, ingIdx) => (
                                <span 
                                  key={ingIdx}
                                  className="text-[11px] font-semibold bg-neutral-50 px-3 py-1.5 rounded-xl text-neutral-700 border border-neutral-100 flex items-center gap-1.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-gold-400"></span>
                                  <span>{ingredient.trim()}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Interactive Buy Module */}
                        <div className="pt-6 border-t border-neutral-100 flex items-center justify-start mt-4">
                          <button
                            onClick={() => {
                              setSelectedOffer('bundle');
                              scrollToCheckout();
                            }}
                            className="w-full sm:w-auto glass-btn-dark liquid-sheen text-white font-sans font-black text-xs md:text-sm px-8 py-3.5 rounded-2xl cursor-pointer flex items-center justify-center gap-2 shadow-md active:scale-95"
                            id={`btn-select-to-buy-${p.id}`}
                          >
                            <ShoppingBag className="w-4.5 h-4.5" />
                            <span>اطلبي الآن</span>
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

      {/* 8. MAIN OFFER CART & ORDER INPUT FORM (صندوق الحجز النهائي) */}
      <section className="py-20 bg-gradient-to-b from-[#FCFBF8] via-[#FAF6EF] to-[#FCFBF8] px-6 md:px-12 lg:px-24" id="checkout-section">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">تأكيد حجز الصندوق</span>
            <h2 className="text-2xl md:text-5xl font-black text-[#092B21]">نموذج الحجز وتفاصيل التوصيل فوري</h2>
            <div className="w-20 h-1 bg-[#aa843f] mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#7A746E]">
              أكدي الطرد مجاناً وسرعة الدفع عند الاستلام بعد التأكد التام من سلامة المنتجات ومطابقتها.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-fade-in" id="checkout-card">
            
            {/* Left Box: Rich live invoice review & trust notes */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="glass-card-light p-6 md:p-8 rounded-[2rem] shadow-xl !border-gold-300/30 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#092B21]"></div>
                
                <h3 className="text-base font-bold text-[#092B21] border-b border-neutral-100 pb-3.5 flex items-center justify-between">
                  <span>فاتورة الحجز والطلبية الخاصة بكِ</span>
                  <ShoppingBag className="w-5 h-5 text-gold-500" />
                </h3>

                {selectedOffer === 'bundle' ? (
                  /* BUNDLE SUMMARY STATS */
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#092B21] text-xs md:text-sm block">البكج العلاجي المتكامل (4 عبوات بخصم اليوم)</span>
                        <span className="text-[10px] text-gray-500 block mt-1 leading-relaxed">غسول طاقة طحالب، كريم الذهب 6في1، سيروم Eyeluxe للرموش</span>
                        <span className="text-[10px] text-red-600 font-extrabold block mt-1 flex items-center gap-1 animate-pulse">
                          <Gift className="w-3.5 h-3.5" />
                          <span>موهوب مجاناً: واقي شمس SPF50 الطبي (75مل)</span>
                        </span>
                      </div>
                      <span className="font-mono text-xs md:text-sm text-[#092B21] font-bold shrink-0">{bundleQuantity} × 2050 TL</span>
                    </div>

                    <div className="bg-[#FAFAF6] p-4 rounded-2xl border border-gold-300/10 space-y-2.5">
                      <div className="flex justify-between text-[11px] text-[#3d6a5c] font-bold">
                        <span>واقي شمس Advanced SPF50:</span>
                        <span className="line-through text-gray-400">650 TL (موهوب 100%)</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-red-600 font-bold">
                        <span>الخصم المجمع للتكامل:</span>
                        <span>- 650 TL (وفرتِ)</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* CUSTOM SINGLE CHOSEN PRODUCT */
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-[#092B21] text-xs md:text-sm block">{selectedProductObj.name}</span>
                        <span className="text-[10px] text-gray-500 block mt-1 font-light">الحجم السايرولوجي: {selectedProductObj.size}</span>
                        <span className="text-[10px] text-[#aa843f] font-bold block mt-1">البصمة الفعالة: {selectedProductObj.activeSubst}</span>
                      </div>
                      <span className="font-mono text-xs md:text-sm text-[#092B21] font-bold shrink-0">{singleQuantity} × {selectedProductObj.price} TL</span>
                    </div>
                  </div>
                )}

                {/* Sub calculations */}
                <div className="space-y-3 pt-4 border-t border-neutral-100 text-xs text-[#6A645D]">
                  <div className="flex justify-between items-center">
                    <span>رسوم الشحن والتسليم المبرّد</span>
                    <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded font-extrabold border border-green-200">مجانـاً</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>رسوم الدفع للباب عند الاستلام (COD)</span>
                    <span className="text-green-700 font-bold">مجانـاً بالكامل</span>
                  </div>
                  
                  {/* Total dynamic frame invoice */}
                  <div className="flex justify-between items-center bg-[#092B21] text-[#F7F2EA] p-4.5 rounded-2xl shadow-inner mt-4 relative">
                    <div>
                      <span className="text-[10px] font-light block opacity-80 leading-none">الإجمالي الكلي للوفاء بالاستلام</span>
                      <span className="text-[9px] text-gold-300 block mt-1">آمن وبدون أي ضرائب مضافة</span>
                    </div>
                    <span className="text-xl md:text-2xl font-black text-white shrink-0">{totalPrice} TL</span>
                  </div>
                </div>

              </div>

              {/* Secure seal components */}
              <div className="bg-[#092B21]/5 border border-gold-300/15 p-5.5 rounded-2xl flex flex-col md:flex-row items-center justify-around gap-4 text-center md:text-right">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-gold-500 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-[#092B21] block">معاينة وفحص الطرد مجاناً</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">افحصي المنتجات بنفسك قبل الدفع للباب</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-gold-300/20 hidden md:block"></div>
                <div className="flex items-center gap-3">
                  <Truck className="w-8 h-8 text-gold-500 shrink-0" />
                  <div>
                    <span className="text-xs font-black text-[#092B21] block">شحن طبي مبرّد وآمن</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">ضمان بقاء مستحضراتكِ بحرارة آمنة</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Box: The Order Input and Selector form (Premium luxury design) */}
            <div className="lg:col-span-7 glass-card-light p-6 md:p-8 rounded-[2rem] shadow-xl !border-gold-300/30 space-y-8">
              
              {orderSuccess ? (
                /* EXTREME SUCCESS PANEL SCREEN */
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-6"
                >
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto border-2 border-green-200 animate-pulse">
                    <Check className="w-8 h-8 font-black" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-black text-[#092B21]">تم تجهيز تفاصيل طلبكِ بنجاح! 🎉</h3>
                    <p className="text-xs text-neutral-600 max-w-md mx-auto font-bold leading-relaxed px-2">
                      باقي خطوة واحدة أخيرة لتأكيد طلبكِ! يرجى نقر الزر الأخضر بالأسفل لإرسال تفاصيل الحجز الفاتورية مباشرة إلى رقمنا على الواتساب، لنبدأ بتجهيز طردكِ وشحنه فوراً للباب.
                    </p>
                  </div>

                  <div className="px-2">
                    <a
                      href={`https://wa.me/905511584123?text=${encodeURIComponent(`📦 *طلب حجز منتجات دكتور تاجي (تركيا)*
----------------------------------
🆔 *كود الحجز:* ${orderSuccess.id}
👤 *الاسم:* ${orderSuccess.fullName}
📞 *رقم الجوال:* ${orderSuccess.phone}
📍 *الولاية:* ${orderSuccess.city}
🗺️ *العنوان:* ${orderSuccess.address}
----------------------------------
🛍️ *الطلب:* ${orderSuccess.selectedProductName}
🔢 *الكمية:* ${orderSuccess.quantity} طرد
💰 *المستحق عند الاستلام للباب:* ${orderSuccess.totalPrice} TL
🚚 *الشحن:* ${orderSuccess.selectedOffer === 'bundle' ? 'مجاني ومبرد بالكامل 🎁' : '160 TL (شحن لمنتج منفرد)'}
----------------------------------
💬 *أرجو تأكيد هذا الطلب والبدء بالشحن الفوري.*`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 hover:bg-green-500 text-white font-sans font-black text-md md:text-lg py-4 px-6 rounded-2xl transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 animate-pulse cursor-pointer text-center"
                      id="btn-whatsapp-send-order"
                    >
                      <svg className="w-6 h-6 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.454L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.328 1.977 13.9 1.023 12.01 1.022c-5.444 0-9.866 4.372-9.87 9.802 0 1.914.5 3.774 1.454 5.376L2.474 21.39l5.173-1.356zM15.53 17.65c-.247-.124-1.462-.72-1.689-.803-.227-.081-.393-.123-.558.124-.166.247-.64.803-.785.967-.145.165-.29.185-.537.061-.247-.123-1.044-.384-1.988-1.226-.735-.656-1.232-1.467-1.376-1.714-.145-.247-.015-.38.109-.503.111-.11.247-.29.37-.433.124-.144.166-.247.248-.412.082-.165.04-.31-.02-.433-.062-.124-.558-1.345-.764-1.84-.2-.487-.402-.42-.558-.428-.145-.007-.31-.008-.475-.008-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.06 0 1.214.887 2.39 1.01 2.555.124.165 1.747 2.664 4.233 3.734.59.255 1.053.407 1.412.52.595.189 1.136.162 1.564.098.477-.071 1.462-.597 1.668-1.173.206-.576.206-1.07.144-1.173-.061-.103-.227-.165-.474-.289z" />
                      </svg>
                      <span>اضغطي هنا لإرسال طلبكِ فوراً عبر واتساب</span>
                    </a>
                  </div>

                  <div className="bg-[#FAFAF6] p-5.5 rounded-2xl border border-gold-300/10 text-right max-w-md mx-auto space-y-3.5 text-xs">
                    <div className="flex justify-between border-b border-dashed border-gold-300/20 pb-2">
                      <span className="text-neutral-500">كود حجز الشحنة:</span>
                      <span className="font-mono font-black text-[#092B21]">{orderSuccess.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">اسم المشتري الكريم:</span>
                      <span className="font-bold text-[#092B21]">{orderSuccess.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">الهاتف المحفوظ:</span>
                      <span className="font-bold text-[#092B21]">{orderSuccess.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">الروتين المحدد:</span>
                      <span className="font-bold text-gold-700">{orderSuccess.selectedProductName} ({orderSuccess.quantity} حبات)</span>
                    </div>
                    <div className="flex justify-between border-t border-gold-400/10 pt-2.5 font-bold text-sm">
                      <span className="text-[#092B21]">المقدار المستحق للباب:</span>
                      <span className="text-[#092B21] underline decoration-gold-400">{orderSuccess.totalPrice} TL</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-green-700 font-bold flex items-center justify-center gap-1 bg-green-50 py-2.5 rounded-xl border border-green-200">
                    <Clock className="w-4 h-4 animate-spin text-green-600" />
                    <span>سنقوم فوراً بتأكيد موعد تسليم طردك وبدء الشحن المبرد بمجرد تلقي رسالتك بالواتساب!</span>
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                    <button
                      onClick={resetForm}
                      className="bg-[#092B21] hover:bg-gold-500 text-white hover:text-[#092B21] font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      طلب بوصفة أو عنوان آخر
                    </button>
                    <button
                      onClick={() => {
                        resetForm();
                        setShowAdminPanel(true);
                      }}
                      className="bg-gold-100 hover:bg-gold-200 text-gold-900 font-bold px-6 py-3 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      مراجعة حجوزاتي المحفوظة
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* CHECKOUT ACTIONS FORM */
                <form onSubmit={handleCheckout} className="space-y-6">
                
                  {/* Step 1: Offer Select */}
                  <div className="space-y-4">
                    <label className="text-xs md:text-sm font-bold text-[#092B21] block flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-[#092B21] text-white flex items-center justify-center text-[11px] font-mono">1</span>
                      <span>حددي عرض الشراء المناسب لكِ:</span>
                    </label>

                    {/* Offer Option A: Dynamic Bundle Card (High conversion) */}
                    <div 
                      onClick={() => setSelectedOffer('bundle')}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                        selectedOffer === 'bundle' 
                          ? 'border-gold-500 bg-gold-50/20' 
                          : 'border-neutral-200 hover:border-gold-300'
                      }`}
                      id="offer-bundle-card"
                    >
                      {/* Floating Ribbon badge on package banner */}
                      <div className="absolute -top-3.5 right-4 bg-[#d1ba84] text-[#092B21] text-[9px] uppercase font-black px-3 py-1 rounded-full shadow-sm leading-none select-none">
                        خيار الأغلبية الساحقة (أكبر توفير مالي بقيمة 650 ليرة)
                      </div>

                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selectedOffer === 'bundle' ? 'border-[#092B21] bg-[#092B21]' : 'border-neutral-300'
                        }`}>
                          {selectedOffer === 'bundle' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                        </div>
                        <div>
                          <span className="text-xs md:text-sm font-black text-[#092B21] block mt-0.5">البكج العلاجي المتكامل (4 عبوات - واقي شمس وشحن مجاني)</span>
                          <span className="text-[10px] text-gray-500 block mt-1 leading-relaxed">الكريم الرموز المزدوج + سيروم الرموش + غسول البحرية + <span className="text-red-600 font-extrabold">واقي شمس SPF50 مجاناً</span></span>
                        </div>
                      </div>

                      <div className="md:text-left shrink-0 leading-none">
                        <span className="text-[10px] text-gray-400 line-through block font-serif">2700 TL</span>
                        <span className="text-md md:text-lg font-black text-[#092B21] block mt-1.5">2050 TL</span>
                        <span className="text-[9px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-md font-bold block mt-1 text-center font-sans">توصيل مجاني</span>
                      </div>
                    </div>

                    {/* Offer Option B: Single item option */}
                    <div 
                      onClick={() => setSelectedOffer('single')}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer space-y-4 ${
                        selectedOffer === 'single' 
                          ? 'border-gold-500 bg-gold-50/20' 
                          : 'border-neutral-200 hover:border-gold-300'
                      }`}
                      id="offer-single-card"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selectedOffer === 'single' ? 'border-[#092B21] bg-[#092B21]' : 'border-neutral-300'
                          }`}>
                            {selectedOffer === 'single' && <div className="w-2 h-2 rounded-full bg-white"></div>}
                          </div>
                          <div>
                            <span className="text-xs md:text-sm font-black text-[#092B21] block">شراء مستحضر منفرد واحد فقط</span>
                            <span className="text-[10px] text-gray-400 font-light block mt-0.5">دون الاستفادة من واقي الشمس المجاني</span>
                            <span className="text-[10px] text-red-600 font-bold block mt-1">تضاف 160 TL قيمة الشحن والتوصيل للمنتج المنفرد</span>
                          </div>
                        </div>
                        {selectedOffer === 'single' && (
                          <span className="text-[10px] font-black text-gold-700 bg-gold-100 px-2.5 py-0.5 rounded-full">مفعّل</span>
                        )}
                      </div>

                      <AnimatePresence>
                        {selectedOffer === 'single' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pt-3 border-t border-neutral-100 space-y-3 overflow-hidden"
                            onClick={(e) => e.stopPropagation()} 
                          >
                            <label className="text-[10px] text-gray-400 font-bold block">حددي المستحضر المطلوب لشرائه وحده:</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {products.map((p) => (
                                <div 
                                  key={p.id}
                                  onClick={() => setSelectedSingleProductId(p.id)}
                                  className={`p-2 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                                    selectedSingleProductId === p.id 
                                      ? 'border-[#092B21] bg-[#092B21]/5 font-bold' 
                                      : 'border-neutral-200 hover:border-neutral-300'
                                  }`}
                                  id={`quick-choose-${p.id}`}
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    <img src={p.image} className="w-8 h-8 rounded-lg object-cover bg-neutral-150 shrink-0" referrerPolicy="no-referrer" />
                                    <span className="truncate">{p.name.replace('دكتور تاجي ', '')}</span>
                                  </div>
                                  <span className="text-[#092B21] shrink-0">{p.price} TL</span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>

                  {/* Step 2: Quantity adjustments */}
                  <div className="bg-[#FAF7F2] p-4.5 rounded-2xl flex items-center justify-between border border-gold-300/10">
                    <label className="text-xs font-bold text-[#092B21] flex items-center gap-1">
                      <span className="w-5 h-5 rounded-full bg-[#092B21] text-white flex items-center justify-center text-[11px] font-mono">2</span>
                      <span>حددي كمية العبوات:</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <button 
                        type="button"
                        onClick={() => {
                          if (selectedOffer === 'bundle') {
                            if (bundleQuantity > 1) setBundleQuantity(bundleQuantity - 1);
                          } else {
                            if (singleQuantity > 1) setSingleQuantity(singleQuantity - 1);
                          }
                        }}
                        className="w-8.5 h-8.5 bg-white border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer"
                        id="qty-minus"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono font-bold text-md text-[#092B21] w-5 text-center">
                        {selectedOffer === 'bundle' ? bundleQuantity : singleQuantity}
                      </span>
                      <button 
                        type="button"
                        onClick={() => {
                          if (selectedOffer === 'bundle') {
                            setBundleQuantity(bundleQuantity + 1);
                          } else {
                            setSingleQuantity(singleQuantity + 1);
                          }
                        }}
                        className="w-8.5 h-8.5 bg-white border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-50 transition-colors cursor-pointer"
                        id="qty-plus"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Step 3: Address & Info details */}
                  <div className="space-y-4">
                    <label className="text-xs md:text-sm font-bold text-[#092B21] block flex items-center gap-1.5 border-b border-gold-300/10 pb-2">
                      <span className="w-5 h-5 rounded-full bg-[#092B21] text-white flex items-center justify-center text-[11px] font-mono">3</span>
                      <span>أدخلي معلومات التواصل لتجهيز طردكِ العلاجي:</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold block">الاسم بالكامل:</label>
                        <input 
                          type="text" 
                          required 
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="مثال: ياسمين يلماز"
                          className="w-full p-3.5 rounded-xl glass-input text-xs md:text-sm text-right bg-white/40"
                          id="input-name"
                        />
                      </div>

                      {/* Phone input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold block">رقم جوال الواتساب لتأكيد الشحن:</label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            required 
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="05321234567"
                            pattern="05[0-9]{9}"
                            className="w-full p-3.5 pl-12 rounded-xl glass-input text-xs md:text-sm font-mono text-right bg-white/40"
                            id="input-phone"
                          />
                          <Smartphone className="w-4 h-4 text-neutral-300 absolute left-4 top-4" />
                        </div>
                        <span className="text-[8px] text-gray-400 block mt-0.5">يرجى إدخال جوال تركي يبدأ بـ 05 ويتكون من 11 رقماً</span>
                      </div>

                      {/* City state selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold block">الولاية التركية تحديداً:</label>
                        <select 
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full p-3.5 rounded-xl glass-input text-xs md:text-sm text-right bg-white/40 cursor-pointer text-[#092B21] font-bold"
                          id="input-city"
                        >
                          <option value="" className="text-neutral-800">-- اختر الولاية --</option>
                          {citiesList.map(c => <option key={c} value={c} className="text-neutral-800">{c}</option>)}
                          <option value="ولاية أخرى" className="text-neutral-800">ولاية أخرى داخل الجمهورية التركية</option>
                        </select>
                      </div>

                      {/* Address input */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-bold block">العنوان بالتفصيل (اسم الحي والشارع - اختياري):</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="مثال: الفاتح، بجانب مترو الأمنيات (أو اتركيه لتأكيده بالواتس آب)"
                            className="w-full p-3.5 pr-10 rounded-xl glass-input text-xs md:text-sm text-right bg-white/40"
                            id="input-address"
                          />
                          <MapPin className="w-4 h-4 text-[#092B21] absolute right-3.5 top-4" />
                        </div>
                      </div>

                    </div>

                    <div className="bg-[#FAF6EF] p-3 rounded-xl border border-dashed border-gold-300/30 text-center text-[11px] text-[#A29A93] leading-relaxed">
                      💡 <strong>عمليتنا فائقة السهولة:</strong> بعد كتابة اسمك وجوالك، اضغطي على الزر بالأسفل ليتم إرسال الطلبية تلقائياً إلى رقمنا الرسمي بالواتساب، وسوف نقوم بالتأكيد الفوري معكِ وترتيب موعد وصول الطرد المجاني للباب!
                    </div>

                  </div>

                  {/* Submit CTA action buttons with guaranteed seals */}
                  <div className="space-y-4.5 pt-4.5 border-t border-neutral-100">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full glass-btn-gold liquid-sheen text-[#092B21] font-sans font-black text-md md:text-lg py-4 px-6 rounded-2xl cursor-pointer flex items-center justify-center gap-3 transition-transform active:scale-[0.99] shrink-0 ${
                        isSubmitting ? 'opacity-80 cursor-wait' : ''
                      }`}
                      id="btn-submit-order"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin text-[#092B21]" />
                          <span>جاري مراجعة طلبكِ الطبي وتجهيز الفاتورة...</span>
                        </>
                      ) : (
                        <>
                          <span>أرسلي الطلبية الآن وافتحي واتساب للتأكيد 💬</span>
                          <ArrowRight className="w-5 h-5 rotate-180 text-[#092B21]" />
                        </>
                      )}
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-center text-[10px] text-gray-400 font-medium">
                      <Lock className="w-4 h-4 text-[#3d6a5c]" />
                      <span>بالتأكيد الكلي، معلوماتك آمنة، والشحن يتم بمبردات مخصصة لسلامة المواد الفعالة.</span>
                    </div>
                  </div>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* 9. REVIEWS & TESTIMONIALS (قصص نجاح وإثباتات سريرية) */}
      <section className="py-20 bg-gradient-to-b from-[#FCFBF8] to-[#FAF6EF]" id="reviews">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">أراء موثقة</span>
            <h2 className="text-2xl md:text-5xl font-black text-[#092B21]">نتائج شهود عيان وطبابة حقيقية</h2>
            <div className="w-20 h-1 bg-gold-400 mx-auto rounded-full"></div>
            <p className="text-xs md:text-sm text-[#736D67] font-light">
              عميلات ممتنات وأكاديميات علمية تجميلية يلمسن النقلة النوعية لبشرتهن بدكتور تاجي.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {reviews.map((rev) => (
              <div 
                key={rev.id} 
                className="glass-card-light p-8 rounded-3xl shadow-xl flex flex-col justify-between space-y-6 md:hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
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
                    <span className="text-xs md:text-sm font-black text-[#092B21] block">{rev.author}</span>
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

      {/* 10. FAQS - SYSTEM ACCORDION (الأسئلة الشائعة والاستجابة الطبية) */}
      <section className="py-20 bg-[#FCFBF8] px-6 md:px-12 lg:px-24 border-t border-[#ebd7be]/30">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold tracking-widest text-[#aa843f] uppercase block">المعلومات الدقيقة</span>
            <h2 className="text-2xl md:text-4xl font-black text-[#092B21]">الأسئلة الشائعة وسير الفعالية الموصى بها</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div 
                  key={index} 
                  className="glass-card-light rounded-2xl shadow-sm overflow-hidden transition-all duration-300"
                  id={`faq-item-${index}`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 md:p-6 text-right flex items-center justify-between font-bold text-[#092B21] text-xs md:text-sm hover:bg-gold-50/15 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gold-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 md:p-6 pt-0 border-t border-neutral-55 text-xs text-[#5D5751] leading-relaxed font-light">
                          {faq.answer}
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

      {/* 11. ELITE LUXURIOUS FOOTER */}
      <footer className="bg-[#092B21] text-[#F7F2EA] py-16 px-6 md:px-12 lg:px-24 border-t border-gold-400/20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 text-center lg:text-right">
          
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-11 h-11 rounded-full border border-gold-400 flex items-center justify-center bg-white/5 shadow">
                <span className="text-[#f4edd9] font-serif text-[15px] font-extrabold tracking-wider">DT</span>
              </div>
              <div>
                <span className="text-lg md:text-xl font-black text-white block">دُكتور تَاجي</span>
                <span className="text-[8px] text-gold-400 block -mt-1 font-serif tracking-widest font-black">DR. TAGY CLINICAL SKINCARE</span>
              </div>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed font-light max-w-sm mx-auto lg:mx-0">
              دكتور تاجي هي علامة طبية تجميلية ريادية تسعى لاستعادة شباب وصحة حاجز البشرة والرموش بصيغ الذهب الكولاجينية الثنائية المتفوقة. معتمدة سريرياً، ومصممة بدقة لنشاط آمن ومستدام للوجه.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-4.5 text-xs text-gray-400">
            <h4 className="text-xs font-bold text-white tracking-widest font-serif block uppercase text-gold-300">الدعم والتوزيع المركزي في تركيا</h4>
            <div className="space-y-2 font-light">
              <p>📍 المقر المركزي: الفاتح، إسطنبول، الجمهورية التركية</p>
              <p>📧 الدعم والأبحاث: support@drtagy-beauty.online</p>
              <p>💬 استفسارات الروتين الطبية واتساب: +90 551 158 4123</p>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-4 text-xs text-gray-400 font-light">
            <h4 className="text-xs font-bold text-white tracking-widest font-serif block uppercase text-gold-300">شفافية وتنويهات معملية</h4>
            <p className="leading-relaxed">
              * جميع النتائج فردية ومبنية على الروتين الشخصي الملتزم الكافي بالبشرة ونوعية العناية المتوفرة ومستويات الغذاء المتكامل. جميع منتجاتنا معتمدة ومطابقة كلياً للتراخيص الدولية.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-[10px] text-[#A29A93] space-y-2">
          <p>© {new Date().getFullYear()} دكتور تاجي (Dr. Tagy Skincare) - جميع الحقوق محفوظة كلياً.</p>
          <p className="opacity-60 text-[9px] font-light">تم تطبيقه بمقاييس الفخامة الطبية العالية لبروتوكول صفحات الهبوط فائقة التحول والتحسين التجميلي.</p>
          <div className="pt-2 flex justify-center">
            <button 
              onClick={() => setShowAdminPanel(true)} 
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gold-300 text-[10px] uppercase tracking-wider font-extrabold rounded-lg border border-gold-400/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:border-gold-300"
              id="footer-admin-toggle-btn"
            >
              <ClipboardList className="w-3.5 h-3.5 text-gold-300" />
              <span>لوحة التحكم وتأكيد الطلبيات (المسؤول)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 12. FLOATING REAL-TIME SOCIAL PROOF TOAST TICKER */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 10 }}
            className="fixed bottom-6 left-6 z-55 bg-white/95 backdrop-blur-xl border border-gold-300/40 p-4.5 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-[340px] w-full"
            id="floating-sales-notifier"
          >
            <div className="w-10 h-10 rounded-full bg-[#092B21] shrink-0 flex items-center justify-center border border-gold-400/30 text-gold-400 font-serif font-black text-xs shadow">
              DT
            </div>
            <div className="text-right space-y-0.5">
              <span className="text-[11px] font-extrabold text-[#092B21] block">
                {activeNotification.name} من {activeNotification.city}
              </span>
              <span className="text-xs text-[#5D5751] block font-light leading-relaxed">
                حجزت للتو: <span className="font-bold text-gold-700">{activeNotification.product}</span>
              </span>
              <span className="text-[9px] text-[#A29A93] block font-mono">{activeNotification.time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING WHATSAPP CONSULTATION WIDGET */}
      <div className="fixed bottom-6 right-6 z-55">
        <a 
          href="https://wa.me/905511584123?text=مرحباً دكتور تاجي، أود الحصول على استشارة طبية مجانية بخصوص الروتين العلاجي للبشرة في تركيا"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-500 text-white p-3.5 rounded-full shadow-2xl flex items-center justify-center gap-2 group transition-all duration-300 hover:scale-105 active:scale-95 border border-[#1d5c3f] relative"
          id="whatsapp-floating-widget"
          title="💬 استشارة واتساب مباشرة"
        >
          {/* Pulsing indicator */}
          <span className="absolute -top-1 -left-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center border border-white animate-pulse"></span>
          
          <span className="text-xs font-bold font-sans max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-500 ease-in-out whitespace-nowrap block">
            استشارة واتساب طبية مجانية
          </span>
          
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.454L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.328 1.977 13.9 1.023 12.01 1.022c-5.444 0-9.866 4.372-9.87 9.802 0 1.914.5 3.774 1.454 5.376L2.474 21.39l5.173-1.356zM15.53 17.65c-.247-.124-1.462-.72-1.689-.803-.227-.081-.393-.123-.558.124-.166.247-.64.803-.785.967-.145.165-.29.185-.537.061-.247-.123-1.044-.384-1.988-1.226-.735-.656-1.232-1.467-1.376-1.714-.145-.247-.015-.38.109-.503.111-.11.247-.29.37-.433.124-.144.166-.247.248-.412.082-.165.04-.31-.02-.433-.062-.124-.558-1.345-.764-1.84-.2-.487-.402-.42-.558-.428-.145-.007-.31-.008-.475-.008-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.06 0 1.214.887 2.39 1.01 2.555.124.165 1.747 2.664 4.233 3.734.59.255 1.053.407 1.412.52.595.189 1.136.162 1.564.098.477-.071 1.462-.597 1.668-1.173.206-.576.206-1.07.144-1.173-.061-.103-.227-.165-.474-.289z" />
          </svg>
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
                  <h3 className="text-base md:text-xl font-black text-[#092B21]">{activeModalProduct.name}</h3>
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
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto flex-grow text-right">
                
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-5 aspect-square rounded-2xl bg-[#FCFBF8] border border-gold-300/10 flex items-center justify-center p-4 overflow-hidden">
                    <img 
                      src={activeModalProduct.image} 
                      alt={activeModalProduct.name} 
                      className="w-full max-h-[180px] object-cover mix-blend-multiply" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="sm:col-span-7 space-y-3.5 text-right">
                    <span className="inline-block bg-gold-400/10 text-gold-800 text-[10px] font-bold px-3 py-1 rounded-full border border-gold-400/20">
                      حجم العبوة: {activeModalProduct.size}
                    </span>
                    <div className="text-[#3d6a5c] font-bold text-xs flex items-center gap-1.5 justify-start">
                      <Sparkle className="w-4 h-4 text-gold-500" />
                      <span>الصيغة الفعالة: {activeModalProduct.activeSubst}</span>
                    </div>
                    <p className="text-xs md:text-sm text-[#5D5751] leading-relaxed font-light">
                      {activeModalProduct.detailDescription}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-5 border-t border-neutral-100">
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-[#092B21] flex items-center gap-1.5 justify-start">
                      <Check className="w-4 h-4 text-gold-500" />
                      <span>المزايا العلاجية للمستحضر:</span>
                    </h4>
                    <p className="text-xs text-[#6A645D] leading-relaxed font-light pr-5">
                      {activeModalProduct.benefit}
                    </p>
                  </div>

                  <div className="space-y-1 pt-2">
                    <h4 className="text-xs font-extrabold text-[#092B21] flex items-center gap-1.5 justify-start">
                      <Check className="w-4 h-4 text-gold-500" />
                      <span>كامل المكونات الطبية للتركيبة:</span>
                    </h4>
                    <p className="text-xs text-[#6A645D] leading-relaxed font-light pr-5 bg-[#FCFBF8] p-3 rounded-xl border border-gold-300/5">
                      {activeModalProduct.ingredients}
                    </p>
                  </div>
                </div>

              </div>

              {/* Action buttons inside Modal bottom footer */}
              <div className="p-5 bg-[#FAF6EF]/50 border-t border-gold-300/10 flex items-center justify-between sticky bottom-0">
                <div>
                  <span className="text-[10px] text-gray-500 block leading-none font-light">سعر العبوة المنفردة شامل الضريبة</span>
                  <span className="text-md md:text-lg font-black text-[#092B21] block mt-1">{activeModalProduct.price} TL</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setActiveModalProduct(null)}
                    className="bg-white border border-neutral-200 hover:bg-neutral-50 text-[#092B21] text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
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
                    className="bg-[#092B21] hover:bg-gold-500 text-white hover:text-[#092B21] text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-sm active:scale-95"
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
            <div className="p-5 bg-gradient-to-r from-[#092B21] to-[#124939] text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gold-300" />
                <div>
                  <h3 className="font-black text-sm md:text-base">لوحة تأكيد حجز الطلبيات (المحلية)</h3>
                  <span className="text-[10px] text-gold-300 block -mt-1 font-serif">COD Admin Order Management Dashboard</span>
                </div>
              </div>
              <button 
                onClick={() => setShowAdminPanel(false)}
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
                          <span className="font-mono font-bold text-[#092B21] text-sm">تعديل معلومات الحجز: {ord.id}</span>
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
                              className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-neutral-50/50"
                            />
                          </div>
                          
                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">رقم الجوال:</label>
                            <input 
                              type="tel" 
                              value={editPhone} 
                              onChange={e => setEditPhone(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-neutral-50/50 text-left font-mono"
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
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-neutral-50/50"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">العنوان بالتفصيل:</label>
                              <input 
                                type="text" 
                                value={editAddress} 
                                onChange={e => setEditAddress(e.target.value)} 
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-neutral-50/50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] text-neutral-500 block font-bold mb-1">الروتين/المنتج المطلوب:</label>
                            <input 
                              type="text" 
                              value={editProductName} 
                              onChange={e => setEditProductName(e.target.value)} 
                              className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-neutral-50/50"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">الكمية:</label>
                              <input 
                                type="number" 
                                value={editQuantity} 
                                onChange={e => setEditQuantity(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-neutral-50/50 font-mono"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-neutral-500 block font-bold mb-1">المستحق (TL):</label>
                              <input 
                                type="number" 
                                value={editTotalPrice} 
                                onChange={e => setEditTotalPrice(Number(e.target.value))} 
                                className="w-full p-2.5 border border-neutral-200 rounded-lg focus:border-[#092B21] focus:outline-none focus:ring-1 focus:ring-[#092B21] bg-neutral-50/50 font-mono"
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
                  let statusBg = 'bg-neutral-50 text-neutral-800 border-neutral-250';
                  let statusLabel = 'جديد';
                  if (ord.status === 'new' || !ord.status) {
                    statusBg = 'bg-red-50 text-red-700 border-red-200';
                    statusLabel = 'جديد (بانتظار التأكيد) 🆕';
                  } else if (ord.status === 'confirmed') {
                    statusBg = 'bg-green-50 text-green-700 border-green-200';
                    statusLabel = 'تم التأكيد بنجاح ✅';
                  } else if (ord.status === 'pending') {
                    statusBg = 'bg-amber-50 text-amber-700 border-amber-200';
                    statusLabel = 'قيد الانتظار ⏳';
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
                        <p className="leading-relaxed"><strong className="font-extrabold text-[#092B21]">الاسم:</strong> <span className="text-neutral-800 font-medium">{ord.fullName}</span></p>
                        <p className="leading-relaxed"><strong className="font-extrabold text-[#092B21]">الجوال:</strong> <span className="text-neutral-800 font-mono font-bold" dir="ltr">{ord.phone}</span></p>
                        <p className="leading-relaxed"><strong className="font-extrabold text-[#092B21]">الولاية:</strong> <span className="text-neutral-800 font-medium">{ord.city}</span></p>
                        <p className="leading-relaxed"><strong className="font-extrabold text-[#092B21]">العنوان:</strong> <span className="text-neutral-800 font-light truncate block" title={ord.address}>{ord.address}</span></p>
                      </div>

                      {/* Items Details */}
                      <div className="bg-white p-3 rounded-xl border border-neutral-105 space-y-1.5 shadow-sm font-sans">
                        <p className="flex justify-between"><strong className="font-bold text-neutral-550">الطلب المطلوب:</strong> <span className="font-extrabold text-[#092B21]">{ord.selectedProductName}</span></p>
                        <p className="flex justify-between"><strong className="font-bold text-neutral-550">الكمية:</strong> <span className="font-black text-[#092B21]">{ord.quantity} طرد</span></p>
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
                            {(['new', 'confirmed', 'pending', 'cancelled'] as const).map((st) => {
                              let label = '';
                              let buttonTheme = '';
                              if (st === 'new') { label = 'جديد'; buttonTheme = 'bg-red-50 text-red-650 border border-red-200 hover:bg-red-100'; }
                              if (st === 'confirmed') { label = 'تأكيد'; buttonTheme = 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'; }
                              if (st === 'pending') { label = 'انتظار'; buttonTheme = 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'; }
                              if (st === 'cancelled') { label = 'إلغاء'; buttonTheme = 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'; }

                              const isCurrent = (ord.status || 'new') === st;
                              const activeStyles = isCurrent 
                                ? st === 'new' 
                                  ? 'bg-red-600 text-white font-extrabold border border-red-700 scale-[1.03]' 
                                  : st === 'confirmed' 
                                    ? 'bg-green-600 text-white font-extrabold border border-green-700 scale-[1.03]'
                                    : st === 'pending'
                                      ? 'bg-amber-500 text-white font-extrabold border border-amber-600 scale-[1.03]'
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
                            className="bg-neutral-55 hover:bg-neutral-100 text-[#092B21] border border-neutral-200 font-extrabold py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer text-[11px]"
                          >
                            <span>تعديل التفاصيل</span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => contactCustomerWhatsApp(ord)}
                            className="bg-green-600 hover:bg-green-500 text-white font-black py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer text-[11px]"
                          >
                            <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.454L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.625 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.328 1.977 13.9 1.023 12.01 1.022c-5.444 0-9.866 4.372-9.87 9.802 0 1.914.5 3.774 1.454 5.376L2.474 21.39l5.173-1.356zM15.53 17.65c-.247-.124-1.462-.72-1.689-.803-.227-.081-.393-.123-.558.124-.166.247-.64.803-.785.967-.145.165-.29.185-.537.061-.247-.123-1.044-.384-1.988-1.226-.735-.656-1.232-1.467-1.376-1.714-.145-.247-.015-.38.109-.503.111-.11.247-.29.37-.433.124-.144.166-.247.248-.412.082-.165.04-.31-.02-.433-.062-.124-.558-1.345-.764-1.84-.2-.487-.402-.42-.558-.428-.145-.007-.31-.008-.475-.008-.165 0-.433.062-.66.309-.227.247-.866.845-.866 2.06 0 1.214.887 2.39 1.01 2.555.124.165 1.747 2.664 4.233 3.734.59.255 1.053.407 1.412.52.595.189 1.136.162 1.564.098.477-.071 1.462-.597 1.668-1.173.206-.576.206-1.07.144-1.173-.061-.103-.227-.165-.474-.289z" />
                            </svg>
                            <span>تواصل واتساب</span>
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
                onClick={() => setShowAdminPanel(false)}
                className="bg-[#092B21] hover:bg-[#092B21]/90 text-white font-bold py-3 px-4 rounded-xl transition-colors flex-1 text-center cursor-pointer"
              >
                إغلاق اللوحة
              </button>
            </div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
