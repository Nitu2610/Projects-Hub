# Development Challenges

## 1.Authorization Middleware — Input Normalization

- #### Problem / Challenge

  I had an authorization middleware that needed to support both:

    - A single role, such as `"admin"`
    - Multiple roles, such as `["admin", "customer"]`

  The initial function signature was:

  ```ts
    const authorize = (role: string[] | string) => {
      // ...
    };
  ```

  Inside the middleware, I was checking:

  ```ts
    if (!role.includes(req.user.role) || role !== req.user.role) {
      // Forbidden
    }
  ```

  This caused a logical problem because `role` could be either a `string` or an array.

  For example:

  ```ts
    role = ["admin", "customer"];
    req.user.role = "admin";
  ```

  Then: `role.includes(req.user.role)`, returns: `true`, but: ` role !== req.user.role`, also returns: `true`. because an array is not equal to a string.

  Therefore:
  ```text
  !true || true
  false || true
        ↓
        true
        ↓
  Forbidden ❌
  ```

  Even though `"admin"` was an allowed role.


- #### Possible Solutions

  - **Solution 1:** Use `if/else` for each input type
    We can explicitly check whether the input is a string or an array.

    ```ts
    const authorize = (role: string[] | string) => {
      return (req: Request, res: Response, next: NextFunction) => {

        if (typeof role === "string") {
          if (role !== req.user.role) {
            return res.status(403).json({...
            });
          }
        } else {
          if (!role.includes(req.user.role)) {
            return res.status(403).json({...
            });
          }
        }

        next();
      };
    };
    ```
    **Advantages**
    - Easy to understand.
    - Handles both input types explicitly.
    - No change required at the routing level.

    **Disadvantages**
    - Repeated error-handling code.
    - More branches.
    - Becomes harder to maintain if more input formats are introduced.
    - The actual authorization logic is duplicated.

  - **Solution 2:** Force every route to pass an array
    We could change the middleware contract so that it accepts only: `string[]`
  Then every route would use: `authorize(["admin"])`, instead of: `authorize("admin")`. For multiple roles: `authorize(["admin", "customer"])`
  The middleware becomes simpler:

    ```ts
    const authorize = (roles: string[]) => {
      return (req: Request, res: Response, next: NextFunction) => {

        if (!roles.includes(req.user.role)) {
          return res.status(403).json({
          ...
          });
        }

        next();
      };
    };
    ```

    **Advantages**
    - Very simple middleware.
    - One consistent input type.
    - No need for type checking inside the function.

    **Disadvantages**
    - Every caller has to know that even a single role must be wrapped in an array: `authorize(["admin"])`
    - This adds unnecessary work to every route.
    - The middleware's interface becomes slightly less convenient.

  - **Solution 3:** Normalize the input inside `authorize()` — Preferred

    Keep the external API flexible: `authorize("admin")` or: `authorize(["admin", "customer"])`
    Then normalize the input immediately inside the function:

    ```ts
    const authorize = (roles: string[] | string) => {
      return (req: Request, res: Response, next: NextFunction) => {

        const allowedRoles = Array.isArray(roles)
          ? roles
          : [roles];

        if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({...});
        }

        next();
      };
    };
    ```

    Now the internal logic always works with: `string[]`
    Regardless of what the caller provides.

- **Why We Chose Normalization**
  The main reason is:
  > **Normalize different input shapes into one consistent internal representation at the boundary of the function.**

  Before normalization:

  ```text
  authorize()
      │
      ├── "admin"
      │
      └── ["admin", "customer"]
  ```
  After normalization:

  ```text
  authorize()
      │
      ├── "admin"
      │       ↓
      │   ["admin"]
      │
      └── ["admin", "customer"]
              ↓
      ["admin", "customer"]

              ↓
        One consistent format
              ↓
            includes()
  ```

  This allows us to write the authorization logic only once: `allowedRoles.includes(req.user.role)`, instead of maintaining separate logic for strings and arrays.

- **Why Not Just Change the Routes?**
  We could require every route to pass an array: `authorize(["admin"])`
  But this pushes an implementation detail onto every caller.
  With normalization, the caller can express the requirement naturally:   `authorize("admin")` and: `authorize(["admin", "customer"])`

  The middleware takes responsibility for converting those inputs into the format it needs.

  This follows a useful design principle:

  > **Keep the external interface convenient and normalize inputs internally.**

- **Final Design**

  ```ts
  const authorize = (roles: string[] | string) => {
    return (req: Request, res: Response, next: NextFunction) => {

      const allowedRoles = Array.isArray(roles)
        ? roles
        : [roles];

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      next();
    };
  };
  ```
- **Usage:** `authorize("admin")` or: `authorize(["admin", "customer"])`
  - ---
- **Interview Question and Answer -** 

  - Question: 
    Suppose you have an authorization middleware that needs to accept either one role or multiple roles. How would you design it, and why?

  - Answer:
    > I initially considered handling the two cases separately using an `if/else`, where I would compare the user's role directly when a string was provided and use `includes()` when an array was provided.
    >
    > Another option would be to change the middleware contract and require every route to always pass an array, even for a single role.
    >
    > I preferred normalizing the input inside the authorization middleware. If a single string is received, I convert it into an array containing that role. If an array is already provided, I use it as-is.
    >
    > This gives the middleware one consistent internal representation, so the authorization logic only needs one check using `includes()`. It also keeps the routing code clean because callers can pass either `"admin"` or `["admin", "customer"]`.
    >
    > The general principle I took from this is to normalize different input shapes at the boundary of a function and keep the internal logic working with one consistent data structure. This reduces branching, avoids duplication, and makes the code easier to maintain.

  - ---

- **Key Learning**
  - **Technical lesson**

    ```text
    Different input types
          ↓
    Normalize
          ↓
    One internal representation
          ↓
    One validation/authorization logic
    ```

  - **Design lesson**

    > **Don't make every caller adapt to your internal implementation if the function can easily normalize the input itself.**

  - **Interview keywords**
    If discussing this in an interview, useful concepts are:

    - Input normalization
    - Consistent internal representation
    - Separation of concerns
    - Reducing duplication
    - API/interface design
    - Maintainability
    - Single responsibility
    - Boundary validation/normalization
---

## 2. Category Hierarchy — Designing Parent-Child Relationships
  
  ### Problem
  The application needed to support categories with a parent-child relationship.

  Initially, the category model was being designed around separate fields such as:
  ```ts
  interface ICategory {
    parentName: string;
    normalizedParentName: string;
    childName?: string;
    normalizedChildName?: string;
    active: boolean;
  }
  ```

  This works for a simple two-level structure:

  ```text
  Electronics
  ├── Mobile Phones
  ├── Laptops
  └── Headphones
  ```

  However, it creates a problem if the business later needs more levels:

  ```text
  Electronics
  └── Mobile Phones
      └── Android Phones
          └── Samsung
  ```

The schema would need to be changed to support these additional levels.

So the challenge was:

> **How should I model categories so that a parent can have multiple children without making the schema dependent on a fixed number of hierarchy levels?**

---

### Approaches Considered

- **First- Store Parent and Child in the Same Document**

  For example:

  ```json
  {
    "parentName": "Electronics",
    "childName": "Mobile Phones"
  }
  ```

  This is simple, but the structure is tied to exactly two levels and can lead to duplicated parent information.

  **Decision:** Not chosen.
  - ---

- **Second- Store an Array of Children in the Parent**

  For example:

  ```json
  {
    "name": "Electronics",
    "children": [
      "mobilePhonesId",
      "laptopsId",
      "headphonesId"
    ]
  }
  ```

  This represents the relationship clearly, but the parent has to maintain the list of children.

  Moving a child from one parent to another would require modifying the parent documents.

  **Decision:** Not chosen.

  - ---

- **Third Child References Parent — Chosen**

  Instead of treating parent and child as different types, every document represents a `Category`.

  The relationship is represented using:

  ```ts
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    default: null,
  }
  ```

  A parent category has:

  ```json
  {
    "name": "Electronics",
    "parent": null
  }
  ```

  A child category has:

  ```json
  {
    "name": "Mobile Phones",
    "parent": "Electronics ObjectId"
  }
  ```

  The relationship becomes:

  ```text
      Electronics
      _id: 100
      parent: null
          ↑
          │
          │ parent
          │
      Mobile Phones
      _id: 200
      parent: 100
  ```
---

### Why This Was Chosen

The main reason was **flexibility**.

Both parent and child are fundamentally the same domain entity: a `Category`.

The hierarchy is determined by the `parent` field:

```text
parent: null
    ↓
Top-level category

parent: ObjectId
    ↓
Child category
```

This gives us a consistent model:

```text
Category
├── name
├── normalizedName
├── parent
└── active
```

It also allows the hierarchy to grow without changing the schema:

```text
Electronics
└── Mobile Phones
    └── Android Phones
        └── Samsung
```

Each category simply references its immediate parent.

---

### How the Relationship Works

Creating the parent:

```ts
const electronics = await Category.create({
  name: "Electronics",
  normalizedName: "electronics",
  parent: null,
  active: true,
});
```

Creating a child:

```ts
const mobilePhones = await Category.create({
  name: "Mobile Phones",
  normalizedName: "mobile phones",
  parent: electronics._id,
  active: true,
});
```

Finding all children of a parent:

```ts
const children = await Category.find({
  parent: electronics._id,
});
```

If the parent information is required along with the child, Mongoose can use:

```ts
const category = await Category
  .findById(categoryId)
  .populate("parent");
```

---

### Important Mongoose Concept

The following: `ref: "Category"` does **not** create a SQL-style foreign key.
It tells Mongoose:

> "The ObjectId stored in this field refers to a document from the `Category` model."

This allows Mongoose to resolve the referenced document when using `populate()`.

MongoDB itself stores the `ObjectId` reference.

---

### Final Design

```text
                    Category
                       │
             ┌─────────┴─────────┐
             │                   │
       parent: null        parent: ObjectId
             │                   │
             ↓                   ↓
       Parent Category      Child Category
                                 │
                                 ↓
                         References another
                          Category document
```

So the final relationship is:

```text
Electronics
├── Mobile Phones
├── Laptops
└── Headphones
```

Internally:

```text
Electronics
_id: 100
parent: null

Mobile Phones
parent: 100

Laptops
parent: 100

Headphones
parent: 100
```

---

### What I Learned

The important design lesson was:
> **Don't model the database only around the current number of levels when the domain itself is hierarchical.**

Instead of creating separate fields for:

```text
parent
child
sub-child
...
```

I modeled the domain as:

```text
Category → Category → Category → ...
```

with a self-referencing `parent` field.

This makes the schema easier to extend and avoids unnecessary duplication.

---

## Interview Discussion

This can definitely become an interview discussion, especially if the interviewer asks about **MongoDB data modeling**.

### Question
> **How would you model a parent-child category relationship in MongoDB?**

### Answer:

> "I would model each category as an independent document and use a self-referencing ObjectId for the parent. A top-level category has a null parent, while a child stores the ObjectId of its parent. This gives me a one-to-many relationship and avoids duplicating parent information. I prefer this approach because the hierarchy can grow to additional levels without changing the schema. In Mongoose, I can define the reference using `Schema.Types.ObjectId` with `ref: 'Category'` and use `populate()` when I need the referenced parent."

### Follow-up Questions an Interviewer Could Ask

**Why not store all children inside the parent?**

Because that makes the parent responsible for maintaining the relationship and can make moving or updating children more complicated.

**Is `ref` a foreign key?**

No. It is a Mongoose reference that tells Mongoose which model the ObjectId belongs to. MongoDB itself does not enforce it like a relational database foreign key.

**How would you find all children of a parent?**

```ts
Category.find({
  parent: parentId,
});
```

**How would you support a third level?**

No schema change is required. The third-level category simply references its immediate parent:

```text
Electronics
    ↓
Mobile Phones
    ↓
Android Phones
```

`Android Phones.parent = Mobile Phones._id`.

### Interview Keywords

  - MongoDB data modeling
  - Self-referencing relationship
  - One-to-many relationship
  - ObjectId reference
  - Mongoose `ref`
  - Mongoose `populate`
  - Hierarchical/tree data
  - Schema flexibility
  - Data duplication
  - Tradeoff analysis
  - Extensible schema
---

## 3. 