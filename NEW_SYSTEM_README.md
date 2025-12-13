# 🚀 دليل استخدام البورتفليو الجديد - Data-Driven Edition

> **تم تحويل البورتفليو إلى نظام data-driven يمكنك فيه تعديل كل شيء من ملف JSON واحد!**

---

## 📌 ملخص سريع

| المهمة | الخطوات |
|------|--------|
| **إضافة مشروع** | افتح `portfolio-config.json` → أضف في `projects` → احفظ |
| **تعديل مشروع** | افتح `portfolio-config.json` → عدّل في `projects` → احفظ |
| **حذف مشروع** | افتح `portfolio-config.json` → احذف من `projects` → احفظ |
| **إضافة مهارة** | افتح `portfolio-config.json` → أضف في `skills` → احفظ |
| **تعديل البيانات العامة** | افتح `portfolio-config.json` → عدّل `general` → احفظ |

---

## 🎯 الملف الرئيسي

### 📄 `src/shared/data/portfolio-config.json`

هذا هو **الملف الوحيد** الذي تحتاج لتعديله.

يحتوي على:
- ✅ البيانات العامة (الاسم، التخصص، معلومات التواصل)
- ✅ جميع المشاريع
- ✅ جميع المهارات
- ✅ جميع الخبرات الوظيفية

---

## 📚 الأدلة المتاحة

| الملف | الهدف | المستوى |
|-----|------|--------|
| [QUICK_EDIT_GUIDE.md](QUICK_EDIT_GUIDE.md) | خطوات سريعة للتعديل | 🟢 مبتدئ |
| [CONFIG_GUIDE_AR.md](CONFIG_GUIDE_AR.md) | شرح تفصيلي بالعربية | 🟡 متوسط |
| [EXAMPLE_ADD_PROJECT.md](EXAMPLE_ADD_PROJECT.md) | مثال عملي: إضافة مشروع | 🟡 متوسط |
| [TECHNICAL_DOCS.md](TECHNICAL_DOCS.md) | توثيق تقني كامل | 🔴 متقدم |
| [PORTFOLIO_CONFIG_GUIDE.md](PORTFOLIO_CONFIG_GUIDE.md) | دليل شامل انجليزي | 🔴 متقدم |

---

## 🎨 البنية الكاملة

```
{
  "general": {
    "heroName": "Mohamed Adel",
    "subtitle": "Flutter Developer",
    "aboutText": "نصك هنا...",
    "profilePicture": "src/assets/images/profile.jpg",
    "stats": {
      "projectsCount": 3,
      "yearsExperience": 1,
      "happyClients": 2
    },
    "contact": {
      "location": "Cairo",
      "phone": "+20...",
      "email": "email@gmail.com",
      "linkedin": "https://..."
    },
    "socialLinks": {
      "github": "https://...",
      "linkedin": "https://...",
      "facebook": "https://...",
      "whatsapp": "https://..."
    }
  },
  
  "projects": [
    {
      "id": 1,
      "title": "Project Name",
      "shortDescription": "...",
      "longDescription": ["...", "..."],
      "coverImage": "src/assets/images/project.png",
      "detailImages": ["src/assets/images/detail.png"],
      "tags": ["Flutter", "Firebase"],
      "githubUrl": "https://github.com/...",
      "liveUrl": "https://..."
    }
  ],
  
  "skills": [
    {
      "id": 1,
      "name": "Flutter",
      "icon": "https://cdn.jsdelivr.net/.../flutter.svg",
      "type": "url"
    }
  ],
  
  "experiences": [
    {
      "company": "Company Name",
      "logo": "src/assets/images/logos/logo.jpg",
      "location": "Cairo",
      "role": "Position",
      "period": "Jan 2024 - Present",
      "tasks": ["Task 1", "Task 2"]
    }
  ]
}
```

---

## 🔄 كيف يعمل النظام

```
portfolio-config.json (البيانات)
         ↓
config-loader.js (يقرأ)
         ↓
projects/skills/experience-data.js (توفير)
         ↓
work/skills/experience.js (عرض)
         ↓
الواجهة (مشاهد جميل ✨)
```

---

## 📖 أمثلة عملية

### 1. إضافة مشروع جديد

```json
,{
  "id": 4,
  "title": "My New Project",
  "shortDescription": "A cool project",
  "longDescription": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ],
  "coverImage": "src/assets/images/project.png",
  "detailImages": ["src/assets/images/detail.png"],
  "tags": ["Flutter", "API"],
  "githubUrl": "https://github.com/username/project",
  "liveUrl": "https://demo.com"
}
```

### 2. تعديل الاسم

```json
// قبل:
"heroName": "Mohamed Adel"

// بعد:
"heroName": "محمد عادل"
```

### 3. إضافة مهارة

```json
,{
  "id": 10,
  "name": "React",
  "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "type": "url"
}
```

---

## ✅ خطوات التعديل

```
1️⃣ افتح: src/shared/data/portfolio-config.json

2️⃣ عدّل البيانات المطلوبة

3️⃣ احفظ: Ctrl + S

4️⃣ أعد التحميل: F5 (في المتصفح)

5️⃣ شاهد التغييرات! ✨
```

---

## 🔍 التحقق من صحة JSON

### الطريقة 1: VS Code
- كليك يمين → "Format Document"
- سيخبرك إذا كان هناك أخطاء

### الطريقة 2: أداة أونلاين
- https://jsonlint.com
- انسخ محتوى الملف والصقه

### الطريقة 3: Console
```javascript
// في Developer Tools (F12)
await window.validatePortfolioConfig()
```

---

## ⚠️ أخطاء شائعة

| ❌ خطأ | ✅ الحل |
|-----|--------|
| نسيان الفاصلة `,` | ضع فاصلة بعد كل كائن |
| أقواس غير متطابقة | تأكد من `{` و `}` |
| بدون علامات اقتباس | استخدم `"name"` وليس `name` |
| مسارات صور خاطئة | تأكد من المسار `src/assets/images/...` |

---

## 🚀 المميزات

✅ **سهل جداً:** ملف JSON واحد فقط
✅ **بدون ترميز:** لا تحتاج خبرة برمجية
✅ **مرن:** يدعم API أيضاً
✅ **معيارى:** أفضل الممارسات
✅ **فوري:** التغييرات تظهر مباشرة

---

## 📞 الدعم الفني

إذا واجهت مشكلة:

1. ✅ تحقق من صحة JSON
2. ✅ تأكد من المسارات
3. ✅ افتح Developer Tools (F12)
4. ✅ اقرأ الأخطاء في Console

---

## 🎓 معلومات إضافية

- **معمارية:** Data-driven architecture
- **صيغة البيانات:** JSON
- **المحرر:** VS Code أو أي محرر نصي
- **المتصفح:** أي متصفح حديث

---

## 📝 الملفات المتعلقة

### في المشروع:
- `config-loader.js` - محمل البيانات
- `general-data.js` - البيانات العامة
- `projects-data.js` - المشاريع
- `skills-data.js` - المهارات
- `experience-data.js` - الخبرات

### الأدلة:
- `QUICK_EDIT_GUIDE.md` - دليل سريع
- `CONFIG_GUIDE_AR.md` - دليل تفصيلي
- `TECHNICAL_DOCS.md` - توثيق تقني
- `EXAMPLE_ADD_PROJECT.md` - أمثلة عملية

---

## 🎉 الخلاصة

أنت الآن تتحكم **100%** بالبورتفليو من ملف واحد!

```
عدّل البيانات → احفظ → أعد التحميل → تمام! ✨
```

---

**Happy Editing! 🚀**

---

*آخر تحديث: 2024*
*النسخة: 2.0 (Data-Driven)*
