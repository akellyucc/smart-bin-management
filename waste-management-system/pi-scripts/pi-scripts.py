import os
import time
import requests
import RPi.GPIO as GPIO
from gps import gps, WATCH_ENABLE
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Constants
BIN_ID = 'BIN-001'  # Change this for each bin
API_ENDPOINT = 'http://<your-server-ip>:<your-server-port>/api/sensors/update-status'  # Update with your server details
API_KEY = os.getenv('API_KEY')  # Load API key from environment variables

# GPIO setup for HC-SR04
TRIG = 23  # GPIO pin connected to TRIG of the sensor
ECHO = 24  # GPIO pin connected to ECHO of the sensor

GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIG, GPIO.OUT)
GPIO.setup(ECHO, GPIO.IN)

# GPS setup
gpsd = gps(mode=WATCH_ENABLE)  # Start GPS daemon

# Function to get the distance using the ultrasonic sensor
def get_distance():
    GPIO.output(TRIG, True)
    time.sleep(0.00001)  # Trigger the sensor
    GPIO.output(TRIG, False)

    pulse_start = time.time()
    while GPIO.input(ECHO) == 0:
        pulse_start = time.time()

    pulse_end = time.time()
    while GPIO.input(ECHO) == 1:
        pulse_end = time.time()

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # Calculate distance in cm
    distance = round(distance, 2)

    return distance

# Function to calculate bin fill level
def calculate_fill_level(distance, bin_height=100):  # bin_height in cm
    fill_level = ((bin_height - distance) / bin_height) * 100
    fill_level = max(0, min(100, fill_level))  # Ensure fill level is between 0 and 100%
    return int(fill_level)

# Function to get GPS coordinates
def get_gps_coordinates():
    gpsd.next()  # Get the latest GPS data
    latitude = gpsd.fix.latitude if gpsd.fix.mode >= 2 else None
    longitude = gpsd.fix.longitude if gpsd.fix.mode >= 2 else None
    return latitude, longitude

# Function to send data to the backend
def send_data(bin_id, fill_level, latitude, longitude):
    try:
        payload = {
            'bin_id': bin_id,
            'fill_level': fill_level,
            'latitude': latitude,
            'longitude': longitude
        }
        headers = {'Authorization': f'Bearer {API_KEY}'}  # Include the API key in the headers
        response = requests.post(API_ENDPOINT, json=payload, headers=headers)

        if response.status_code == 200:
            print(f"Data sent successfully: {payload}")
        else:
            print(f"Failed to send data: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"Error sending data: {e}")

# Main function to continuously monitor the bin status
def monitor_bin():
    try:
        while True:
            distance = get_distance()
            fill_level = calculate_fill_level(distance)
            latitude, longitude = get_gps_coordinates()

            print(f"Distance: {distance} cm, Fill level: {fill_level}%, Location: ({latitude}, {longitude})")

            # Send the fill level data to the server
            send_data(BIN_ID, fill_level, latitude, longitude)

            # Wait for a while before the next reading
            time.sleep(60)  # Delay in seconds
    except KeyboardInterrupt:
        print("Stopping the script...")
    finally:
        GPIO.cleanup()

if __name__ == '__main__':
    monitor_bin()
