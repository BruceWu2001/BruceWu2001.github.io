from django.shortcuts import render
from django.http import HttpResponse
from django import forms
from django.urls import reverse
from django.http import HttpResponseRedirect, JsonResponse
from django.views.decorators.csrf import csrf_exempt



# Create your views here.
def index(request):
    return render(request, "interview.html")

@csrf_exempt
def process_question(request):
    print("this method is called")
    if request.method == "POST":
        print("this is inside post")
        data= request.POST.get('data','')
        print(data)
        return JsonResponse({
            "answer" : "this is the answer"
        }, status=200)
    return HttpResponse("hello");