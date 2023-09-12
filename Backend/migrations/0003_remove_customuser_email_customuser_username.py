# Generated by Django 4.2.5 on 2023-09-06 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Backend', '0002_alter_customuser_options_alter_customuser_managers_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='customuser',
            name='email',
        ),
        migrations.AddField(
            model_name='customuser',
            name='username',
            field=models.CharField(default=2, max_length=150, unique=True),
            preserve_default=False,
        ),
    ]
