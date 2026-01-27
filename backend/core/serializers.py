from rest_framework import serializers
from .models import User, Job, Application, Interview
from django.contrib.auth import get_user_model
from django.conf import settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'name', 'role')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('email', 'name', 'password', 'role')

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            role=validated_data['role']
        )
        return user

class JobSerializer(serializers.ModelSerializer):
    employer_name = serializers.CharField(source='employer.name', read_only=True)

    class Meta:
        model = Job
        fields = '__all__'
        read_only_fields = ('employer', 'created_at')

class ApplicationSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source='candidate.name', read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)
    resume_url = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('candidate', 'status', 'application_date')

    def get_resume_url(self, obj):
        if obj.resume:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume.url)
            return f"{settings.MEDIA_URL}{obj.resume.name}"
        return None

class InterviewSerializer(serializers.ModelSerializer):
    application_id = serializers.IntegerField(source='application.id', read_only=True)
    job_title = serializers.CharField(source='application.job.title', read_only=True)
    candidate_name = serializers.CharField(source='application.candidate.name', read_only=True)

    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ('created_at', 'application_id', 'job_title', 'candidate_name')

