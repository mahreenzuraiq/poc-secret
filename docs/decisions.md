# Architecture & Design Decisions

## 1. Emoji Replacement
- **Decision**: All emojis across the application will be removed and replaced with standard, professional icons using `lucide-react`.
- **Rationale**: The user requested a "no emoji and standard and professional pwa app". A standard icon library like Lucide provides a clean, consistent, and professional civic feel.

## 2. Text-to-Speech & Voice Guide
- **Decision**: Retain and improve the Text-to-Speech voice guides and confirmation buttons, but replace their play/stop emojis with clean SVGs/lucide icons.
- **Rationale**: Keeps the accessibility features intact while elevating visual professionalism.
