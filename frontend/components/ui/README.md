# UI Component Library

A comprehensive collection of reusable React Native components for building beautiful mobile applications.

## 📦 Available Components

### Buttons & Actions
- **Button** - Customizable button with variants (primary, secondary, outline, ghost), sizes, loading states
- **Switch** - Toggle switch with custom colors
- **Checkbox** - Checkboxes with labels
- **Radio** - Radio button groups

### Form Inputs
- **Input** - Text input with label, error states, helper text, icons
- **Slider** - Range slider with value display
- **Dropdown** - Select/picker with modal interface
- **SearchBar** - Search input with clear button

### Feedback
- **AlertMessage** - Alert boxes (success, error, warning, info)
- **Modal** - Popup dialog with overlay
- **Loading** - Activity indicator with optional text
- **ProgressBar** - Linear progress indicator
- **Badge** - Notification badges

### Display
- **Card** - Container with shadow and rounded corners
- **Avatar** - User avatar with image or initials
- **Tag** - Labels with color variants
- **Chip** - Removable tags
- **Rating** - Star rating component

### Layout
- **Divider** - Horizontal separator line
- **Spacer** - Spacing utility (vertical/horizontal)
- **ListItem** - List row with icons and subtitle
- **Accordion** - Collapsible content sections
- **Tabs** - Tab navigation component

## 🚀 Usage

### Import Components

```typescript
// Import individual components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Or import from index
import { Button, Input, Card } from '@/components/ui';
```

### Button Examples

```typescript
// Primary button
<Button 
  title="Click Me" 
  onPress={() => {}} 
  variant="primary" 
  size="medium" 
/>

// Loading button
<Button 
  title="Submit" 
  onPress={handleSubmit} 
  loading={isLoading} 
/>

// Disabled button
<Button 
  title="Disabled" 
  onPress={() => {}} 
  disabled 
/>
```

### Input Examples

```typescript
// Basic input
<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
/>

// Input with error
<Input
  label="Password"
  placeholder="Enter password"
  secureTextEntry
  error="Password is required"
/>
```

### Dropdown Example

```typescript
const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

<Dropdown
  label="Select Option"
  options={options}
  value={selectedValue}
  onSelect={setSelectedValue}
/>
```

### Slider Example

```typescript
<Slider
  label="Volume"
  value={volume}
  onValueChange={setVolume}
  minimumValue={0}
  maximumValue={100}
/>
```

### Card Example

```typescript
<Card>
  <Text>Card content goes here</Text>
</Card>
```

### AlertMessage Example

```typescript
<AlertMessage 
  type="success" 
  message="Operation completed!" 
  onClose={() => {}}
/>
```

### Modal Example

```typescript
<Modal
  visible={isVisible}
  onClose={() => setIsVisible(false)}
  title="Modal Title"
>
  <Text>Modal content</Text>
</Modal>
```

### Accordion Example

```typescript
<Accordion title="Click to expand">
  <Text>Hidden content</Text>
</Accordion>
```

### Tabs Example

```typescript
<Tabs
  tabs={[
    { label: 'Home', content: <HomeContent /> },
    { label: 'Profile', content: <ProfileContent /> },
  ]}
/>
```

## 🎨 Customization

All components support:
- Style props for custom styling
- Multiple size variants
- Color customization
- Disabled states
- Responsive design

## 📱 Component Showcase

Run the app to see a live demo of all components with interactive examples!

## 🛠️ Built With

- React Native
- TypeScript
- Expo
- @react-native-community/slider

## 💡 Tips

1. **Consistent Styling** - All components follow iOS design guidelines by default
2. **TypeScript Support** - Full type safety with TypeScript interfaces
3. **Accessibility** - Components are built with touch-friendly sizes (44x44pt minimum)
4. **Performance** - Optimized with React.memo where applicable
5. **Reusability** - Easy to import and use across your entire app

## 📝 License

Free to use in your projects!
