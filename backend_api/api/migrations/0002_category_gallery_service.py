# Generated by Django 3.2.7 on 2023-01-28 10:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django_ckeditor_5.fields
import shortuuid.django_fields


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cid', shortuuid.django_fields.ShortUUIDField(alphabet='abcdefghijklmnopqrstuvxyz123', length=5, max_length=25, prefix='')),
                ('image', models.ImageField(blank=True, default='category.jpg', null=True, upload_to='category')),
                ('title', models.CharField(max_length=1000)),
                ('slug', models.SlugField(unique=True)),
                ('description', models.TextField(blank=True, null=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name_plural': 'Category',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sid', shortuuid.django_fields.ShortUUIDField(alphabet='abcdefghijklmnopqrstuvxyz', length=10, max_length=25, prefix='')),
                ('image', models.ImageField(default='service.jpg', upload_to='service-images')),
                ('title', models.CharField(max_length=1000)),
                ('description', django_ckeditor_5.fields.CKEditor5Field()),
                ('price', models.DecimalField(decimal_places=2, default=1.99, max_digits=12)),
                ('tags', models.CharField(blank=True, max_length=10000, null=True)),
                ('features', models.CharField(blank=True, max_length=10000, null=True)),
                ('phone', models.CharField(max_length=1000)),
                ('address', models.CharField(max_length=1000)),
                ('country', models.CharField(blank=True, max_length=100, null=True)),
                ('state', models.CharField(blank=True, max_length=100, null=True)),
                ('zipcode', models.CharField(max_length=1000)),
                ('longitude', models.CharField(max_length=1000)),
                ('latitude', models.CharField(max_length=1000)),
                ('status', models.CharField(choices=[('live', 'Live'), ('in_review', 'In review'), ('pending', 'Pending'), ('cancelled', 'Cancelled'), ('finished', 'Finished')], default='in_review', max_length=100)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('category', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.category')),
                ('liked', models.ManyToManyField(blank=True, related_name='likes', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name_plural': '1. Service',
                'ordering': ['-date'],
            },
        ),
        migrations.CreateModel(
            name='Gallery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(default='gallery.jpg', upload_to='userauths.user_directory_path')),
                ('title', models.CharField(blank=True, max_length=1000, null=True)),
                ('active', models.BooleanField(default=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('gid', shortuuid.django_fields.ShortUUIDField(alphabet='abcdefghijklmnopqrstuvxyz1231234567890', length=10, max_length=25, prefix='')),
                ('service', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='service_gallery', to='api.service')),
            ],
            options={
                'verbose_name_plural': 'Service Images',
                'ordering': ['date'],
            },
        ),
    ]
