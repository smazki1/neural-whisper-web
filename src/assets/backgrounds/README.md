# Background Images Organization

## Folder Structure

```
src/assets/backgrounds/
├── hero/           # Hero section background images
├── section/        # Other section background images
├── general/        # General purpose background images
└── README.md       # This file
```

## Hero Background Images

Place all hero background images in the `hero/` folder with descriptive names:

- `hero-background-01.jpg` - Current background
- `hero-background-02.jpg` - Alternative option 1
- `hero-background-03.jpg` - Alternative option 2
- etc.

## Usage

To change the hero background image, update the import in:
`src/components/Hero/HeroBackground.tsx`

```typescript
import backgroundImage from '../../assets/backgrounds/hero/hero-background-01.jpg';
```

## Testing Different Backgrounds

1. Upload your background images to the `hero/` folder
2. Name them sequentially (hero-background-01.jpg, hero-background-02.jpg, etc.)
3. Update the import in HeroBackground.tsx to test different options
4. Commit and deploy to test

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Size**: Optimized for web (under 2MB recommended)
- **Dimensions**: Minimum 1920x1080 for full-screen coverage
- **Aspect Ratio**: 16:9 or wider for best results 