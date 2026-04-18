# Code Smells — Detection and Refactoring

A code smell is a surface-level symptom of a deeper design problem. Smells don't always demand immediate action, but they warrant investigation.

## Smell Catalog

### Long Method
**Detection:** Method exceeds 10 lines; requires a comment to explain sections.
**Refactoring:**
- Extract Method: pull out a logically cohesive block with a descriptive name.
- Compose Method: reduce the method to a single level of abstraction (sequence of meaningful calls).

### Large Class
**Detection:** Class exceeds 50 lines; has many unrelated responsibilities.
**Refactoring:**
- Extract Class: find a cohesive subset of state + behavior and move it out.
- Apply SRP: ask "what is the single reason this class changes?"

### Long Parameter List
**Detection:** Method has more than 3 parameters.
**Refactoring:**
- Introduce Parameter Object: group related parameters into a value object or DTO.
- Preserve Whole Object: pass the object rather than extracting multiple fields from it.

### Divergent Change
**Detection:** One class is changed for multiple different reasons across releases.
**Refactoring:**
- Extract Class per reason to change (SRP).

### Shotgun Surgery
**Detection:** One logical change requires edits in many unrelated classes.
**Refactoring:**
- Move related code together; introduce a service or aggregate that owns the concept.

### Feature Envy
**Detection:** A method uses data or behavior from another class more than its own.
**Refactoring:**
- Move Method to the class whose data it envies.

### Data Clumps
**Detection:** The same group of 2–3 data items appears together in multiple places (parameters, fields).
**Refactoring:**
- Extract Class or value object for the cluster.

### Primitive Obsession
**Detection:** Using `string`, `number`, `boolean` for domain concepts (IDs, money, status, email).
**Refactoring:**
- Wrap primitive in a value object with validation and domain behavior.

### Switch Statements (on type)
**Detection:** `switch`/`if-else` chains dispatching behavior based on an object's type or status.
**Refactoring:**
- Replace Conditional with Polymorphism: create a subtype or strategy per case.
- Replace Type Code with State/Strategy pattern.

### Parallel Inheritance Hierarchies
**Detection:** Every time you add a subclass in hierarchy A, you also add one in hierarchy B.
**Refactoring:**
- Merge hierarchies; use delegation instead of inheritance for one dimension.

### Speculative Generality
**Detection:** Abstract classes, interfaces, or parameters that exist for "future" use cases that don't yet exist.
**Refactoring:**
- YAGNI: remove the abstraction; add it back when the second real case appears.

### Temporary Field
**Detection:** Instance variable is set only in certain code paths; `null` or meaningless otherwise.
**Refactoring:**
- Extract Class for the related state + behavior; use Null Object if appropriate.

### Message Chains
**Detection:** `a.getB().getC().getD().doSomething()` — long chains navigating object internals.
**Refactoring:**
- Apply Law of Demeter: ask the first object to perform the work; hide the chain behind a method.

### Middle Man
**Detection:** A class delegates most of its methods to another class without adding value.
**Refactoring:**
- Remove Middle Man: call the real object directly.
- Or: the middle man is an adapter — clarify its purpose.

### Inappropriate Intimacy
**Detection:** Two classes access each other's private fields/methods excessively.
**Refactoring:**
- Move Method/Field to consolidate related behavior in one class.
- Introduce a mediator if bidirectional coupling is necessary.

### Data Class
**Detection:** Class has only fields, getters, and setters with no behavior.
**Refactoring:**
- Move behavior from clients into the data class (Tell, Don't Ask).
- Use immutable value objects instead of mutable data containers.

### Comments Explaining What (Not Why)
**Detection:** Comment describes what the code does, not why the decision was made.
**Refactoring:**
- Extract Method with a descriptive name that replaces the comment.
- Reserve comments for non-obvious decisions and business context.

## Quick Smell → Principle Map

| Smell | Violated Principle |
|---|---|
| Large Class, Long Method | SRP |
| Switch on type | OCP, LSP |
| Long Parameter List | ISP |
| Feature Envy, Inappropriate Intimacy | DIP, Law of Demeter |
| Primitive Obsession, Data Clumps | Value Objects, Object Calisthenics |
| Speculative Generality | YAGNI |
| Message Chains | Law of Demeter |
