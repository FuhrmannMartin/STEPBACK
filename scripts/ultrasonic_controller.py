import RPi.GPIO as GPIO
import time

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
    while GPIO.input(ECHO_PIN) == GPIO.LOW:
        start_time = time.time()

    # Wait for the echo pin to go LOW
    while GPIO.input(ECHO_PIN) == GPIO.HIGH:
        end_time = time.time()

    # Calculate the duration of the pulse
    duration = end_time - start_time

    # Calculate the distance (speed of sound = 34300 cm/s)
    distance = (duration * 34300) / 2  # Divide by 2 for round trip

    return distance

try:
    print("Ultrasonic sensor started. Press Ctrl+C to stop.")
    while True:
        distance = measure_distance()
        print(f"Distance: {distance:.2f} cm")
        time.sleep(1)  # Wait 1 second before the next measurement

except KeyboardInterrupt:
    print("\nExiting program.")

finally:
    GPIO.cleanup()
    print("GPIO cleaned up.")