# Contributing to Music Visualizer

Thank you for your interest in contributing! This document provides guidelines for contributing to the Music Visualizer project.

## Code of Conduct

Be respectful, inclusive, and professional. Treat all contributors with courtesy.

## Getting Started

### 1. Fork the Repository

Click the **Fork** button on GitHub to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/yourusername/music-visualizer.git
cd music-visualizer
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/album-art-extraction`
- `fix/mobile-button-sizing`
- `perf/canvas-optimization`

### 5. Make Your Changes

Edit files and test locally:

```bash
pnpm dev
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "feat: add album art color extraction"
```

Follow [Conventional Commits](https://www.conventionalcommits.org):
- `feat:` New feature
- `fix:` Bug fix
- `perf:` Performance improvement
- `refactor:` Code restructuring
- `docs:` Documentation
- `test:` Tests
- `chore:` Build, dependencies

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create a Pull Request

1. Go to the original repository
2. Click **New Pull Request**
3. Select your branch
4. Add description of changes
5. Click **Create Pull Request**

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow existing code patterns
- Use Tailwind CSS for styling
- Keep components small and focused

### Component Structure

```typescript
// Good: Clear, focused component
interface VisualizerProps {
  frequency: Uint8Array | null;
  isPlaying: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  frequency,
  isPlaying,
}) => {
  // Component logic
};
```

### Performance

- Use `useCallback` for event handlers
- Memoize expensive computations
- Limit particle count to ~100
- Test on low-end devices

### Accessibility

- Add ARIA labels to buttons
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

### Testing

Run type checking:

```bash
pnpm check
```

Test locally:

```bash
pnpm dev
```

## Pull Request Process

1. **Describe your changes**: Explain what and why
2. **Link issues**: Reference related issues (#123)
3. **Test thoroughly**: Verify on desktop and mobile
4. **Keep it focused**: One feature per PR
5. **Respond to feedback**: Address reviewer comments

### PR Title Format

```
feat: add album art color extraction
fix: resolve mobile button sizing
perf: optimize canvas rendering
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issues
Fixes #123

## Changes
- Change 1
- Change 2
- Change 3

## Testing
How to test these changes

## Screenshots
If applicable, add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Changes tested locally
- [ ] Documentation updated
- [ ] No breaking changes
```

## Feature Ideas

### High Priority
- Album art color extraction from MP3 metadata
- Waveform timeline with scrubber
- Multiple visualization modes

### Medium Priority
- Playlist support
- Visualization presets
- Recording functionality
- Theme customization

### Low Priority
- Microphone input
- Keyboard shortcuts
- Social sharing
- Dark/light theme toggle

## Reporting Bugs

### Before Reporting

1. Check existing issues
2. Test with latest version
3. Clear browser cache
4. Try different browser

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Upload audio file
2. Click play
3. Observe issue

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop

## Screenshots
If applicable

## Additional Context
Any other relevant info
```

## Documentation

### README

- Keep up-to-date with new features
- Add examples for new functionality
- Update architecture section if needed

### Code Comments

```typescript
// Good: Explains why, not what
// Interpolate frequency data to prevent flickering during bass hits
const smoothingFactor = 0.75;

// Bad: Obvious from code
// Set smoothing factor
const smoothingFactor = 0.75;
```

### Commit Messages

```bash
# Good: Clear, descriptive
git commit -m "feat: add frequency band visualization

- Splits frequency data into bass, mid, treble
- Maps each band to different visual elements
- Improves responsiveness to different audio ranges"

# Bad: Vague
git commit -m "updates"
```

## Performance Checklist

Before submitting a PR:

- [ ] No console errors or warnings
- [ ] Runs at 60 FPS on desktop
- [ ] Runs at 30+ FPS on mobile
- [ ] Memory usage stable (no leaks)
- [ ] Load time < 3 seconds
- [ ] No unnecessary re-renders

## Accessibility Checklist

Before submitting a PR:

- [ ] All buttons have ARIA labels
- [ ] Keyboard navigation works
- [ ] Color contrast sufficient (WCAG AA)
- [ ] Tested with screen reader
- [ ] Mobile touch targets 44x44px+

## Getting Help

- **Questions**: Open a GitHub Discussion
- **Bugs**: Open a GitHub Issue
- **Ideas**: Open a GitHub Issue with "enhancement" label
- **Chat**: Check existing issues first

## Licensing

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes

## Questions?

Open an issue or start a discussion on GitHub. We're here to help!

---

**Thank you for contributing to Music Visualizer!** 🎵✨
