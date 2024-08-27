from django.urls import path
from . import views

urlpatterns = [
    path('bank-account/info/', views.finMetaView.as_view(), name="meta_data"),
    path('transaction/info/', views.BalanceEstimatorView.as_view(), name="estimator"),
    path('prediction/',views.predict_view,name="prediction")
]