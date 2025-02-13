document.addEventListener("DOMContentLoaded", function () {
    const pinLocationBtn = document.getElementById("pin-location-btn");
    const locationInfo = document.getElementById("location-info");
    const orderBtn = document.querySelector(".order-btn");

    let userAddress = ""; // Stores the readable location

    if (pinLocationBtn && locationInfo && orderBtn) {
        // Disable the order button initially
        orderBtn.style.pointerEvents = "none";
        orderBtn.style.opacity = "0.5";

        pinLocationBtn.addEventListener("click", function () {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        
                        // Show temporary message
                        locationInfo.innerHTML = "🔍 Fetching address...";

                        // Convert coordinates to human-readable address
                        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
                            .then(response => response.json())
                            .then(data => {
                                if (data && data.display_name) {
                                    userAddress = data.display_name; // Store the location
                                    locationInfo.innerHTML = `✅ Location Pinned! <br> ${userAddress}`;
                                    
                                    // Enable the order button
                                    orderBtn.style.pointerEvents = "auto";
                                    orderBtn.style.opacity = "1";

                                    // Update WhatsApp Order Button with location
                                    orderBtn.href = generateWhatsAppMessage(userAddress);
                                } else {
                                    locationInfo.innerHTML = "❌ Unable to fetch address.";
                                }
                            })
                            .catch(() => {
                                locationInfo.innerHTML = "❌ Address lookup failed. Try again.";
                            });

                    },
                    function (error) {
                        let errorMessage = "❌ Unable to retrieve location.";
                        switch (error.code) {
                            case error.PERMISSION_DENIED:
                                errorMessage = "❌ Location access denied. Please enable location in your browser settings.";
                                break;
                            case error.POSITION_UNAVAILABLE:
                                errorMessage = "❌ Location information is unavailable.";
                                break;
                            case error.TIMEOUT:
                                errorMessage = "❌ The request to get user location timed out.";
                                break;
                        }
                        locationInfo.innerHTML = errorMessage;
                    }
                );
            } else {
                locationInfo.innerHTML = "❌ Geolocation is not supported by your browser.";
            }
        });

        function generateWhatsAppMessage(location) {
            const phoneNumber = "254712345678"; // Replace with your WhatsApp number
            const message = `Hello, I want to place an order! My delivery location is: ${location}`;
            return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        }
    } else {
        console.error("One or more elements (pinLocationBtn, locationInfo, orderBtn) are missing in the DOM.");
    }
});
