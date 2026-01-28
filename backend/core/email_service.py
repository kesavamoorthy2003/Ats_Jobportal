from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone 

def send_status_update_email(application, old_status, new_status):
    """Send email notification when application status is updated"""
    candidate = application.candidate
    job = application.job
    
    subject = f'Application Status Update - {job.title}'
    message = f"""
    Dear {candidate.name},
    
    Your application status for the position "{job.title}" has been updated.
    
    Previous Status: {old_status}
    New Status: {new_status}
    
    Thank you for your interest.
    
    Best regards,
    {job.employer.name}
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [candidate.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error sending email: {e}")

def send_interview_email(interview):
    """Send email notification when interview is scheduled"""
    application = interview.application
    candidate = application.candidate
    job = application.job
    employer = job.employer
    
    subject = f'Interview Scheduled - {job.title}'
    
    local_time = timezone.localtime(interview.date)
    formatted_date_time = local_time.strftime('%B %d, %Y at %I:%M %p')
    
    meeting_info = ""
    if interview.mode == 'online' and interview.meeting_link:
        meeting_info = f"\nMeeting Link: {interview.meeting_link}"
    elif interview.mode == 'in-person':
        meeting_info = f"\nLocation: Please contact {employer.name} for location details."
    
    message = f"""
    Dear {candidate.name},
    
    Congratulations! You have been selected for an interview for the position "{job.title}".
    
    Interview Details:
    Date & Time: {formatted_date_time}
    Mode: {interview.mode.title()}
    {meeting_info}
    
    Please be prepared and on time.
    
    Best regards,
    {employer.name}
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [candidate.email],
            fail_silently=False,
        )
    except Exception as e:
        print(f"Error sending email: {e}")