from django.contrib import admin
from .models import User, Bed, MedicalRecord, Patient, Call, Task

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'date_joined', 'is_active', 'is_staff', 'is_superuser')
    ordering = ('username',)
    search_fields = ('username', 'email')
    list_filter = ('is_staff', 'is_active', 'is_superuser', 'date_joined',)

class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'social_security_number', 'admission', 'short_diagnosis')
    ordering = ('name',)
    search_fields = ('name', 'social_security_number', 'short_diagnosis')
    list_filter = ('name', 'social_security_number', 'admission', 'short_diagnosis',)

class BedAdmin(admin.ModelAdmin):
    list_display = ('id_bed', 'bed_patient', 'ocuped')
    ordering = ('-id_bed',)
    search_fields = ('id_bed', 'bed_patient', 'ocuped')
    list_filter = ('id_bed', 'bed_patient', 'ocuped',)

class MedicalRecordAdmin(admin.ModelAdmin):
    list_display = ('patient', 'medical_record_id', 'medical_record_file')
    ordering = ('patient',)
    search_fields = ('patient', 'medical_record_id', 'medical_record_file')
    list_filter = ('patient', 'medical_record_id', 'medical_record_file',)

class CallAdmin(admin.ModelAdmin):
    list_display = ('call', 'call_time', 'response_time', 'task', 'state')
    ordering = ('-call_time',)
    search_fields = ('call', 'call_time', 'response_time', 'task', 'state')
    list_filter = ('call', 'call_time', 'response_time', 'task', 'state',)

class TaskAdmin(admin.ModelAdmin):
    list_display = ('bed', 'programed_time', 'done_time', 'task', 'state')
    ordering = ('-programed_time',)
    search_fields = ('bed', 'programed_time', 'done_time', 'task', 'state')
    list_filter = ('bed', 'programed_time', 'done_time', 'task', 'state',)


admin.site.register(User, UserAdmin)
admin.site.register(Bed, BedAdmin)
admin.site.register(MedicalRecord, MedicalRecordAdmin)
admin.site.register(Patient, PatientAdmin)
admin.site.register(Call, CallAdmin)
admin.site.register(Task, TaskAdmin)
admin.site.site_header = "Nursing Site Administration"