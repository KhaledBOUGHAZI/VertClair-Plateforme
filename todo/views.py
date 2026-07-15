from django.shortcuts import render, redirect
from .models import Task

def todo_list(request):
    tasks = Task.objects.all()

    if request.method == "POST":
        title = request.POST.get("title")
        Task.objects.create(title=title)
        return redirect("todo")

    return render(request, "todo/todo_list.html", {"tasks": tasks})


def delete_task(request, task_id):
    task = Task.objects.get(id=task_id)
    task.delete()
    return redirect("todo")