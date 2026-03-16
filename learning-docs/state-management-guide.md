# Global State Management: Context API vs. Redux

In Phase 4, we encountered a common React problem: **Prop Drilling**. 

We needed our JWT token inside `App.jsx` (to make API calls) but we generated that token deep inside `Login.jsx`. Passing data back and forth between parents, children, and siblings gets messy very fast.

To solve this, React gives us **Global State**.

---

## 1. The React Context API (What we just built)

The Context API is built directly into React. It acts like a "wormhole" that teleports data anywhere in your app without passing Props.

### How it works:
1. **The Context (`createContext`)**: An empty box.
2. **The Provider (`<AuthContext.Provider>`)**: You wrap your whole app in this component. It holds the actual data (`token`, `user`) and broadcasts it downward.
3. **The Consumer (`useContext` / `useAuth()`)**: Any component, anywhere in the tree, can call `useAuth()` to instantly grab the token or run the login/logout functions.

**Flutter Equivalent**: This is exactly how `Provider` and `InheritedWidget` work in Flutter!

**When to use Context:**
- Authentication state (who is logged in?)
- Theme settings (Light mode / Dark mode)
- User preferences (Language settings)

---

## 2. Redux (The Enterprise Standard)

Lab3's onboarding document specifically mentions **Redux**. Redux is a third-party library that solves the exact same "Global State" problem, but with a different architecture.

### How it works:
Redux forces you into a very strict, readable flow:
1. **Store**: A massive, single JavaScript object that holds the state for your *entire* application.
2. **Actions**: If a component wants to change the state (e.g., logging in), it cannot edit the Store directly. It must "dispatch" an Action. An action is just a description of what happened (e.g., `{ type: 'LOGIN_SUCCESS', payload: token }`).
3. **Reducers**: Pure functions that listen for Actions. They take the current state, apply the Action, and return a brand new state object.

**Flutter Equivalent**: This is identical to the **BLoC (Business Logic Component)** pattern!
- Store = Application State
- Actions = BLoC Events
- Reducers = BLoC State emission (`yield` or `emit`)

### Why use Redux over Context?
Context is great, but it has a massive flaw: If the data inside a Provider changes, *every single component* listening to that Provider re-renders. If you put 100 fast-changing variables into one Context, your app will be very slow.

Redux is highly optimized. It allows a component to say *"I only care about the `user.name` variable."* When `user.age` changes, that component will perfectly ignore it and avoid re-rendering. 

**When to use Redux (or Redux Toolkit):**
- Complex, rapidly changing state (e.g., live stock tickers, chat messages).
- Massive enterprise applications (like you will see at Lab3) where standardizing how state changes is more important than writing quick code.

---

### Summary for Lab3
If your team at Lab3 uses Redux, expect to write a little more "boilerplate" code to move data around, but know that it's just the BLoC pattern applied to React. For smaller pieces of global data (like themes), they probably use the Context API!
