# Generated by Django 4.2.5 on 2023-10-19 15:59

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Backend', '0012_alter_userhealthinfo_estimated_completion_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userhealthinfo',
            name='estimated_completion_date',
            field=models.DateField(default=datetime.date(2023, 10, 19)),
        ),
    ]
