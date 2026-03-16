# Understanding React Component Lifecycle (and `useEffect`)

When coming from Flutter, the concept of a component "mounting" mapping to React's `useEffect` can be confusing at first. Let's break it down using Flutter terminology!

## 1. What does "Mounting" mean?

Imagine your React app is building a Lego house (the web page).
- **Mounting**: The exact moment React places a new Lego piece (a Component) onto the board for the *very first time*. This is when the component is born.
- **Updating**: The component's Props or State changes, so React repaints it to look different (like swapping a red piece for a blue one).
- **Unmounting**: The component is removed from the screen (like destroying the Lego piece).

### Flutter Equivalent
- **Mounting** = `initState()`
- **Updating** = `build()` (specifically, when called again after `setState`)
- **Unmounting** = `dispose()`

---

## 2. Why do we need `useEffect`?

In our `App.jsx`, we want to fetch tasks from our backend (`http://localhost:3000/api/tasks`).
Why can't we just write `fetch()` directly inside the `App()` function?

```jsx
export default function App() {
  const [tasks, setTasks] = useState([]);

  // ❌ BAD: DO NOT DO THIS
  fetch('http://localhost:3000/api/tasks')
    .then(res => res.json())
    .then(data => setTasks(data));

  return <div>...</div>;
}
```

If we do this, here is what happens:
1. React calls `App()`.
2. `fetch()` runs and gets the data.
3. `setTasks(data)` is called.
4. **Because state changed, React re-runs `App()` to redraw the screen.**
5. `fetch()` runs again.
6. `setTasks(data)` is called again.
7. **Because state changed, React re-runs `App()` again.**
8. This creates an **infinite loop** that will freeze your browser and crash your server!

---

## 3. The Solution: `useEffect`

`useEffect` allows us to tell React:
> *"Hey React, run this chunk of code, but **ONLY** under specific conditions (like when the component first mounts)."*

### The Syntax
```jsx
import { useEffect } from 'react';

useEffect(() => {
  // 1. The code you want to run (the "effect")
}, []); // 2. The Dependency Array
```

### The Magic is in the Array `[]`
The second argument to `useEffect` is an array. It controls *when* the effect runs:

1. **Empty Array `[]` (The "Mount" effect)**
   ```jsx
   useEffect(() => {
     // This acts exactly like initState() in Flutter.
     // It runs ONCE when the component first appears on the screen.
   }, []);
   ```
   *This is what we use in `App.jsx` to fetch our tasks! We only want to fetch them once when the app starts.*

2. **Array with variables `[variableA]` (The "Watch" effect)**
   ```jsx
   const [searchQuery, setSearchQuery] = useState('');

   useEffect(() => {
     // This runs once when mounted, AND runs again 
     // every single time 'searchQuery' changes.
   }, [searchQuery]);
   ```

3. **No Array (DANGER)**
   ```jsx
   useEffect(() => {
     // This runs on mount AND after every single render/update.
     // Almost never use this unless you are building something highly custom.
   });
   ```

### Summary for `App.jsx`
Because we wrote `useEffect(..., [])` with an empty array in `App.jsx`, we are telling React:
"When the `App` component is first created and placed on the screen (mounts), go fetch the tasks from the backend. Once you have them, save them to state. **Do not run this fetch again** even if the component updates."
