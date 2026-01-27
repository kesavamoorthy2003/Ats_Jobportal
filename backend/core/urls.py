from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AuthViewSet, JobViewSet, ApplicationViewSet, InterviewViewSet

router = DefaultRouter()
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'interviews', InterviewViewSet, basename='interview')

urlpatterns = [
    path('auth/register/', AuthViewSet.as_view({'post': 'register'})),
    path('auth/me/', AuthViewSet.as_view({'get': 'me'})),
    path('', include(router.urls)),
]


