document.addEventListener("DOMContentLoaded", () => {
    /* ================= 1. ELEMENTS ================= */
    const bookingForm = document.getElementById("bookingForm");
    const guestsInput = document.getElementById("guests");
    const roomSelect = document.getElementById("room");
    
    // Modal Elements
    const priceModal = document.getElementById("priceModal");
    const paymentModal = document.getElementById("paymentModal");
    const successModal = document.getElementById("successModal");
    const priceText = document.getElementById("priceText");
    const exitBtn = document.getElementById("exitBtn");
    const payBtn = document.getElementById("payBtn");
    const successExitBtn = document.getElementById("successExitBtn");
    const paymentButtons = document.querySelectorAll(".paymentBtn");
    
    // Mobile Menu
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
  
    /* ================= 2. CONFIG ================= */
    const roomPrices = {
      "deluxe-suite": 399,
      "family-suite": 599,
      "luxury-penthouse": 799,
    };
  
    /* ================= 3. INITIALIZE CALENDAR ================= */
    // Allow input lets you type the date manually if needed
    const fpConfig = { dateFormat: "d/m/Y", minDate: "today", allowInput: true, disableMobile: "true" };
    
    flatpickr("#arrival", fpConfig);
    flatpickr("#departure", fpConfig);
  
    /* ================= 4. SAFETY FUNCTION: GET DATE ================= */
    // This function guarantees we get a date, even if the user typed it in
    function getSafeDate(id) {
        const input = document.getElementById(id);
        if (!input) return null;

        // Try getting date from Flatpickr (Best for clicks)
        if (input._flatpickr && input._flatpickr.selectedDates.length > 0) {
            return input._flatpickr.selectedDates[0];
        }

        // Fallback: Read the text manually (Best for typing/autofill)
        const val = input.value.trim(); // e.g., "12/02/2026"
        if (val.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
            const parts = val.split("/"); 
            // Create Date: Year, Month (0-11), Day
            const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            if (!isNaN(d.getTime())) return d;
        }
        return null;
    }
  
    /* ================= 5. SUBMIT LOGIC ================= */
    if (bookingForm) {
      bookingForm.addEventListener("submit", (e) => {
        e.preventDefault();
  
        // 1. Get Values using the Safety Function
        const arrivalDate = getSafeDate("arrival");
        const departureDate = getSafeDate("departure");
        const guests = parseInt(guestsInput.value) || 0;
        const room = roomSelect.value;
  
        // 2. Debugging (Check console if it fails)
        console.log("Arrival:", arrivalDate, "Departure:", departureDate, "Room:", room);

        // 3. Validation
        if (!arrivalDate || !departureDate) {
          alert("Please select both valid arrival and departure dates.");
          return;
        }
  
        if (departureDate <= arrivalDate) {
          alert("Departure date must be after arrival date.");
          return;
        }
  
        if (guests <= 0) {
          alert("Please enter at least 1 guest.");
          return;
        }
  
        if (!room) {
          alert("Please select a room type.");
          return;
        }
  
        // 4. Calculation
        const oneDay = 1000 * 60 * 60 * 24;
        const diffTime = departureDate - arrivalDate; 
        const nights = Math.ceil(diffTime / oneDay);
  
        const roomsRequired = Math.ceil(guests / 3);
        const pricePerNight = roomPrices[room] || 0;
        const totalPrice = nights * pricePerNight * roomsRequired;
  
        // 5. Show Result
        if (priceText) {
          priceText.innerHTML = `
            <strong>Room Type:</strong> ${room.replace("-", " ").toUpperCase()}<br>
            <strong>Guests:</strong> ${guests} (${roomsRequired} Room(s))<br>
            <strong>Duration:</strong> ${nights} Night(s)<br>
            <strong>Price/Night:</strong> $${pricePerNight}<br>
            <hr>
            <strong style="font-size: 1.2rem;">Total Price: $${totalPrice}</strong>
          `;
        }
        
        if (priceModal) priceModal.classList.add("active");
      });
    }
  
    /* ================= 6. MODAL & MENU HANDLERS ================= */
    if (exitBtn) exitBtn.addEventListener("click", () => priceModal.classList.remove("active"));
    
    if (payBtn) payBtn.addEventListener("click", () => {
        priceModal.classList.remove("active");
        if (paymentModal) paymentModal.classList.add("active");
    });

    paymentButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            if(paymentModal) paymentModal.classList.remove("active");
            if(successModal) successModal.classList.add("active");
        });
    });

    if (successExitBtn) successExitBtn.addEventListener("click", () => {
        successModal.classList.remove("active");
        bookingForm.reset(); // Clear form after success
    });
    
    // Close modals on outside click
    window.addEventListener("click", (e) => {
        if (e.target == priceModal) priceModal.classList.remove("active");
        if (e.target == paymentModal) paymentModal.classList.remove("active");
        if (e.target == successModal) successModal.classList.remove("active");
    });

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
        navLinks.querySelectorAll("a").forEach(a => {
            a.addEventListener("click", () => navLinks.classList.remove("open"));
        });
    }
});