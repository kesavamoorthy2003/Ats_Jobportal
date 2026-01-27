# 🚀 Quick Start Guide - ATS Job Portal

## Step 1: Start Backend (Django)

```powershell
# Open Terminal 1
cd C:\Users\DELL\OneDrive\Desktop\ats_task\backend
.\venv\Scripts\activate
python manage.py runserver
```

✅ Wait for: `Starting development server at http://127.0.0.1:8000/`

---

## Step 2: Start Frontend (React)

```powershell
# Open Terminal 2 (NEW window)
cd C:\Users\DELL\OneDrive\Desktop\ats_task\frontend
npm run dev
```

✅ Wait for: `Local: http://localhost:5173/`

---

## Step 3: Open Browser

🌐 Go to: **http://localhost:5173**

---

## Step 4: Test as Employer

1. **Register** → Select "Employer" role
2. **Login** with your credentials
3. Click **"Post New Job"**
4. Fill form → Click **"Post Job"**
5. Click on your job to see applications

---

## Step 5: Test as Candidate

1. **Register** → Select "Candidate" role (use different email)
2. **Login** with candidate credentials
3. Browse jobs → Click on a job
4. Upload resume → Click **"Submit Application"**
5. Check **"My Applications"** for status

---

## Step 6: Complete Workflow

**As Employer:**
1. View applications → Download resume
2. Change status: **Applied** → **Shortlisted**
3. Click **"Schedule Interview"** button
4. Fill date, time, mode, meeting link
5. Click **"Schedule"**

**As Candidate:**
1. Check dashboard → See status updates
2. View interview details when scheduled
3. Check email notifications (in backend terminal)

---

## 📧 Email Notifications

**Default (Development):**
- Emails print to **backend terminal console**
- No setup needed!

**For Real Emails:**
```powershell
$env:EMAIL_HOST_USER="your-email@gmail.com"
$env:EMAIL_HOST_PASSWORD="your-app-password"
# Then restart backend server
```

---

## ⚠️ Common Issues

**Backend won't start?**
- Check MySQL is running
- Verify database credentials

**Frontend errors?**
- Make sure backend is running
- Check browser console

**Can't download resume?**
- Ensure backend is running
- Check file exists in `backend/media/resumes/`

---

## 🎯 Key Features

✅ Job Posting & Management  
✅ Resume Upload (PDF/DOC)  
✅ Application Status Tracking  
✅ Interview Scheduling  
✅ Email Notifications  
✅ Role-Based Access Control  

---

**Full Guide**: See `USER_GUIDE.md` for detailed instructions.


