from django.urls import path
from .views import todo_list, delete_task

urlpatterns = [
    path("", todo_list, name="todo"),
    path("delete/<int:task_id>/", delete_task, name="delete_task"),
]