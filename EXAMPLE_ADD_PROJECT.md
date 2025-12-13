# 📝 مثال عملي: إضافة مشروع جديد

## الهدف: إضافة مشروع جديد بسيط

---

## الخطوة 1️⃣: افتح الملف

```
📂 src
  └─ 📂 shared
     └─ 📂 data
        └─ 📄 portfolio-config.json  ← افتح هذا الملف
```

---

## الخطوة 2️⃣: ابحث عن قسم `projects`

في الملف، ستجد:

```json
{
  "general": { ... },
  "projects": [     ← أنت هنا
    {
      "id": 1,
      "title": "Tasketi",
      ...
    },
    {
      "id": 2,
      "title": "BMI Calculator",
      ...
    },
    {
      "id": 3,
      "title": "Bookia App",
      ...
    }
  ],
  "skills": [ ... ],
  "experiences": [ ... ]
}
```

---

## الخطوة 3️⃣: أضف مشروع جديد

بعد آخر مشروع، أضف هذا الكود:

```json
    },
    {
      "id": 4,
      "title": "Weather App",
      "shortDescription": "تطبيق الطقس المتقدم مع توقعات دقيقة",
      "longDescription": [
        "تطبيق Flutter متقدم لعرض الطقس",
        "يوفر توقعات الطقس لمدة 7 أيام",
        "يستخدم واجهة برمجية حقيقية",
        "يحفظ المدن المفضلة محلياً"
      ],
      "coverImage": "src/assets/images/weather.png",
      "detailImages": [
        "src/assets/images/weather-1.png",
        "src/assets/images/weather-2.png"
      ],
      "tags": ["Flutter", "REST API", "Weather"],
      "githubUrl": "https://github.com/yourusername/weather-app",
      "liveUrl": "https://demo-weather.com"
    }
```

---

## 🔍 شرح كل حقل:

```json
{
  "id": 4,                          // رقم فريد (يزيد دائماً)
  "title": "Weather App",           // اسم المشروع
  
  "shortDescription":               // وصف قصير (سطر واحد)
    "تطبيق الطقس المتقدم مع توقعات دقيقة",
  
  "longDescription": [              // وصف طويل (عدة نقاط)
    "النقطة الأولى",
    "النقطة الثانية",
    "النقطة الثالثة",
    "النقطة الرابعة"
  ],
  
  "coverImage":                     // صورة غلاف المشروع
    "src/assets/images/weather.png",
  
  "detailImages": [                 // صور تفاصيل إضافية
    "src/assets/images/weather-1.png",
    "src/assets/images/weather-2.png"
  ],
  
  "tags": [                         // وسوم المشروع
    "Flutter",
    "REST API",
    "Weather"
  ],
  
  "githubUrl":                      // رابط GitHub
    "https://github.com/yourusername/weather-app",
  
  "liveUrl":                        // رابط التطبيق الحي
    "https://demo-weather.com"
}
```

---

## ✅ النتيجة النهائية

الملف بعد الإضافة:

```json
{
  "general": { ... },
  "projects": [
    { "id": 1, "title": "Tasketi", ... },
    { "id": 2, "title": "BMI Calculator", ... },
    { "id": 3, "title": "Bookia App", ... },
    {
      "id": 4,
      "title": "Weather App",
      "shortDescription": "...",
      ...
    }
  ],
  "skills": [ ... ],
  "experiences": [ ... ]
}
```

---

## 💾 احفظ الملف

اضغط: **Ctrl + S**

---

## 🌐 شاهد النتيجة

1. افتح الموقع في المتصفح
2. اضغط: **F5** (تحديث الصفحة)
3. اذهب إلى قسم **Projects**
4. شاهد المشروع الجديد! 🎉

---

## ❌ أخطاء شائعة

### ❌ خطأ: نسيان الفاصلة

```json
    {
      "id": 3,
      "title": "Bookia App",
      ...
    }    ← لا تنسَ الفاصلة!
    {
      "id": 4,
      "title": "Weather App",
      ...
    }
```

### ❌ خطأ: أقواس غير متطابقة

```json
❌ خطأ:
"longDescription": [
  "النقطة الأولى",
  "النقطة الثانية"
]  ← يجب أن تكون }

✅ صحيح:
"longDescription": [
  "النقطة الأولى",
  "النقطة الثانية"
],  ← صحيح
```

### ❌ خطأ: نسيان علامات الاقتباس

```json
❌ خطأ:
{
  id: 4,  ← بدون أسياف
  title: Weather App  ← بدون أسياف
}

✅ صحيح:
{
  "id": 4,  ← مع أسياف
  "title": "Weather App"  ← مع أسياف
}
```

---

## 🧪 تحقق من صحة JSON

### الطريقة 1: استخدام VS Code

```
كليك يمين على الملف → Format Document
```

### الطريقة 2: استخدام أداة أونلاين

اذهب إلى: https://jsonlint.com

انسخ محتوى الملف والصقه هناك

---

## 🎯 الخلاصة

```
1. افتح portfolio-config.json
   ↓
2. أضف مشروع جديد
   ↓
3. احفظ (Ctrl + S)
   ↓
4. أعد التحميل (F5)
   ↓
✅ شاهد المشروع الجديد!
```

---

**والآن بتقدر تضيف مشاريع جديدة بسهولة تامة!** 🚀
