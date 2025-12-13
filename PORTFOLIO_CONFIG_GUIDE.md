# 📋 Portfolio Configuration Guide

## ما هو هذا النظام الجديد؟

تم تحويل البورتفليو ليكون **data-driven**، مما يعني أن جميع البيانات (المشاريع، المهارات، الخبرات، إلخ) موجودة في **ملف JSON واحد** سهل التعديل بدلاً من كونها مكتوبة مباشرة في الكود.

---

## 📁 الملفات الرئيسية

### `portfolio-config.json` (الملف الرئيسي)
هذا هو **الملف الوحيد** الذي تحتاج لتعديله لتغيير جميع بيانات البورتفليو.

يحتوي على:
- `general` - البيانات العامة (الاسم، الخبرة، معلومات التواصل، إلخ)
- `projects` - جميع مشاريعك
- `skills` - جميع مهاراتك
- `experiences` - جميع خبراتك الوظيفية والتدريبية

### `config-loader.js`
ملف مساعد يقرأ البيانات من `portfolio-config.json` ويوفرها للأكواد الأخرى.

---

## 🎯 كيفية الاستخدام

### 1️⃣ إضافة مشروع جديد

افتح `portfolio-config.json` وأضف كائن جديد في قسم `projects`:

```json
{
  "projects": [
    // المشاريع السابقة...
    {
      "id": 4,
      "title": "اسم المشروع",
      "shortDescription": "وصف قصير",
      "longDescription": [
        "وصف طويل - السطر الأول",
        "السطر الثاني",
        "السطر الثالث"
      ],
      "coverImage": "src/assets/images/project.png",
      "detailImages": ["src/assets/images/detail1.png"],
      "tags": ["Flutter", "Firebase", "API"],
      "githubUrl": "https://github.com/username/project",
      "liveUrl": "https://demo-link.com"
    }
  ]
}
```

> تلقائياً سيظهر المشروع في البورتفليو! ✨

---

### 2️⃣ تعديل عدد المشاريع المعروضة

البيانات تُحدّث تلقائياً. لا تحتاج لتغيير أي شيء في الكود - عدد المشاريع سيتغير تلقائياً بناءً على عدد المشاريع في الـ JSON.

---

### 3️⃣ إضافة مهارة جديدة

افتح `portfolio-config.json` وأضف مهارة جديدة في قسم `skills`:

```json
{
  "skills": [
    // المهارات السابقة...
    {
      "id": 10,
      "name": "اسم المهارة",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/...",
      "type": "url"
    }
  ]
}
```

---

### 4️⃣ تعديل البيانات العامة

قسم `general` يحتوي على:

```json
{
  "general": {
    "heroName": "Mohamed Adel",
    "subtitle": "Flutter Developer | ...",
    "aboutText": "نصك هنا...",
    "profilePicture": "path/to/image",
    "stats": {
      "projectsCount": 3,
      "yearsExperience": 1,
      "happyClients": 2
    },
    "contact": {
      "location": "...",
      "phone": "...",
      "email": "...",
      "linkedin": "..."
    },
    "socialLinks": {
      "github": "...",
      "linkedin": "...",
      "facebook": "...",
      "whatsapp": "..."
    }
  }
}
```

---

### 5️⃣ إضافة خبرة جديدة

افتح `portfolio-config.json` وأضف خبرة جديدة في قسم `experiences`:

```json
{
  "experiences": [
    // الخبرات السابقة...
    {
      "company": "اسم الشركة",
      "logo": "src/assets/images/logos/company.jpg",
      "location": "المكان",
      "role": "المسمى الوظيفي",
      "period": "التاريخ",
      "tasks": [
        "المهمة الأولى",
        "المهمة الثانية",
        "المهمة الثالثة"
      ]
    }
  ]
}
```

---

### 6️⃣ حذف مشروع / مهارة / خبرة

ببساطة احذف الكائن من القائمة المناسبة في `portfolio-config.json` وسيختفي تلقائياً من البورتفليو.

---

## 📝 ملاحظات مهمة

✅ **المميزات:**
- تغيير بيانات البورتفليو بدون لمس الكود
- سهل جداً للأشخاص غير المبرمجين
- إذا كان لديك API، يمكنك استخدام `portfolio-config.json` كنسخة احتياطية
- يدعم localStorage للحفظ الديناميكي

⚠️ **تحذيرات:**
- تأكد من الحفاظ على بنية JSON صحيحة (أقواس، فواصل، إلخ)
- استخدم محرر JSON موثوق للتعديل (مثل VS Code)
- لا تنسَ الفواصل (,) بين العناصر

---

## 🔄 كيفية عمل النظام

```
portfolio-config.json (البيانات)
         ↓
config-loader.js (يقرأ البيانات)
         ↓
projects-data.js, skills-data.js, ... (توفير البيانات للواجهة)
         ↓
الواجهة (تعرض البيانات)
```

**الخلاصة:** أي تغيير في `portfolio-config.json` سينعكس تلقائياً على البورتفليو! 🎉

---

## ❓ أسئلة شائعة

**س: ماذا لو أردت تغيير عدد المشاريع المعروضة؟**
ج: تعديل المشاريع في `portfolio-config.json` والنظام يتكيف تلقائياً.

**س: هل يمكنني إضافة حقول جديدة؟**
ج: نعم! أضف الحقول في الـ JSON والتأكد من استخدامها في الواجهة.

**س: ماذا لو أردت API بدلاً من JSON؟**
ج: استبدل الجزء في `config-loader.js` الذي يجلب البيانات.

---

**تم! الآن بورتفليوك data-driven بنسبة 100%** 🚀
