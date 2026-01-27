# Job Portal with ATS

## Prerequisites
- Python 3.10+
- Node.js 16+
- MySQL (Optional, defaults to SQLite if not configured)

## Setup

### Backend (Django)
1. Navigate to `backend` directory.
2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start server:
   ```bash
   python manage.py runserver
   ```
   Server runs at `http://localhost:8000`.

### Frontend (React)
1. Navigate to `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
   App runs at `http://localhost:5173`.

## Usage
1. Register a new account. Select 'Employer' or 'Candidate' role.
2. **Employer**: Post jobs, view dashboard, manage applications (change status).
3. **Candidate**: View jobs, apply (upload resume), track application status.

## Database
By default, the project uses SQLite. To use MySQL, set the following environment variables in `.env` or your shell:
- `DB_ENGINE=mysql`
- `DB_NAME=ats_db`
- `DB_USER=root`
- `DB_PASSWORD=yourpassword`
- `DB_HOST=localhost`


