#include <SPI.h>
#include <ArduinoHttpClient.h>
#include <WiFiS3.h>
#include "ArduinoGraphics.h"
#include "Arduino_LED_Matrix.h"

// Replace with your network credentials
char ssid[] = "";         // your network SSID (name)
char pass[] = "";     // your network password

// Dummy API endpoint (jsonplaceholder)
char serverAddress[] = "jsonplaceholder.typicode.com";  // Server address (domain)
int port = 80;                                          // HTTP port
const char* binNumber = "BIN-001";
ArduinoLEDMatrix matrix;
const char* testUrl = "http://www.google.com"; // A site to check internet access

WiFiClient wifi;
HttpClient client = HttpClient(wifi, serverAddress, port);

void setup() {
  // Start Serial Monitor
  Serial.begin(9600);

  // Initialize the matrix
  matrix.begin();
  scroll_text(binNumber); // Start scrolling the text

  // Connect to Wi-Fi
  connectToWiFi();

  // Check connectivity to API server
  checkApiServer();
}

void loop() {
  scroll_text(binNumber);
}

// Function to scroll text
void scroll_text(const char* text) {
    matrix.beginDraw();
    matrix.stroke(0xFFFFFFFF);
    matrix.textScrollSpeed(70);
    matrix.textFont(Font_5x7);
    matrix.beginText(0, 1, 0xFFFFFF);
    matrix.println(text);
    matrix.endText(SCROLL_LEFT);
    matrix.endDraw();
}

void connectToWiFi() {
  Serial.println("Connecting to WiFi...");

  while (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(ssid, pass);
    delay(10000); // Wait 10 seconds before retrying
    Serial.print(".");
  }

  Serial.println("\nConnected to WiFi!");
}

void checkApiServer() {
  Serial.println("Checking connectivity to API server...");

  if (wifi.connect(serverAddress, port)) {
    Serial.println("Server is reachable. Sending PUT request to update post...");
    updatePost();
  } else {
    Serial.println("Server is not reachable. Cannot send PUT request.");
    Serial.println("Next Steps:");
    Serial.println("1. Check your router settings and logs for any connection issues.");
    Serial.println("2. Verify DNS configuration; consider using Google DNS (8.8.8.8).");
    Serial.println("3. Ensure there are no captive portals interfering with your connection.");
  }
}

void updatePost() {
  Serial.println("Sending PUT request to update post...");

  // Dummy endpoint for updating a post
  String requestPath = "/posts/1";
  String contentType = "application/json";

  // Data to be sent in PUT request
  String requestBody = "{\"id\": 1, \"title\": \"Updated Title\", \"body\": \"This is the updated body of the post\", \"userId\": 1}";

  client.beginRequest();
  client.put(requestPath);
  client.sendHeader("Content-Type", contentType);
  client.sendHeader("Content-Length", requestBody.length());
  client.sendHeader("Connection", "close");
  client.beginBody();
  client.print(requestBody);
  client.endRequest();

  // Receive and print response
  int statusCode = client.responseStatusCode();
  String response = client.responseBody();

  Serial.print("Status code: ");
  Serial.println(statusCode);
  Serial.print("Response: ");
  Serial.println(response);

  if (statusCode == 200) {
    Serial.println("Post updated successfully!");
    scroll_text("message sent successfully!");
  } else {
    Serial.println("Failed to update post.");
  }

  // Close connection
  client.stop();
}
