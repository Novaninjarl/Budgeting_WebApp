
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import mean_squared_error, r2_score
import joblib
def train_model():
    # Load data
    file_path = "C:\\Budgeting web-app\\backend\\BalanceEstimator.csv"
    data = pd.read_csv(file_path)

    # Convert date to numerical format
    data['date'] = pd.to_numeric(data['date'], errors='coerce')

    # Features and target variable
    X = data[['date', 'spending']]
    y = data['estimatedBalance']

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Initialize PolynomialFeatures
    poly = PolynomialFeatures(degree=2)
    X_poly = poly.fit_transform(X)

    # Initialize and train Polynomial Regression model
    poly_model = LinearRegression()
    poly_model.fit(X_poly, y)

    # Make predictions
    y_pred_poly = poly_model.predict(X_poly)

    # Evaluate the model
    mse_poly = mean_squared_error(y, y_pred_poly)
    r2_poly = r2_score(y, y_pred_poly)
    #creates or updates the pkl file used to store the model
    joblib.dump(poly_model, 'poly_model.pkl')
    joblib.dump(poly, 'poly_features.pkl')
    return mse_poly, r2_poly
