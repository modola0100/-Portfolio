# 🚀 Auto Git Push Setup

## شرح العملية

هذه الأدوات تقوم بمراقبة تغييرات المشروع وإرسالها تلقائياً للـ GitHub بدون تدخل منك.

## الملفات:

### 1. **auto-push.ps1** (PowerShell Script)
- السكريبت الرئيسي الذي يراقب التغييرات
- يكتشف أي ملف تم تعديله
- ينتظر 3 ثوان من آخر تغيير ثم يرسل
- يظهر رسائل الحالة ملونة

### 2. **start-auto-push.bat** (Batch File)
- ملف تشغيل بسيط
- يشغل PowerShell Script بدون مشاكل صلاحيات
- يمكنك الضغط عليه مرتين وخلاص

## 📋 خطوات الإعداد:

### الخطوة 1: تأكد من إعدادات Git
```bash
git config --global user.email "your-email@gmail.com"
git config --global user.name "Your Name"
```

### الخطوة 2: التوثيق (Authentication)

إذا كنت على Windows مع GitHub، استخدم أحد هذه الخيارات:

#### الخيار A: GitHub Token (الأفضل)
1. اذهب إلى: https://github.com/settings/tokens
2. اضغط "Generate new token"
3. اختر "Personal access tokens (classic)"
4. قم بـ enable "repo" scope
5. انسخ الـ token
6. عند أول push، استخدم:
   - Username: `your-github-username`
   - Password: `paste-your-token-here`

#### الخيار B: SSH (متقدم لكن آمن)
```bash
# توليد مفتاح SSH
ssh-keygen -t ed25519 -C "your-email@gmail.com"

# نسخ المفتاح العام وإضافته على GitHub
# settings → SSH and GPG keys → New SSH key
```

### الخطوة 3: تشغيل السكريبت

#### الطريقة الأولى (البسيطة):
1. افتح Explorer
2. اذهب إلى مجلد المشروع
3. اضغط مرتين على `start-auto-push.bat`
4. خلاص! السكريبت بدأ المراقبة

#### الطريقة الثانية (PowerShell مباشر):
```powershell
# افتح PowerShell في مجلد المشروع
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
.\auto-push.ps1
```

## ⚙️ الإعدادات:

### داخل السكريبت (auto-push.ps1):

```powershell
$checkInterval = 2      # التحقق كل ثانيتين (يمكن تغييره)
$debounceWait = 3       # الانتظار 3 ثوان من آخر تغيير (يمكن تغييره)
```

## 📊 كيف يعمل:

```
1. السكريبت يراقب المجلد كل ثانيتين
   ↓
2. عند اكتشاف تغييرات:
   - يعرض الملفات المعدلة
   - ينتظر 3 ثوان (للتأكد من انتهاء التعديلات)
   ↓
3. يقوم بـ:
   - git add .         (إضافة الملفات)
   - git commit -m     (عمل commit مع timestamp)
   - git push          (إرسال للـ GitHub)
   ↓
4. يعرض رسالة نجاح ✅
   ويستمر المراقبة...
```

## 🔒 الأمان:

- السكريبت **لا يحفظ** أي بيانات حساسة
- **الـ credentials** تُطلب مرة واحدة وتُخزن من قِبل Windows/Git
- يمكنك استخدام GitHub Token بدل كلمة المرور

## ⚠️ ملاحظات مهمة:

1. **تأكد من الاتصال بالإنترنت** قبل التشغيل
2. إذا فشل أول push، تحقق من:
   - البيانات الصحيحة للـ GitHub
   - الإنترنت يعمل
   - Repository موجود وليس خاص

3. **المفاتيح الحساسة** (API keys, passwords):
   - **لا تضفها** في الكود بشكل مباشر
   - استخدم environment variables أو .env files

## 🛑 إيقاف السكريبت:

اضغط `Ctrl + C` في نافذة PowerShell

## 📝 أمثلة الـ Commits:

```
📝 Auto Update - 2025-12-13 15:30:45

Updated files:
M  admin.html
M  src/shared/data/config-loader.js
?? new-file.txt
```

- `M` = Modified (معدل)
- `A` = Added (جديد)
- `D` = Deleted (محذوف)
- `?` = Untracked (لم يتم تتبعه)

## ✨ الخصائص:

✅ مراقبة تلقائية للتغييرات  
✅ debounce (انتظار حتى تنتهي التعديلات)  
✅ رسائل commit واضحة مع timestamp  
✅ رسائل حالة ملونة  
✅ لا يتطلب تثبيت برامج إضافية  
✅ يعمل مع Windows و Mac و Linux  

## 🆘 استكشاف الأخطاء:

### الخطأ: "git: command not found"
- تأكد من تثبيت Git: https://git-scm.com/

### الخطأ: "Permission denied"
- شغل PowerShell كـ Administrator
- أو استخدم `Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope CurrentUser`

### الخطأ: "fatal: could not read Username"
- استخدم GitHub Token بدل كلمة المرور
- أو جهز SSH keys

---

**Happy Auto-Pushing! 🚀**
