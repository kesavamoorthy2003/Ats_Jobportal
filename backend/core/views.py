from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Job, Application, Interview
from .serializers import (
    UserSerializer, RegisterSerializer, JobSerializer, 
    ApplicationSerializer, InterviewSerializer
)
from .permissions import IsEmployer, IsCandidate
from .email_service import send_status_update_email, send_interview_email

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        return Response(UserSerializer(request.user).data)

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsEmployer()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

    @action(detail=True, methods=['get'], permission_classes=[IsEmployer])
    def applications(self, request, pk=None):
        job = self.get_object()
        if job.employer != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        applications = Application.objects.filter(job=job)
        serializer = ApplicationSerializer(applications, many=True, context={'request': request})
        return Response(serializer.data)

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return Application.objects.filter(job__employer=user)
        return Application.objects.filter(candidate=user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_permissions(self):
        if self.action == 'create':
            return [IsCandidate()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(candidate=self.request.user)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsEmployer])
    def update_status(self, request, pk=None):
        application = self.get_object()
        # Verify job belongs to employer
        if application.job.employer != request.user:
             return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        status_val = request.data.get('status')
        if status_val:
            old_status = application.status
            application.status = status_val
            application.save()
            # Send email notification
            try:
                send_status_update_email(application, old_status, status_val)
            except Exception as e:
                print(f"Email sending failed: {e}")
            return Response({'status': 'status updated'})
        return Response({'error': 'status required'}, status=status.HTTP_400_BAD_REQUEST)

class InterviewViewSet(viewsets.ModelViewSet):
    serializer_class = InterviewSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'employer':
            return Interview.objects.filter(application__job__employer=user)
        return Interview.objects.filter(application__candidate=user)

    def get_permissions(self):
        if self.action == 'create':
            return [IsEmployer()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"Serializer validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Get application from validated data
        application = serializer.validated_data.get('application')
        if not application:
            return Response({'error': 'Application is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify job belongs to employer
        if application.job.employer != request.user:
            return Response({'error': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)
        
        # Save the interview
        interview = serializer.save()
        
        # Update application status to interview_scheduled
        application.status = 'interview_scheduled'
        application.save()
        
        # Send email notification
        try:
            send_interview_email(interview)
        except Exception as e:
            print(f"Email sending failed: {e}")
        
        # Return response with full data
        response_serializer = self.get_serializer(interview)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
