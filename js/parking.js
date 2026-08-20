import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


document.addEventListener("DOMContentLoaded", () => {

    const slotCards = document.querySelectorAll(".slot-card");
    const selectedSlot = document.getElementById("selectedSlot");
    const bookingForm = document.getElementById("bookingForm");

    let currentSlot = null;

    let reservations =
        JSON.parse(localStorage.getItem("parkingReservations")) || {};


    // --------------------------------------------------
    // SLOT SELECTION
    // --------------------------------------------------

    slotCards.forEach((slot) => {

        slot.addEventListener("click", () => {

            const slotNumber = slot.dataset.slot;


            // Reserved slot - show vehicle details
            if (slot.classList.contains("slot-reserved")) {

                const reservation = reservations[slotNumber];

                if (reservation) {

                    alert(
                        `PARKING SLOT DETAILS\n\n` +
                        `Slot: ${slotNumber}\n` +
                        `Vehicle: ${reservation.vehicleNumber}\n` +
                        `Duration: ${reservation.duration}\n` +
                        `Status: Reserved`
                    );

                } else {

                    alert(
                        `Slot: ${slotNumber}\n\n` +
                        `Status: Reserved`
                    );

                }

                return;
            }


            // Available slot
            if (slot.classList.contains("slot-available")) {

                slotCards.forEach((item) => {
                    item.classList.remove("selected");
                });

                slot.classList.add("selected");

                currentSlot = slotNumber;

                selectedSlot.textContent = currentSlot;

            }

        });

    });


    // --------------------------------------------------
    // RESERVATION FORM
    // --------------------------------------------------

    bookingForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // Check slot
            if (!currentSlot) {

                alert(
                    "Please select an available parking slot."
                );

                return;
            }


            // Get vehicle number
            const vehicleNumber =
                document
                    .getElementById("vehicleNumber")
                    .value
                    .trim()
                    .toUpperCase();


            // Get duration
            const duration =
                document.getElementById("duration").value;


            // Validate
            if (!vehicleNumber || !duration) {

                alert(
                    "Please complete all reservation details."
                );

                return;
            }


            // --------------------------------------------------
            // SAVE LOCALLY
            // --------------------------------------------------

            reservations[currentSlot] = {

                vehicleNumber: vehicleNumber,

                duration: duration,

                status: "Reserved",

                reservedAt:
                    new Date().toLocaleString()

            };


            localStorage.setItem(
                "parkingReservations",
                JSON.stringify(reservations)
            );


            // --------------------------------------------------
            // SAVE TO FIREBASE
            // --------------------------------------------------

            try {

                await addDoc(
                    collection(db, "reservations"),
                    {

                        slotNumber: currentSlot,

                        vehicleNumber: vehicleNumber,

                        duration: duration,

                        status: "Reserved",

                        reservedAt:
                            serverTimestamp()

                    }
                );


                // --------------------------------------------------
                // UPDATE SLOT UI
                // --------------------------------------------------

                const selectedCard =
                    document.querySelector(
                        `[data-slot="${currentSlot}"]`
                    );


                if (selectedCard) {

                    selectedCard.classList.remove(
                        "slot-available",
                        "selected"
                    );

                    selectedCard.classList.add(
                        "slot-reserved"
                    );


                    selectedCard.disabled = false;


                    const statusText =
                        selectedCard.querySelector("small");


                    if (statusText) {

                        statusText.textContent =
                            "Reserved";

                    }

                }


                // --------------------------------------------------
                // SUCCESS MESSAGE
                // --------------------------------------------------

                alert(
                    `Parking reservation successful!\n\n` +
                    `Slot: ${currentSlot}\n` +
                    `Vehicle: ${vehicleNumber}\n` +
                    `Duration: ${duration}`
                );


                // Reset form

                bookingForm.reset();

                selectedSlot.textContent = "—";

                currentSlot = null;


            } catch (error) {

                console.error(
                    "Firebase Error:",
                    error
                );


                alert(
                    "Reservation could not be saved to Firebase.\n\n" +
                    "Please check your Firebase Firestore setup."
                );

            }

        }
    );

});