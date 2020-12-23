from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime
from django.utils import timezone
from django.core.files.storage import FileSystemStorage

fs = FileSystemStorage(location='medicalrecords')

class User(AbstractUser):
    image = models.ImageField(null=True, blank=True)
    
    def __str__(self):
        return self.username

    def serialize(self):
        if (self.image):
            return {
                "id": self.id,
                "username": self.username,
                "image": self.image.url,
                "date_joined": self.date_joined.strftime("%b %-d %Y, %-I:%M %p"),
                } 
        else:
            return {
                "id": self.id,
                "username": self.username,
                "date_joined": self.date_joined.strftime("%b %-d %Y, %-I:%M %p"),
                }         


class Patient(models.Model):
    name = models.CharField(max_length=50)
    social_security_number = models.CharField(max_length=20)
    image = models.ImageField(null=True, blank=True)
    admission = models.DateTimeField(auto_now_add=True)
    room_bed = models.CharField(max_length=10)

    def __str__(self):
        return self.name

    def serialize(self):
        if (self.image):
            return {
                "name": self.name,
                "image": self.image.url,
                "social_number": self.social_security_number,
                "room_bed": self.room_bed,
                "admission": self.admission.strftime("%b %-d %Y, %-I:%M %p"),
                } 
        else:
            return {
                "name": self.name,
                "social_number": self.social_security_number,
                "room_bed": self.room_bed,
                "admission": self.admission.strftime("%b %-d %Y, %-I:%M %p"),
                }         

class Bed(models.Model):
    id_bed = models.CharField(max_length=10)
    bed_patient = models.OneToOneField(Patient, related_name='bed_patient', on_delete=models.CASCADE, null=True, blank=True)
    ocuped = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id_bed": self.id_bed,
            "bed_patient": self.bed_patient,
            "ocuped": self.ocuped,
            } 

class MedicalRecord(models.Model):
    patient = models.OneToOneField(Patient, related_name='record_patient', on_delete=models.CASCADE)
    medical_record_id = models.CharField(max_length=25)
    medical_record_file = models.FileField(storage=fs)
    short_diagnosis = models.TextField()

    def serialize(self):
        return {
            "patient": self.patient,
            "medical_record_id": self.medical_record_id,
            "medical_record_file": self.medical_record_file,
            "short_diagnosis": self.short_diagnosis,
            } 

class ProgramedTask(models.Model):
    programed_task = models.ForeignKey(Bed, related_name='programed_task', on_delete=models.CASCADE)
    task = models.TextField()
    programed_time = models.DateTimeField()
    response_time = models.DateTimeField(auto_now=True)
    state = models.BooleanField(default=False)
    
    def serialize(self):
        return {
            "programed_task": self.programed_task,
            "task": self.task,
            "programed_time": self.programed_time,
            "response_time": self.response_time,
            "state": self.state,
            } 

class Call(models.Model):
    call = models.ForeignKey(Bed, related_name='call', on_delete=models.CASCADE)
    task = models.TextField()
    call_time = models.DateTimeField(auto_now_add=True)
    response_time = models.DateTimeField(auto_now=True)
    state = models.BooleanField(default=False)

    def serialize(self):
        return {
            "call": self.call,
            "task": self.task,
            "call_time": self.call_time,
            "response_time": self.response_time,
            "state": self.state,
            } 
