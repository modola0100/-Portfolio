# 🎯 توثيق نظام البورتفليو الجديد

## 📚 المقدمة

تم تطوير نظام **data-driven** للبورتفليو يسمح لك بتعديل جميع المحتويات من ملف JSON واحد دون الحاجة لتعديل الكود.

---

## 🏗️ البنية المعمارية

```
┌─────────────────────────────────────────┐
│   portfolio-config.json                 │ ← جميع البيانات هنا
│   (Projects, Skills, Experience, etc.)  │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   config-loader.js                      │ ← يحمّل البيانات
│   (Fetches from JSON)                   │
└──────────────┬──────────────────────────┘
               │
               ├─────────────┬─────────────┬──────────────┐
               ▼             ▼             ▼              ▼
        ┌──────────┐  ┌──────────┐ ┌──────────┐  ┌──────────┐
        │projects  │  │skills    │ │experience│  │general   │
        │-data.js  │  │-data.js  │ │-data.js  │  │-data.js  │
        └────┬─────┘  └────┬─────┘ └────┬─────┘  └────┬─────┘
             │             │            │            │
             └─────────────┼────────────┼────────────┘
                           │
                           ▼
                      app.js (Main App)
                           │
                           ▼
                    الواجهة (UI)
```

---

## 📁 الملفات الرئيسية

### 1. `portfolio-config.json` ⭐
**موقع:** `src/shared/data/portfolio-config.json`

**الوظيفة:** تخزين جميع البيانات (JSON)

**المحتويات:**
```json
{
  "general": { /* البيانات العامة */ },
  "projects": [ /* المشاريع */ ],
  "skills": [ /* المهارات */ ],
  "experiences": [ /* الخبرات */ ]
}
```

---

### 2. `config-loader.js`
**موقع:** `src/shared/data/config-loader.js`

**الوظيفة:** تحميل البيانات من JSON وتوفيرها للملفات الأخرى

**الدوال الرئيسية:**
```javascript
getGeneralDataFromConfig()    // البيانات العامة
getProjectsFromConfig()       // المشاريع
getSkillsFromConfig()         // المهارات
getExperiencesFromConfig()    // الخبرات
getProjectById(id)            // مشروع محدد
```

---

### 3. `general-data.js`
**موقع:** `src/shared/data/general-data.js`

**الوظيفة:** توفير البيانات العامة من JSON للتطبيق

**الدالة الرئيسية:**
```javascript
getGeneralData() → يجلب البيانات من portfolio-config.json
```

---

### 4. `projects-data.js`
**موقع:** `src/shared/data/projects-data.js`

**الوظيفة:** توفير بيانات المشاريع

**الدالة الرئيسية:**
```javascript
getProjects() → يجلب جميع المشاريع من portfolio-config.json
```

---

### 5. `skills-data.js`
**موقع:** `src/shared/data/skills-data.js`

**الوظيفة:** توفير بيانات المهارات

**الدالة الرئيسية:**
```javascript
getSkills() → يجلب جميع المهارات من portfolio-config.json
```

---

### 6. `experience-data.js`
**موقع:** `src/shared/data/experience-data.js`

**الوظيفة:** توفير بيانات الخبرات

**الدالة الرئيسية:**
```javascript
getExperiences() → يجلب جميع الخبرات من portfolio-config.json
```

---

## 🔄 سير العمل

### مثال: إضافة مشروع جديد

```
1. تعديل portfolio-config.json
   └─ أضف مشروع في قسم "projects"

2. حفظ الملف
   └─ Ctrl + S

3. تحديث الصفحة
   └─ F5 في المتصفح

4. app.js يستدعي getProjects()
   └─ من projects-data.js

5. projects-data.js يستدعي getProjectsFromConfig()
   └─ من config-loader.js

6. config-loader.js يجلب من portfolio-config.json
   └─ يعيد المشاريع

7. work.js يستقبل المشاريع
   └─ يعرضها في الواجهة ✨
```

---

## 📊 بنية JSON

### قسم `general`
```json
{
  "general": {
    "heroName": "Mohamed Adel",
    "subtitle": "Flutter Developer | ...",
    "aboutText": "نص عن نفسك",
    "profilePicture": "src/assets/images/profile.jpg",
    "stats": {
      "projectsCount": 3,
      "yearsExperience": 2,
      "happyClients": 10
    },
    "contact": {
      "location": "Cairo, Egypt",
      "phone": "+20 ...",
      "email": "email@gmail.com",
      "linkedin": "https://linkedin.com/..."
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

### قسم `projects`
```json
{
  "projects": [
    {
      "id": 1,
      "title": "Project Title",
      "shortDescription": "Short description",
      "longDescription": ["Point 1", "Point 2", "Point 3"],
      "coverImage": "src/assets/images/cover.png",
      "detailImages": ["src/assets/images/detail.png"],
      "tags": ["Flutter", "Firebase"],
      "githubUrl": "https://github.com/...",
      "liveUrl": "https://..."
    }
  ]
}
```

### قسم `skills`
```json
{
  "skills": [
    {
      "id": 1,
      "name": "Flutter",
      "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg",
      "type": "url"
    },
    {
      "id": 2,
      "name": "Custom Skill",
      "icon": "src/assets/images/icons/skill.png",
      "type": "local"
    }
  ]
}
```

### قسم `experiences`
```json
{
  "experiences": [
    {
      "company": "Company Name",
      "logo": "src/assets/images/logos/logo.jpg",
      "location": "Cairo, Egypt",
      "role": "Flutter Developer",
      "period": "Jan 2024 - Present",
      "tasks": [
        "Task 1",
        "Task 2",
        "Task 3"
      ]
    }
  ]
}
```

---

## 🔀 سلسلة البيانات (Data Flow)

```
┌─────────────────────────────────────────────────────────┐
│                   index.html                             │
│                 (نقطة الدخول)                           │
└───────────────────┬─────────────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────┐
        │   src/shared/app.js   │
        │   (تطبيق رئيسي)       │
        └───────┬───────────────┘
                │
        ┌───────┴──────────┬──────────────┐
        ▼                  ▼              ▼
   ┌────────────┐  ┌────────────┐  ┌──────────────┐
   │ work.js    │  │skills.js   │  │experience.js │
   └────┬───────┘  └────┬───────┘  └──────┬───────┘
        │               │                 │
        ├───────────────┼─────────────────┤
        ▼               ▼                 ▼
   ┌─────────────────────────────────────────────┐
   │  Data Files (projects/skills/experience)    │
   │  (تنادي config-loader.js)                    │
   └────────────────┬────────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │   config-loader.js        │
        │ (يجلب من JSON)            │
        └────────────┬──────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ portfolio-config.json      │
        │ (مستودع البيانات)          │
        └────────────────────────────┘
```

---

## 🎛️ خيارات التكوين

### الأولويات (Priority Order)
البيانات تُجلب بهذا الترتيب:

1. **portfolio-config.json** (الخيار الأول)
2. **localStorage** (إذا كانت موجودة)
3. **API** (`/api/projects`, `/api/skills`, إلخ)
4. **Default Values** (إذا لم يكن شيء موجود)

---

## ✅ المميزات

✅ **Data-Driven**: جميع البيانات مركزية
✅ **سهل التعديل**: ملف JSON واحد فقط
✅ **مرن**: يدعم API أيضاً
✅ **معيارى**: يتبع أفضل الممارسات
✅ **بدون ترميز**: لا تحتاج لتعديل الكود

---

## ⚠️ ملاحظات مهمة

- تأكد من صحة JSON (استخدم VS Code أو jsonlint.com)
- استخدم أسماء مسارات صحيحة للصور
- تأكد من وجود الفواصل بين العناصر
- احفظ الملف بعد التعديل
- أعد تحميل الصفحة للرؤية التغييرات

---

## 🚀 الخطوات التالية

1. افتح `portfolio-config.json`
2. عدّل البيانات كما تشاء
3. احفظ الملف
4. أعد تحميل الصفحة
5. شوف التغييرات مباشرة! ✨

---

**تم! أنت الآن تتحكم 100% بالبيانات دون لمس الكود!** 🎉
