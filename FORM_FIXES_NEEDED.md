# Form Fixes Needed

The forms are not properly connected to save functions. Here's what needs to be done:

1. ✅ Portfolio form - inputs connected, save handler created, but need to wrap in form tag
2. ⚠️ Team form - need to connect inputs to state and button to handler  
3. ⚠️ Shop form - need to connect inputs to state and button to handler
4. ⚠️ Academic form - need to connect inputs to state and button to handler

The save handlers are already created:
- `handleSavePortfolio` ✅
- `handleSaveTeam` ✅
- `handleSaveShop` ✅
- `handleSaveAcademic` ✅

State variables are already created for all forms.

Now I need to:
1. Connect all form inputs to their state variables using `value` and `onChange`
2. Wrap forms in `<form>` tags with `onSubmit` handlers
3. Change save buttons to `type="submit"`
4. Populate form fields when editing (using useEffect or onClick handler)

