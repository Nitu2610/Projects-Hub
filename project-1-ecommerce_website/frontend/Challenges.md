# Challenges  / Mistakes Notes


### 1. 🎯 How to think about initialState (5–step logic)
   #### Whenever you create a slice, ask these questions:
   - 1️⃣ What data does this slice manage?
        - A slice is responsible for 1 “domain” of your app.
            Examples:
            Product slice → product list
            Cart slice → items in the cart
            Auth slice → user data
            Order slice → order details
            Each slice’s initial state should contain the variables required to represent that domain clearly.

- 2️⃣ What does the UI need to display?
    - Redux state exists only to support UI rendering.
            Ask:
            👉 “What values does the UI need again and again?”
            For Cart UI, you need:
            Items list
            Total quantity (for badge)
            Total price
            Therefore, these 3 must be in initialState.

- 3️⃣ What values will change over time?
    -   Anything that changes must be stored in state.
            Example for Cart:
            More items added → cart changes
            Quantity updated → cart changes
            Cart cleared → cart changes
            These need a state structure that supports mutation:
            items (array)
            totalQuantity (number)
            totalPrice (number)
            Static things don’t go in state.

- 4️⃣ What values should be fast to compute?
    - Some values are expensive to compute every time.
            Example:
            If cart has 30 items, calculating total price each time in UI could be slow.
            So we store:
            totalPrice
            totalQuantity
            This makes UI very fast.

- 5️⃣ What values need to persist or be easily accessed?
    - If multiple components need the same value, store it in Redux instead of props.
            Cart example:
            Navbar → cart badge
            Cart page → full details
            Checkout page → cart summary
            Therefore, cart info must live inside Redux.
---

### 2. Wrong Chakra _hover Syntax 
- ❌ Mistake ==> `_hover="box-shadow: 0px 4px 10px"`
- ✅ Fix ==> `_hover={{ boxShadow: "0px 4px 10px" }}`
- 📌 Rule: Chakra styles are objects, not CSS strings.