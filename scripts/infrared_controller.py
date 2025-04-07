import RPi.GPIO as GPIO
import time

# Set up GPIO mode
GPIO.setmode(GPIO.BCM)

# Define the GPIO pin connected to the IR sensor
IR_SENSOR_PIN = 17  # GPIO17 (physical pin 11)

# Set up the IR sensor pin as input
GPIO.setup(IR_SENSOR_PIN, GPIO.IN)

print("Infrared sensor monitoring started. Press Ctrl+C to exit.")

try:
    while True:
        # Read the IR sensor state
        if GPIO.input(IR_SENSOR_PIN) == GPIO.HIGH:
            print("Object detected!")
        else:
            print("No object detected.")
        
        # Wait for a short period to avoid excessive CPU usage
        time.sleep(0.1)

except KeyboardInterrupt:
    print("\nExiting program.")

finally:
    # Clean up GPIO resources
    GPIO.cleanup()
    print("GPIO cleaned up.")