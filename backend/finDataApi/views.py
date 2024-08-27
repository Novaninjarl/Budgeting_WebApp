from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import finMetaSerializer, BalanceEstimatorSerializer
from .models import finMeta, BalanceEstimator
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
import json
import joblib
import pandas as pd
from django.views.decorators.csrf import csrf_exempt

class finMetaView(generics.ListCreateAPIView):
    serializer_class = finMetaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return finMeta.objects.filter(accountUser=user)

    def perform_create(self, serializer):
        serializer.save(accountUser=self.request.user)


class BalanceEstimatorView(generics.GenericAPIView):
    serializer_class = BalanceEstimatorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        meta = finMeta.objects.filter(accountUser=user).latest('shown_at')
        return BalanceEstimator.objects.filter(accountMeta=meta)

    def post(self, request, *args, **kwargs):
        user = self.request.user
        meta = finMeta.objects.filter(accountUser=user).latest('shown_at')
        
        # Expecting a list of transactions
        transactions = request.data

        if not isinstance(transactions, list):
            return Response(
                {"detail": "Expected a list of transactions."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Validate and create each transaction
        for transaction_data in transactions:
            serializer = self.get_serializer(data=transaction_data)
            if serializer.is_valid():
                serializer.save(accountMeta=meta)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response({"detail": "Transactions created successfully."}, status=status.HTTP_201_CREATED)
# Load model and polynomial features
poly_model = joblib.load("C:\\Budgeting web-app\\backend\\poly_model.pkl")
poly = joblib.load("C:\\Budgeting web-app\\backend\\poly_features.pkl")
@csrf_exempt
def predict_view(request):
   

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            date = data['date']
            spending = data['spending']
            
            # Prepare the input data for prediction
            input_data = pd.DataFrame([[date, spending]], columns=['date', 'spending'])
            input_data_poly = poly.transform(input_data)
            
            # Make prediction
            estimated_Balance = poly_model.predict(input_data_poly)
            print(estimated_Balance)
            return JsonResponse({'estimated_Balance': estimated_Balance[0]})
        except KeyError:
            return JsonResponse({'error': 'Invalid input'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)