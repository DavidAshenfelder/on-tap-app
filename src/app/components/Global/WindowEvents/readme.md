## Window Events Component

**Add global window event listeners for specific actions**

*_currently only setup for keydown on escape key, can be extended later if needed_*

_Explanation of how it works by Travis_



Cool thing about the reducer/architecture we have, is that all reducers have to listen to all actions.

Every single reducer is combined into one single function that is store.

The dispatch function actually just runs that single, combined reducer function with the current state (which is saved as just an object) and the action you're passing in.


```
   ... store code.....
   store = combinedReducers;
   state = {};
   dispatch = (action) => {
      // This looks just like our tests! Pass in current state, and action!
      // This is exactly what the store is doing
      state = store(state, action);
   }
   ... store code ...
```

So, this means that every single ACTION that is dispatched, goes through every single reducer in the entire application. It only updates that particular reducer IFF the type matches.

So the absolutely most awesome part of the reducer flow, is that as any arbitrary action flows through the system, any other part of the application (through the reducers) can listen for those events.

So, in this case, just throw out the GLOBAL.WINDOW.KEY.ESC.PRESS, action. And every reducer will be called with that action type. Then, just add a new case that matches what already is closing all 3 of the modals and you're done!
