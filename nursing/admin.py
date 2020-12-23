from django.contrib import admin
from .models import User, Bed, MedicalRecord, Patient, Call, ProgramedTask

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_joined', 'is_active', 'is_staff', 'is_superuser')
    ordering = ('username',)
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'date_joined',)

class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'social_security_number', 'room_bed', 'admission')
    ordering = ('name',)
    search_fields = ('name', 'social_security_number', 'room_bed')
    list_filter = ('name', 'social_security_number', 'room_bed', 'admission',)

class BedAdmin(admin.ModelAdmin):
    list_display = ('id_bed', 'bed_patient', 'ocuped')
    ordering = ('-id_bed',)
    search_fields = ('id_bed', 'bed_patient', 'ocuped')
    list_filter = ('id_bed', 'bed_patient', 'ocuped',)

class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'medical_record_id', 'medical_record_file', 'short_diagnosis')
    ordering = ('patient',)
    search_fields = ('patient', 'medical_record_id', 'medical_record_file', 'short_diagnosis')
    list_filter = ('patient', 'medical_record_id', 'medical_record_file', 'short_diagnosis',)

class CallAdmin(admin.ModelAdmin):
    list_display = ('call', 'call_time', 'response_time', 'task', 'state')
    ordering = ('-call_time',)
    search_fields = ('call', 'call_time', 'response_time', 'task', 'state')
    list_filter = ('call', 'call_time', 'response_time', 'task', 'state',)

class ProgramedTaskAdmin(admin.ModelAdmin):
    list_display = ('programed_task', 'programed_time', 'response_time', 'task', 'state')
    ordering = ('-programed_time',)
    search_fields = ('programed_task', 'programed_time', 'response_time', 'task', 'state')
    list_filter = ('programed_task', 'programed_time', 'response_time', 'task', 'state',)


admin.site.register(User, UserAdmin)
admin.site.register(Bed, BedAdmin)
admin.site.register(MedicalRecord, MedicalRecordAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Call, CallAdmin)
admin.site.register(ProgramedTask, ProgramedTaskAdmin)
admin.site.site_header = "Nursing Site Administration"