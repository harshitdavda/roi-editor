# Imageeditorroi Custom Component

This is a custom component created for UnifyApps. You can develop and customize this component to extend your application's functionality.

## Project Structure

```
ImageEditorROI/
├── src/
│   ├── index.jsx      # Main React component file
│   └── style.css      # Component styles
├── manifest.json      # Component configuration for Unify
├── package.json       # Project dependencies and scripts
└── README.md          # This file
```

## Manifest Configuration

The `manifest.json` file configures your component for Unify. You can add icon and modify the keywords before using the manifest in Unify:

```json
{
  "name": "Imageeditorroi",
  "type": "ImageEditorROI",
  "entry": "./src/index.jsx",
  "keywords": "ImageEditorROI",
  "style": "./src/style.css",
  "icon": "https://assets.unifyapps.com/interface/migrated/theme/unify.svg"
}
```

### Fields

- **`name`** (required) - Display name of the component
- **`type`** (required) - Component type identifier
- **`entry`** (required) - Path to the main component file
- **`keywords`** (required) - Search keywords for the block picker
- **`style`** (optional) - Path to the component stylesheet
- **`icon`** (optional) - URL of the icon to display in the block picker

## Development

### Where to Develop

All component code should be developed in the `src/` directory:

- **`src/index.jsx`** - Your main React component. This is where you'll write your component logic.
- **`src/style.css`** - Component-specific styles. Add your CSS here.

The component receives the following props:
- `data` - Component data state
- `updateData` - Function to update component data
- `emitOnClick` - Function to emit click events
- `emitOnChange` - Function to emit change events

### Next Steps

#### Step 1: Install Dependencies

Install the required dependencies:

```bash
pnpm i
```

#### Step 2: Run in Development Mode

Start the development server to preview your component locally. Use the path shown during initialization:

```bash
pnpm run dev
```

Once started, the CLI will host the manifest at a local URL like:
```
http://localhost:5001/out.json
```

You'll use this URL in the next step.

#### Step 3: Add the Component in Unify

To make your component available inside Unify:

1. Go to **Custom Components Manager** in your Unify dashboard
2. Click **Add Component** and fill in:
   - **Component Name** - e.g., `Imageeditorroi`
   - **Deployment Mode** - Select **development mode** for testing
   - **Manifest URL** - The local URL from dev mode (e.g., `http://localhost:5001/out.json`)

On clicking **Add**, your component will be available in the Application Builder **block picker**.

#### Step 4: Instant Reload

While running in `dev` mode, any changes to your React component are instantly reflected. Just refresh the Application Builder to see updates.

#### Step 5: Build for Production

After finalizing and testing your component, generate a production-ready build. Use the same path as in step 2:

```bash
pnpm run build
```

This creates a `image-editor-roi.zip` file containing:
- Compiled assets
- A production `out.json` manifest

#### Step 6: Deploy to Production

1. Open the **Component Detail** panel in Unify
2. Click the three-dot menu next to the manifest URL
3. Select **Move to Production** from the dropdown
4. Upload the `image-editor-roi.zip` file

Your component is now live and ready to use across your Unify interfaces.

## Component Props

Your component receives the following props:

- `data` - Object containing component data state
- `updateData(newData)` - Function to update component data
- `emitOnClick()` - Function to emit click events
- `emitOnChange()` - Function to emit change events

## Removing a Component

To remove this component from your app:

1. Go to the **Custom Components** page in Unify
2. Delete the corresponding component you want to remove

## Resources

- [UnifyApps Custom Components Documentation](https://www.unifyapps.com/docs/unify-applications/add-custom-component)

