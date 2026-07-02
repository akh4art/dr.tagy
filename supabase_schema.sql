-- =====================================================
-- Dr. Tagy Database Schema + Initial Data
-- انسخ هذا كله والصقه في Supabase → SQL Editor → Run
-- =====================================================

-- 1. جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  english_name TEXT,
  description TEXT,
  detail_description TEXT,
  ingredients TEXT,
  benefit TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  image_url TEXT,
  size TEXT,
  active_subst TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. جدول الطلبات
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT,
  selected_offer TEXT CHECK (selected_offer IN ('bundle','single')) DEFAULT 'bundle',
  selected_product_id TEXT,
  selected_product_name TEXT,
  quantity INTEGER DEFAULT 1,
  total_price NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending','preparing','shipped','delivered','cancelled')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. جدول التقييمات
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  author TEXT NOT NULL,
  city TEXT,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5) DEFAULT 5,
  review_date TEXT,
  review_text TEXT,
  avatar_url TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. جدول الصور المرفوعة
CREATE TABLE IF NOT EXISTS uploaded_review_images (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- تفعيل Row Level Security
-- =====================================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploaded_review_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- سياسات الوصول (RLS Policies)
-- =====================================================

-- products: قراءة عامة + إضافة
CREATE POLICY "products_public_read" ON products FOR SELECT USING (true);
CREATE POLICY "products_anon_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_anon_update" ON products FOR UPDATE USING (true);

-- orders: 
--   - anon: can only INSERT (submit new orders) and SELECT (for admin/status check)
--   - UPDATE/DELETE: requires service_role (admin via backend) 
--   - Admin panel updates go through a Supabase Edge Function or service_role client
CREATE POLICY "orders_anon_select" ON orders FOR SELECT USING (true);
CREATE POLICY "orders_anon_insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "orders_service_update" ON orders FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "orders_service_delete" ON orders FOR DELETE USING (auth.role() = 'service_role');

-- reviews: قراءة + إضافة
CREATE POLICY "reviews_public_read" ON reviews FOR SELECT USING (true);
CREATE POLICY "reviews_anon_insert" ON reviews FOR INSERT WITH CHECK (true);

-- uploaded_review_images: قراءة + إضافة + حذف
CREATE POLICY "images_public_read" ON uploaded_review_images FOR SELECT USING (true);
CREATE POLICY "images_anon_insert" ON uploaded_review_images FOR INSERT WITH CHECK (true);
CREATE POLICY "images_anon_delete" ON uploaded_review_images FOR DELETE USING (true);

-- =====================================================
-- بيانات المنتجات الأربعة
-- =====================================================
INSERT INTO products (id, name, english_name, description, detail_description, ingredients, benefit, price, original_price, size, active_subst)
VALUES
  (
    'dr-cream-6in1',
    'كريم دكتور تاجي الفاخر 6 في 1',
    'Dr. Tagy Luxury 6-in-1 Face Cream',
    'تركيبة سريرية فاخرة تمنح بشرتك امتلاءً فورياً، تغذي حاجزها الطبيعي، وتعيد لها شبابها ونضارتها في 15 يوماً.',
    'كريم فاخر تم ابتكاره بالتعاون مع أطباء الجلدية ليحل محل 6 مستحضرات متفرقة. يمنح بشرتك امتلاءً دائمياً مشدوداً بفعل ببتيدات الذهب وجزيئات الكولاجين الدقيقة.',
    'كولاجين بحري متحلل، حمض الهيالورونيك، نياسيناميد نقي 5%، ببتيدات الذهب الدقيقة، زبدة الشيا العضوية، وفيتامين E النشط.',
    'امتلاء فوري للبشرة، ملء التجاعيد الدقيقة والخطوط التعبيرية حول العينين والفم.',
    900, 1500, '50 مل', 'الببتيدات الذهبية والكولاجين الثنائي'
  ),
  (
    'dr-sunscreen',
    'واقي شمس علاجي حماية فائقة SPF 50+',
    'Dr. Tagy Advanced Sunscreen SPF50+',
    'درع طبي حريري فاخر يضمن حماية خلايا البشرة من الأشعة فوق البنفسجية ويمنع التصبغات مع تغذية استثنائية.',
    'واقي شمس علاجي متقدم متناهي الخفة، يمتزج بالبشرة ليمدها بحماية قصوى من UVA/UVB دون لمعان أو أثر أبيض.',
    'مستخلص نبات السنتيلا (سيكا)، فيلانترول فيزيائي آمن، مضادات أكسدة نشطة، فيتامين C، وحمض الهيالورونيك.',
    'حماية كاملة من التجاعيد والتصبغات الناتجة عن الشمس بنسبة 98%، تهدئة فورية للبشرة المتهيجة.',
    650, 1100, '75 مل', 'سنتيلا أسياتيكا ومضادات الأكسدة الذكية'
  ),
  (
    'dr-eyeluxe',
    'سيروم الرموش المكثف Eyeluxe',
    'Dr. Tagy Eyeluxe Intensive Lash Serum',
    'سيروم علاجي مبتكر لتطويل وتكثيف الرموش وتعزيز قوة بصيلات الحواجب لجمال طبيعي ساحر وآمن.',
    'سيروم طبي متطور بمزيج رائع من مركب الببتيد الثنائي النشط والبيوتين. يتغلغل في جذور الرموش ليحفز نموها خلال 15 يوماً.',
    'مركب الببتيد الثنائي النشط، البيوتين المغذي للشعر، مستخلص جذر الجنسنج الكوري، بانثينول (بروفيتامين B5).',
    'زيادة واضحة في طول وكثافة الرموش بنسبة تصل إلى 85%، مقاومة للتساقط والتكسر.',
    550, 1000, '8 مل', 'الببتيد والبيوتين المزدوج المغذي للبصيلة'
  ),
  (
    'dr-cleanser',
    'غسول الطحالب البحرية المنقي والمنعش',
    'Dr. Tagy Seaweed Purifying Cleanser',
    'غسول طبي لطيف ينشط خلايا البشرة، يزيل السموم والشوائب بعمق ويستعيد ملمس الجلد الحريري المتوازن.',
    'غسول رغوي فاخر متوازن الحموضة (pH 5.5) ينبع من طاقة الطحالب البحرية العميقة. ينظف المسامات بعمق بلطف تام وبدون تجفيف.',
    'مستخلص الطحالب البحرية العميقة الطازجة، ساليسيليك أسيد لطيف 1%، خلاصة البابونج المهدئة، وألوفيرا طبيعية.',
    'تطهير عميق للمسامات، الحد من البثور والدهون الزائدة، مع إضفاء نضارة حريرية فورية.',
    600, 1050, '150 مل', 'مستخلص طحالب خضراء نشطة وحمض ساليسيليك'
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- بيانات التقييمات الأولية
-- =====================================================
INSERT INTO reviews (id, author, city, rating, review_date, review_text, avatar_url, verified)
VALUES
  (
    'rev-1',
    'أروى الأحمد',
    'إسطنبول',
    5,
    'منذ يومين',
    'استخدمت البكج الكامل للعلاج وخاصة غسول الطحالب وكريم الـ 6 في 1 والنتائج تجنن! بشرتي كانت باهتة وجافة، الحين رطبة ومشدودة والخطوط البيراء تحت العين خفت وايد. من جد دكتور تاجي يستحق كل ليرة دفعتها فيه.',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    true
  ),
  (
    'rev-2',
    'أ.د. ياسمين شاهين (أخصائية جلدية والتجميل)',
    'أنقرة',
    5,
    'منذ أسبوع',
    'كوني طبيبة وأخصائية أمراض جلدية هنا في تركيا، درست مكونات منتجات دكتور تاجي بعناية قبل نصيحة المرضى بها. ببتيدات الذهب في كريم 6 في 1 مع الطحالب البحرية بالغسول تشكل فعالية حقيقية مبنية على براهين سريرية.',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150',
    true
  ),
  (
    'rev-3',
    'نورة يلدز',
    'بورصة',
    5,
    'منذ أسبوعين',
    'سيروم الرموش Eyeluxe معجزة! كنت مركب رموش اصطناعية ورموشي الطبيعية طاحت وتدمرت، بعد 3 أسابيع من استخدام السيروم بانتظام والله نبتت رموشي من جديد وطالت بشكل ملحوظ وصارت سوداء وقوية.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    true
  )
ON CONFLICT (id) DO NOTHING;
