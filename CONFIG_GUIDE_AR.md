# 🎨 دليل استخدام البورتفليو الجديد

## ✨ ماذا تغير؟

تم تحويل البورتفليو إلى نظام **data-driven** ✅  
الآن كل البيانات في ملف واحد اسمه: **`portfolio-config.json`**

---

## 📍 موقع الملفات الرئيسية

```
src/shared/data/
├── portfolio-config.json     ⭐ الملف الوحيد الذي تعدله
├── config-loader.js          (يقرأ البيانات تلقائياً)
├── projects-data.js          (يحمل المشاريع من JSON)
├── skills-data.js            (يحمل المهارات من JSON)
├── experience-data.js        (يحمل الخبرات من JSON)
└── general-data.js           (يحمل البيانات العامة من JSON)
```

---

## 🚀 كيفية العمل

### 1️⃣ إضافة مشروع جديد

افتح: `src/shared/data/portfolio-config.json`

ابحث عن قسم `"projects"` وأضف هذا الكود:

```json
{
  "id": 4,
  "title": "اسم المشروع",
  "shortDescription": "وصف قصير جداً",
  "longDescription": [
    "السطر الأول من الوصف",
    "السطر الثاني",
    "السطر الثالث"
  ],
  "coverImage": "src/assets/images/your-image.png",
  "detailImages": ["src/assets/images/detail.png"],
  "tags": ["Flutter", "Firebase"],
  "githubUrl": "https://github.com/...",
  "liveUrl": "https://..."
}
```

✅ **جاهز!** سيظهر المشروع تلقائياً

---

### 2️⃣ حذف مشروع

افتح `portfolio-config.json`، ابحث عن المشروع، واحذف الكائن كله.

```json
❌ احذف هذا:
{
  "id": 1,
  "title": "Tasketi",
  ...
}
```

✅ **تم!** سيختفي المشروع

---

### 3️⃣ تعديل مشروع موجود

مثلاً تريد تغيير اسم المشروع:

```json
// قبل:
"title": "Tasketi",

// بعد:
"title": "Tasketi - Advanced Edition",
```

✅ **تحديث فوري!**

---

### 4️⃣ إضافة مهارة جديدة

افتح `portfolio-config.json` وابحث عن `"skills"`:

```json
{
  "id": 10,
  "name": "اسم المهارة",
  "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/...",
  "type": "url"
}
```

أو استخدم صورة محلية:
```json
{
  "id": 10,
  "name": "React",
  "icon": "src/assets/images/icons/react.png",
  "type": "local"
}
```

---

### 5️⃣ تعديل البيانات العامة

افتح `portfolio-config.json` وعدّل قسم `"general"`:

```json
{
  "general": {
    "heroName": "اسمك هنا",
    "subtitle": "تخصصك هنا",
    "aboutText": "نص عنك",
    "profilePicture": "src/assets/images/your-photo.jpg",
    "stats": {
      "projectsCount": 5,        // عدد المشاريع
      "yearsExperience": 2,      // سنوات الخبرة
      "happyClients": 10         // عدد العملاء
    },
    "contact": {
      "location": "القاهرة، مصر",
      "phone": "+20 ...",
      "email": "your@email.com",
      "linkedin": "https://..."
    },
    "socialLinks": {
      "github": "https://github.com/...",
      "linkedin": "https://linkedin.com/...",
      "facebook": "https://facebook.com/...",
      "whatsapp": "https://wa.me/..."
    }
  }
}
```

---

### 6️⃣ إضافة خبرة جديدة

افتح `portfolio-config.json` وابحث عن `"experiences"`:

```json
{
  "company": "اسم الشركة",
  "logo": "src/assets/images/logos/company.jpg",
  "location": "المكان",
  "role": "منصبك",
  "period": "من - إلى",
  "tasks": [
    "المهمة الأولى",
    "المهمة الثانية",
    "المهمة الثالثة"
  ]
}
```

---

## ⚠️ قواعد مهمة

✅ **افعل:**
- احفظ الملف JSON بصيغة صحيحة (استخدم VS Code)
- استخدم الفواصل (,) بين العناصر
- استخدم علامات الاقتباس بشكل صحيح

❌ **لا تفعل:**
- لا تحذف الأقواس { }
- لا تنسَ الفواصل بين الحقول
- لا تعدّل ملفات الـ JS الأخرى

---

## 🧪 كيفية الاختبار

1. عدّل شيء في `portfolio-config.json`
2. احفظ الملف
3. أعد تحميل الصفحة في المتصفح (F5)
4. ستشوف التغييرات فوراً! ✨

---

## ❓ أسئلة شائعة

**س: عدد المشاريع يتغير تلقائياً؟**
ج: نعم! الموقع يعد الإحصائيات من البيانات الفعلية

**س: ماذا لو حصل خطأ في JSON؟**
ج: تحقق من الأقواس والفواصل واستخدم JSON Formatter

**س: هل يمكنني استخدام صور بصيغ مختلفة؟**
ج: نعم، استخدم .jpg, .png, .webp, إلخ

---

## 🎯 الخلاصة

```
عدّل portfolio-config.json
        ↓
احفظ الملف
        ↓
أعد التحميل (F5)
        ↓
شوف التغييرات مباشرة ✨
```

**إنت الآن تتحكم بـ 100% من البيانات دون ما تكتب كود واحد!** 🚀

---

## 📞 إذا واجهت مشكلة

1. تحقق من صحة JSON (استخدم jsonlint.com)
2. تأكد من أن جميع المسارات صحيحة
3. افتح Developer Tools (F12) وشوف الأخطاء في Console
