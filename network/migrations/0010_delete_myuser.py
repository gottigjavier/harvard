# Generated by Django 3.1 on 2020-10-29 01:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('admin', '0003_logentry_add_action_flag_choices'),
        ('network', '0009_auto_20201029_0041'),
    ]

    operations = [
        migrations.DeleteModel(
            name='MyUser',
        ),
    ]
