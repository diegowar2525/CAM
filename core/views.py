from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'home.html')

def contact(request):
    return render(request, 'contac.html')