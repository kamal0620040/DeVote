# Generated by Django 4.2.5 on 2023-09-28 15:57

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Credential',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('privatekey', models.CharField(max_length=240)),
                ('citizenshipImage', models.URLField()),
                ('currentPhoto', models.URLField()),
            ],
        ),
    ]
