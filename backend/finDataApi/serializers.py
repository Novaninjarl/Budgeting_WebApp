from rest_framework import serializers
from .models import finMeta, BalanceEstimator

class finMetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = finMeta
        fields = ["id", "accountName", "balance", "accountUser", "shown_at"]
        extra_kwargs = {
            "accountUser": {"read_only": True},
            "shown_at": {"read_only": True},
        }

class BalanceEstimatorSerializer(serializers.ModelSerializer):
    class Meta:
        model = BalanceEstimator
        fields = ["id", "income", "spending", "estimatedBalance", "date", "accountMeta"]
        extra_kwargs = {
            "accountMeta": {"read_only": True},
        }