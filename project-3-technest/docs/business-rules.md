# Business Rules 

 1. Backend is the final authority for authentication and authorization.

2. Customer and Admin have different permissions.

3. Customer cannot perform Admin operations even if the frontend is manipulated.

4. Product price in the cart represents the current product price.

5. Order stores the price at the time of purchase.

6. Order delivery address is stored as a snapshot.

7. Product is deactivated rather than permanently deleted.

8. Out-of-stock products remain visible but cannot be purchased.

9. Order status must follow the defined transition flow.