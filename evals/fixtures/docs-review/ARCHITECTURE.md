# Inventory architecture

The inventory service owns stock counts. Reservations expire after 30 minutes.
The worker releases reserved stock when the reservation expires.
