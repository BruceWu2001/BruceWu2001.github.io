from django.urls import path
from . import views

app_name = "interview"
urlpatterns = [
    path("", views.index, name="index"),
    path("process", views.process_question, name="process_question")
]