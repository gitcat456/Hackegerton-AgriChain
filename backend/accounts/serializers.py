from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserSignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'phone_number', 'password', 'confirm_password', 'role')
        read_only_fields = ('role',)

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password and Confirm Password must match."})
        return attrs

    def create(self, validated_data):
        role = self.context.get('role')  # passed from view
        validated_data.pop('confirm_password')  # remove confirm_password
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            phone_number=validated_data.get('phone_number', ''),
            role=role
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
