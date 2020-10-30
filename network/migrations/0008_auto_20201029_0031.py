# Generated by Django 3.1 on 2020-10-29 00:31

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0007_auto_20201029_0028'),
    ]

    operations = [
        migrations.AlterField(
            model_name='myuser',
            name='mypost',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='provider', to='network.posts'),
        ),
    ]
