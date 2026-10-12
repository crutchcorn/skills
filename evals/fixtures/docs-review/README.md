# Inventory API

Query the available stock for an item:

```sh
curl http://localhost:3000/inventory/widget
```

The response includes the item's identifier and available quantity.

## Internal architecture

The inventory service owns stock counts. Reservation expiry is documented in
ARCHITECTURE.md. Maintainers should inspect src/reservations.mjs when that policy
changes.
