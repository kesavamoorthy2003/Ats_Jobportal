# ATS Job Portal - Step-by-Step User Guide

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Starting the Application](#starting-the-application)
3. [Employer Workflow](#employer-workflow)
4. [Candidate Workflow](#candidate-workflow)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Initial Setup

### Step 1: Start Backend Server (Django)

1. Open **Terminal/PowerShell**
2. Navigate to backend folder:
   ```powershell
   cd C:\Users\DELL\OneDrive\Desktop\ats_task\backend
   ```
3. Activate virtual environment:
   ```powershell
   .\venv\Scripts\activate
   ```
4. Start Django server:
   ```powershell
   python manage.py runserver
   ```
5. ✅ **Success**: You should see:
   ```
   Starting development server at http://127.0.0.1:8000/
   ```
   - **Keep this terminal open!**

### Step 2: Start Frontend Server (React)

1. Open a **NEW Terminal/PowerShell** window
2. Navigate to frontend folder:
   ```powershell
   cd C:\Users\DELL\OneDrive\Desktop\ats_task\frontend
   ```
3. Start React development server:
   ```powershell
   npm run dev
   ```
4. ✅ **Success**: You should see:
   ```
   VITE ready in XXX ms
   ➜  Local:   http://localhost:5173/
   ```
   - **Keep this terminal open too!**

### Step 3: Open the Application

1. Open your web browser (Chrome, Firefox, Edge)
2. Go to: **http://localhost:5173**
3. ✅ You should see the ATS Portal homepage

---

## 👔 Employer Workflow

### Step 1: Register as Employer

1. Click **"Register"** button (top right)
2. Fill in the form:
   - **Name**: Your full name (e.g., "John Smith")
   - **Email**: Your email (e.g., "employer@test.com")
   - **Password**: Choose a password (e.g., "password123")
   - **Role**: Select **"Employer"** from dropdown
3. Click **"Register"** button
4. ✅ You'll be redirected to Login page

### Step 2: Login as Employer

1. Enter your **Email** and **Password**
2. Click **"Login"** button
3. ✅ You'll be redirected to **Employer Dashboard**

### Step 3: Post a Job

1. On the Employer Dashboard, click **"Post New Job"** button (top right)
2. Fill in the job details:
   - **Job Title**: e.g., "Python Full Stack Developer"
   - **Description**: Detailed job description
   - **Required Skills**: e.g., "Python, Django, React, MySQL"
   - **Location**: e.g., "Chennai, India (Hybrid)"
3. Click **"Post Job"** button
4. ✅ Job is created and you're redirected to Dashboard

### Step 4: View Applications

1. On Employer Dashboard, you'll see all your posted jobs
2. Click on any **job title** to view details
3. Scroll down to see **"Applications"** section
4. You'll see a table with:
   - Candidate name
   - Application date
   - Resume download link
   - Current status
   - Status dropdown

### Step 5: Update Application Status

1. In the Applications table, find the candidate
2. Use the **Status dropdown** to change status:
   - **Applied** → **Shortlisted** → **Interview Scheduled** → **Selected/Rejected**
3. Select new status from dropdown
4. ✅ Status updates automatically
5. ✅ **Email notification** sent to candidate (check backend terminal for email output)

### Step 6: Schedule an Interview

1. First, change candidate status to **"Shortlisted"**
2. A **"Schedule Interview"** button appears next to the status dropdown
3. Click **"Schedule Interview"** button
4. Fill in the interview form:
   - **Date**: Select interview date
   - **Time**: Select interview time
   - **Mode**: Choose "Online" or "In-Person"
   - **Meeting Link**: (If Online) Enter Zoom/Google Meet link
5. Click **"Schedule"** button
6. ✅ Interview is scheduled
7. ✅ Application status automatically changes to "Interview Scheduled"
8. ✅ **Email notification** sent to candidate with interview details

---

## 👤 Candidate Workflow

### Step 1: Register as Candidate

1. Click **"Register"** button (top right)
2. Fill in the form:
   - **Name**: Your full name (e.g., "Jane Doe")
   - **Email**: Your email (e.g., "candidate@test.com")
   - **Password**: Choose a password (e.g., "password123")
   - **Role**: Select **"Candidate"** from dropdown
3. Click **"Register"** button
4. ✅ You'll be redirected to Login page

### Step 2: Login as Candidate

1. Enter your **Email** and **Password**
2. Click **"Login"** button
3. ✅ You'll be redirected to **Candidate Dashboard**

### Step 3: Browse Available Jobs

1. On Candidate Dashboard, scroll down to **"Available Jobs"** section
2. You'll see a list of all posted jobs
3. Each job shows:
   - Job title
   - Location
   - Required skills

### Step 4: Apply for a Job

1. Click on any **job title** from the list
2. You'll see the full job description
3. Scroll down to **"Apply for this Job"** section
4. Click **"Choose File"** and select your resume (PDF or DOC)
5. Click **"Submit Application"** button
6. ✅ Success message appears: "Applied successfully!"
7. ✅ Application status shows as "Applied"

### Step 5: Track Application Status

1. Go to **Candidate Dashboard**
2. In **"My Applications"** section, you'll see:
   - Job title
   - Application date
   - Current status (with color-coded badge)
   - Interview details (if scheduled)

### Step 6: View Interview Details

1. If your application status is **"Interview Scheduled"**
2. Check the **"Interview Details"** column in "My Applications" table
3. You'll see:
   - Interview date and time
   - Mode (Online/In-Person)
   - Meeting link (if online)
3. ✅ **Email notification** also sent to your email (check backend terminal)

---

## 🔄 Complete Workflow Example

### Scenario: Full Hiring Process

**As Employer:**
1. ✅ Register → Login → Post Job
2. ✅ Wait for applications
3. ✅ View applications → Download resumes
4. ✅ Change status: Applied → Shortlisted
5. ✅ Click "Schedule Interview" → Fill form → Schedule
6. ✅ After interview: Change status to "Selected" or "Rejected"

**As Candidate:**
1. ✅ Register → Login → Browse Jobs
2. ✅ Apply for job → Upload resume
3. ✅ Check dashboard for status updates
4. ✅ Receive email when status changes
5. ✅ View interview details when scheduled
6. ✅ Check final status (Selected/Rejected)

---

## 📧 Email Notifications

### How Emails Work

**Development Mode (Default):**
- Emails are **printed to the backend terminal console**
- No actual emails sent
- Check the Django server terminal to see email content

**Production Mode (Real Emails):**
1. Set environment variables:
   ```powershell
   $env:EMAIL_HOST_USER="your-email@gmail.com"
   $env:EMAIL_HOST_PASSWORD="your-app-password"
   ```
2. Restart Django server
3. Real emails will be sent

### When Emails Are Sent

1. ✅ **Status Update**: When employer changes application status
2. ✅ **Interview Scheduled**: When employer schedules an interview

---

## 🛠️ Troubleshooting

### Problem: Backend server won't start

**Solution:**
- Make sure MySQL is running
- Check database credentials in `settings.py`
- Try: `python manage.py migrate` first

### Problem: Frontend shows errors

**Solution:**
- Make sure backend is running on port 8000
- Check browser console for errors
- Restart frontend: `Ctrl+C` then `npm run dev`

### Problem: Can't download resume

**Solution:**
- Make sure backend server is running
- Check that resume file exists in `backend/media/resumes/`
- Try refreshing the page

### Problem: Interview form not showing

**Solution:**
- Make sure application status is "Shortlisted"
- Refresh the page
- Check browser console for errors

### Problem: Emails not working

**Solution:**
- Check backend terminal for email output (console mode)
- For real emails, configure SMTP settings
- Check email credentials are correct

---

## 📝 Quick Reference

### URLs
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/
- **Admin Panel**: http://localhost:8000/admin/

### Default Roles
- **Employer**: Can post jobs, view applications, schedule interviews
- **Candidate**: Can browse jobs, apply, track status

### Status Flow
```
Applied → Shortlisted → Interview Scheduled → Selected/Rejected
```

### File Upload
- **Resume formats**: PDF, DOC, DOCX
- **Max size**: Check Django settings (default is usually sufficient)

---

## ✅ Checklist for First Use

- [ ] Backend server running (port 8000)
- [ ] Frontend server running (port 5173)
- [ ] Database connected (MySQL)
- [ ] Registered as Employer
- [ ] Posted a test job
- [ ] Registered as Candidate (different browser/incognito)
- [ ] Applied for the job
- [ ] Updated status as Employer
- [ ] Scheduled an interview
- [ ] Checked email notifications in terminal

---

**Need Help?** Check the terminal outputs for error messages or contact support.


