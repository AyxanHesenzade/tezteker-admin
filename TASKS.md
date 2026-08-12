# Admin Panel Tasks — tezteker.az

Bu fayl admin panel (React 19 + Vite, Ant Design) üzərində işləyəcək AI agent üçün task
siyahısıdır. Bağlı backend endpoint-i (`GET /api/admin/otp-logs`) artıq hazır və deploy
olunub (bax `backend/TASKS.md` Task 2 və Task 4 — uçdan-uca test edilib), ona görə bu
səhifəni real datayla test edə bilərsən.

**DİQQƏT:** Layihənin rəsmi/brend adı **tezteker.az**-dır, "Basqaza" deyil. UI mətnlərində,
başlıqlarda, hər hansı yeni yazılan mətndə "Basqaza" istifadə etmə.

---

## Task 1 — "OTP Logs" səhifəsi əlavə et

### Məqsəd
Fərdi istifadəçi/mağaza email OTP ala bilmədikdə, admin bu səhifədən son göndərilən kodu görüb,
istifadəçinin qeydiyyat zamanı verdiyi telefon nömrəsinə əl ilə (WhatsApp-dan) yaza bilsin.

### Nəyi etmək lazımdır

1. **API servis qatı** (`src/api/admin.js`): mövcud servislərin (məs. `usersService`) izlədiyi
   pattern ilə eyni tərzdə, `/admin/otp-logs` endpoint-inə `GET` sorğusu atan, `params` (axtarış,
   səhifə) qəbul edən yeni bir servis əlavə et.

2. **Yeni səhifə** (`src/pages/OtpLogs.jsx`): `Users.jsx`-dəki struktur və data-yükləmə
   pattern-ini (axtarış + səhifələnmiş cədvəl) təkrarla. Tələb olunan sütunlar: E-poçt, Telefon,
   Kod, Vaxtı bitir, Göndərilib.
   - Kod sütunu vizual olaraq seçilməli (böyük/qalın font) və yanında bir "Kopyala" düyməsi
     olmalıdır ki, admin kodu birbaşa clipboard-a köçürüb WhatsApp-a yapışdıra bilsin.
   - Vaxtı keçmiş (expires_at keçmişdədirsə) sətirlər vizual olaraq (solğun/boz) fərqlənməlidir
     ki, admin köhnə/etibarsız kodu səhvən göndərməsin.
   - Axtarış email və ya telefon üzrə işləməlidir, mövcud `Users.jsx` axtarış davranışı ilə eyni
     təcrübədə (debounce/submit tərzi, page sıfırlanması və s.).
   - Paginasiya mövcud səhifələrdəki ilə eyni davranışda olmalıdır.

3. **Routing** (`src/App.jsx`): yeni səhifə üçün qorunan (`PrivateRoute` + `AdminLayout` daxili)
   bir route əlavə et, mövcud route-ların yanına, məntiqli bir path ilə (məs. `/otp-logs`).

4. **Naviqasiya menyusu** (`src/components/AdminLayout.jsx`): sol menyuya yeni bir item əlavə et,
   uyğun bir ikon və Azərbaycanca etiketlə (məs. "OTP Logları"), mövcud menyu massivinin
   formatına uyğun.

### Qəbul meyarları
- Yeni səhifə menyudan əlçatandır, giriş etmiş admin görə bilir, girməyən istifadəçi görmür
- Email/phone üzrə axtarış real datada işləyir
- Kod bir kliklə clipboard-a köçürülür
- Vaxtı bitmiş kodlar vizual olaraq aktiv kodlardan fərqlənir
- Mövcud admin panel dizayn dilini (Ant Design defolt komponentləri, sadə table+search) izləyir,
  yeni CSS framework/kitabxana əlavə etmə
- Real backend datası ilə test edilib (endpoint artıq production-da mövcuddur)

---

## Ümumi qeydlər
- Mövcud `toast` util-ini (`src/utils/toast`) səhv hallarında istifadə et, digər səhifələrdəki
  kimi.
- Dəyişiklikləri etdikdən sonra dev server-də (`npm run dev`) səhifəni admin girişi ilə əl ilə
  test et.

---

## Status — Frontend hesabatı (2026-08-05)

**Task 1 tamamlandı.** `otpLogsService`, `OtpLogs.jsx`, route və menyu item-i əlavə edildi,
`npm run lint` və `npm run build` təmiz keçdi.

### Real datayla test zamanı tapılan problem (backend tərəf, admin panelə aid deyil)
`/otp-logs` səhifəsi real `GET /api/admin/otp-logs` cavabı ilə test edildi. `phone` sahəsi
düzgün, hər qeyddə fərqli gəlir. Amma **`code` sahəsi bütün qeydlərdə "123456"** görünür (5
fərqli qeydin 5-i də eyni kod), məsələn:

```json
{"id":13,"phone":"506353633","email":null,"code":"123456","expires_at":"2026-07-07T09:39:17..."}
{"id":12,"phone":"552494070","email":null,"code":"123456","expires_at":"2026-07-07T08:53:50..."}
{"id":11,"phone":"772092121","email":null,"code":"123456","expires_at":"2026-07-07T08:50:20..."}
{"id":6, "phone":"706035084","email":null,"code":"123456","expires_at":"2026-02-23T06:55:12..."}
{"id":4, "phone":"507337271","email":null,"code":"123456","expires_at":"2026-02-22T10:47:16..."}
```

`email` sahəsi də bu qeydlərin hamısında `null`. Bu, admin panel kodunun bir buqu deyil —
`OtpLogs.jsx` backend-in DB-yə yazdığını olduğu kimi göstərir. Ehtimal ki, bu qeydlər köhnə
tarixlidir (2026-02, 2026-07) və backend-in real `random_int` OTP generasiyasına keçməzdən
əvvəlki test datasıdır, amma bunun təsdiqlənməsi və (əgər yeni OTP-lər də eyni şəkildə
"123456" gəlirsə) düzəldilməsi lazımdır.

**PM-dən xahiş**: bunu backend komandasına bildir ki, `backend/TASKS.md`-ə uyğun bir bug/task
əlavə etsinlər — admin panel tərəfində əlavə ediləcək bir şey yoxdur, gözlənilən davranış
backend-in fərqli, real təsadüfi kodlar yaratmasıdır.

---

## Task 2 — Elan Moderasiyası: "Gözləmədə olan elanlar" səhifəsi

### Məqsəd
İndiyə qədər bütün yeni elanlar (fərdi və mağaza) yaradılan kimi `pending` statusu ilə
qalır. Backend tərəf tamamlanıb və yoxlanılıb (bax `backend/TASKS.md` — "Elan moderasiyası"
task-ının Status bölməsi). Admin bu elanları görüb təsdiq və ya rədd etməlidir ki, saytda
görünsün.

### Backend API (hazır, deploy olunub — birbaşa istifadə et)

- **`GET /api/admin/ads?status=pending`** — gözləmədə olan elanların səhifələnmiş siyahısı.
  Mövcud admin ads list endpoint-i, sadəcə `status=pending` query param-ı ilə çağır (digər
  mövcud filtrlərlə eyni pattern — axtarış/pagination parametrləri də dəstəklənir, `Ads.jsx`-
  dəki mövcud servis çağırışına bax).
- **`GET /api/admin/ads/{ad}`** — tək elanın tam detalları (şəkillər, tag-lər/spec-lər,
  qiymət, satıcı məlumatı) — detal görünüşü üçün istifadə et, mövcud endpoint, dəyişməyib.
- **`POST /api/admin/ads/{ad}/approve`** — body YOXDUR. Uğurlu cavab: `200`,
  `{"status":"success","message":"Ad approved","data":{...ad, "status":"active"...}}`.
  Elan artıq `pending` deyilsə: `422`, `{"status":"error","message":"Yalnız gözləmədə
  (pending) olan elanlar təsdiqlənə bilər."}`.
- **`POST /api/admin/ads/{ad}/reject`** — body YOXDUR. Uğurlu cavab: `200`,
  `{"status":"success","message":"Ad rejected and deleted","data":null}` — **DİQQƏT: bu,
  elanı bazadan TAM SİLİR** (spec/şəkil qeydləri və Cloudinary şəkilləri daxil, geri
  qaytarıla bilməz), sadəcə status dəyişmir. Uğursuz halda (pending deyilsə): eyni formatda
  `422`.

Bütün endpoint-lər mövcud admin `auth:sanctum` + `admin` middleware qrupundadır, digər admin
ads route-larının yanında.

### Nəyi etmək lazımdır

1. **API servis qatı** (`src/api/admin.js`): mövcud `adsService` pattern-inə uyğun, yuxarıdakı
   4 endpoint-ə sorğu atan funksiyalar əlavə et (məs. `getPendingAds(params)`,
   `getAdDetail(id)`, `approveAd(id)`, `rejectAd(id)`).

2. **Yeni səhifə** (`src/pages/PendingAds.jsx` və ya mövcud Ads səhifəsinə tab/filter
   şəklində): `status=pending` olan elanları siyahıla.
   - Hər sətirdə/kartda elanın əsas məlumatları görünsün: şəkil (kiçik önizləmə), başlıq,
     kateqoriya (təkər/disk), qiymət, satıcı adı/tipi (fərdi/mağaza), tarix.
   - Detala baxmaq üçün: elanın bütün şəkillərini, texniki göstəricilərini (tag-lərini) və
     tam təsvirini göstərən bir görünüş (modal və ya ayrı səhifə) olsun ki, admin qərar
     verməzdən əvvəl hər şeyi görə bilsin.
   - Hər elanın yanında iki fəaliyyət düyməsi: **"Təsdiq et"** və **"İmtina et"**.
   - "İmtina et" düyməsi silinməzdən əvvəl təsdiq dialoqu (`Popconfirm` və ya `Modal.confirm`)
     göstərsin — bu əməliyyat elanı bazadan TAM SİLİR, geri qaytarıla bilməz.
   - Əməliyyat uğurlu olduqda siyahıdan həmin elan dərhal çıxarılsın (optimistic update və ya
     yenidən fetch), uyğun `toast` mesajı göstərilsin.

3. **Routing** (`src/App.jsx`): qorunan route əlavə et, mövcud pattern-ə uyğun.

4. **Naviqasiya menyusu** (`src/components/AdminLayout.jsx`): sol menyuya "Gözləmədə olan
   elanlar" adında yeni item, uyğun ikon ilə. Mümkünsə yanında gözləyən say (badge) göstər.

### Qəbul meyarları
- Yeni səhifə menyudan əlçatandır, yalnız giriş etmiş admin görür
- `pending` statuslu elanlar siyahıda düzgün görünür, təsdiq/rədd edildikdən sonra siyahıdan
  çıxır
- Elanın bütün detallarına (şəkillər, tag-lər, qiymət) baxmaq mümkündür, qərar bu əsasda
  verilə bilir
- "İmtina et" əməliyyatı təsdiq dialoqu ilə qorunur (yanlışlıqla silməyə qarşı)
- Mövcud admin panel dizayn dilini (Ant Design defolt komponentləri) izləyir
- Real backend datası ilə test edilib (backend task tamamlandıqdan sonra)
