import os
import random
from django.shortcuts import render
from markdown2 import Markdown

from . import util


markdowner= Markdown()

def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def entry(request, title):
    entry= util.get_entry(title)
    if entry == None: 
        message= f'The entry << {title} >> does not exist. You can create a new entry or search.'
        return render(request, "encyclopedia/notfound.html", {
            "message": message
        })
    else:
        return render(request, "encyclopedia/entry.html", {
            "entry": markdowner.convert(entry),
            "title": title
        })

def notfound(request, title, message):
    return render(request, "encyclopedia/notfound.html", {
        "title": title,
        "message": message
    })

def search(request):
    query= request.GET.get("q")
    entry_list= util.list_entries()
    for entr in entry_list:
        if query == entr:
            return entry(request, entr)
    found=[]
    query_low= query.lower()
    for entr in entry_list:
        if query_low in entr.lower():
            found.append(entr)
    return render(request, "encyclopedia/search.html", {
        "found": found,
        "query": query
    })


def create(request):
    if request.method == "POST":
        tit=request.POST.get("title")
        cont=request.POST.get("content")
        entry_list= util.list_entries()
        if tit in entry_list:
            message= f"The entry {tit} already exist! Choose another title to create a new entry, or edit the existing entry."
            return notfound(request, tit, message)
            
        util.save_entry(tit, cont)
        return entry(request, tit)
    return render(request, "encyclopedia/create.html", {
        "message": 'New Entry'
    })

def edit(request):
    tit= request.GET.get("titl")
    content= util.get_entry(tit)
    return render(request, "encyclopedia/edit.html", {
        "titles": tit,
        "content": content
    })
    

def edited(request):
    if request.method == "POST":
        tit= request.POST.get("titl")
        cont=request.POST.get("content")
        util.save_entry(tit, cont)
        return entry(request, tit)



def rand(request):
    entry_list= util.list_entries()
    if entry_list:
        chance= random.randint(0, len(entry_list)-1)
    return render(request, "encyclopedia/rand.html", {
        "entry": entry_list[chance]
    })

