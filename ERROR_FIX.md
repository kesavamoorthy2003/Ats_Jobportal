# Fix for 400 Bad Request Error on /api/interviews/

## Problem
The `/api/interviews/` endpoint was returning 400 Bad Request errors because:
1. The `InterviewSerializer` was using `ApplicationSerializer` which required request context
2. The nested serialization was causing issues when request context wasn't available

## Solution Applied

### Backend Changes:
1. **Simplified InterviewSerializer** (`backend/core/serializers.py`):
   - Removed dependency on `ApplicationSerializer`
   - Added direct fields: `application_id`, `job_title`, `candidate_name`
   - This avoids nested serialization issues

2. **Added request context** (`backend/core/views.py`):
   - Added `get_serializer_context()` method to `InterviewViewSet`
   - Ensures request context is always available

### Frontend Changes:
1. **Error handling** (`frontend/src/pages/CandidateDashboard.jsx`):
   - Added try-catch for interview fetching
   - Gracefully handles errors without breaking the page
   - Updated to check both `application_id` and `application` for compatibility

## Testing
1. Restart the Django backend server
2. Refresh the frontend page
3. The error should be resolved

## If Error Persists:
1. Check browser console for specific error message
2. Check Django terminal for detailed error logs
3. Verify user is logged in (authentication required)
4. Check that interviews exist in database


