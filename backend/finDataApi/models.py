from django.db import models
from django.contrib.auth.models import User

class finMeta(models.Model):
    accountName = models.CharField(max_length=50)
    balance = models.IntegerField()
    accountUser = models.ForeignKey(User, on_delete=models.CASCADE, related_name="users")
    shown_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.accountName} | Balance: {self.balance}"

class BalanceEstimator(models.Model):
    income = models.FloatField()
    spending = models.FloatField()
    estimatedBalance = models.FloatField()
    date =models.FloatField()
    accountMeta = models.ForeignKey(finMeta, on_delete=models.CASCADE, related_name="estimator")

    def __str__(self):
        return f"{self.accountMeta.accountName} | Income: {self.income} | Estimated Date: {self.date}"
