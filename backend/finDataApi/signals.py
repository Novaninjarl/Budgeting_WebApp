from django.db.models.signals import post_save
from django.dispatch import receiver
import pandas as pd
from django.conf import settings
import os
import logging
from .models import BalanceEstimator
from .model_test import train_model  # Import my model training function

logger = logging.getLogger(__name__)

@receiver(post_save, sender=BalanceEstimator)
def update_csv_and_train_model(sender, instance, **kwargs):
    logger.info('Post-save signal triggered for BalanceEstimator')
    
    # Update the CSV file with the latest data
    queryset = BalanceEstimator.objects.all().values('income', 'spending', 'estimatedBalance', 'date')
    df = pd.DataFrame(list(queryset))
    file_path = os.path.join(settings.BASE_DIR, 'BalanceEstimator.csv')
    logger.info(f'CSV file path: {file_path}')
    df.to_csv(file_path, index=False)
    logger.info('CSV file updated successfully')
    
    # Retrain the model with the updated data
    try:
        mse, r2 = train_model()  # Train the model using your existing function
        logger.info(f'Model retrained successfully. MSE: {mse}, R2: {r2}')
    except Exception as e:
        logger.error(f'Error retraining the model: {str(e)}')
