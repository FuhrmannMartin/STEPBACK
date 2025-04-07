import RPi.GPIO as GPIO
import time
import sys  # Import sys to flush output

# Define GPIO pins
TRIGGER_PIN = 23  # Replace with your trigger pin (e.g., GPIO23)
ECHO_PIN = 24     # Replace with your echo pin (e.g., GPIO24)

# Set up GPIO mode
GPIO.setmode(GPIO.BCM)
GPIO.setup(TRIGGER_PIN, GPIO.OUT)
GPIO.setup(ECHO_PIN, GPIO.IN)

def measure_distance():
    # Send a 10µs pulse to the trigger pin
    GPIO.output(TRIGGER_PIN, GPIO.HIGH)
    time.sleep(0.00001)  # 10 microseconds
    GPIO.output(TRIGGER_PIN, GPIO.LOW)

    # Wait for the echo pin to go HIGH
    start_time = time.time()
    while GPIO.input(ECHO_PIN) == GPIO.LOW:
        start_time = time.time()

    # Wait for the echo pin to go LOW
    end_time = time.time()
    while GPIO.input(ECHO_PIN) == GPIO.HIGH:
        end_time = time.time()

    # Calculate the duration of the pulse
    duration = end_time - start_time

    # Calculate the distance (speed of sound = 34300 cm/s)
    distance = (duration * 34300) / 2  # Divide by 2 for round trip

    return distance

try:
    while True:
        distance = measure_distance()
        if distance <= 10:
            print("hit", flush=True)  # Print "score" and flush the output
            time.sleep(1.0)
        time.sleep(0.01)  # Small delay to avoid excessive CPU usage

except KeyboardInterrupt:
    print("\nExiting program.")

finally:
    GPIO.cleanup()
    print("GPIO cleaned up.")