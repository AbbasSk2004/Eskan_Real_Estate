```bash
# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Configure your environment variables
# Edit .env and backend/.env with your Supabase credentials
```

### 4. Start Development

```bash
# Start both frontend and backend
npm run dev

# Or start separately
npm start                    # Frontend (port 3000)
cd backend && npm run dev    # Backend (port 5000)
```

### 5. Verify Setup

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Contributing Guidelines

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix issues in the codebase
- **Features**: Add new functionality
- **Documentation**: Improve or add documentation
- **Tests**: Add or improve test coverage
- **Performance**: Optimize existing code
- **UI/UX**: Improve user interface and experience
- **Accessibility**: Make the app more accessible
- **Translations**: Add support for new languages

### Branch Naming Convention

Use descriptive branch names:

```bash
# Feature branches
feature/add-property-search
feature/user-authentication
feature/chat-system

# Bug fix branches
fix/property-image-upload
fix/responsive-layout
fix/api-error-handling

# Documentation branches
docs/api-documentation
docs/deployment-guide

# Hotfix branches
hotfix/security-vulnerability
hotfix/critical-bug
```

### Commit Message Format

Follow the conventional commits specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```bash
feat(auth): add phone number verification
fix(properties): resolve image upload issue
docs(api): update authentication endpoints
style(ui): improve responsive design for mobile
refactor(components): extract reusable PropertyCard component
test(api): add unit tests for property controller
chore(deps): update React to version 18.2.0
```

## Pull Request Process

### 1. Before Creating a PR

- [ ] Ensure your code follows the coding standards
- [ ] Add or update tests as needed
- [ ] Update documentation if necessary
- [ ] Test your changes thoroughly
- [ ] Rebase your branch on the latest main branch

```bash
# Update your fork
git fetch upstream
git checkout main
git merge upstream/main
git push origin main

# Rebase your feature branch
git checkout your-feature-branch
git rebase main
```

### 2. Creating the Pull Request

1. **Title**: Use a clear, descriptive title
2. **Description**: Include:
   - What changes were made
   - Why the changes were necessary
   - How to test the changes
   - Screenshots (for UI changes)
   - Related issue numbers

**PR Template:**
```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### 3. Review Process

- All PRs require at least one review from a maintainer
- Address feedback promptly and professionally
- Keep discussions focused on the code and technical aspects
- Be open to suggestions and alternative approaches

### 4. After Approval

- Squash commits if requested
- Ensure CI/CD checks pass
- Maintainers will merge the PR

## Coding Standards

### JavaScript/React Standards

**General Rules:**
- Use ES6+ features
- Prefer functional components with hooks
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic

**Code Style:**
```javascript
// Use const/let instead of var
const apiUrl = process.env.REACT_APP_API_URL;
let isLoading = false;

// Use arrow functions for callbacks
const handleSubmit = (event) => {
  event.preventDefault();
  // Handle form submission
};

// Use destructuring
const { title, price, location } = property;

// Use template literals
const message = `Property ${title} is located in ${location}`;

// Use async/await instead of promises
const fetchProperties = async () => {
  try {
    const response = await api.get('/properties');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};
```

**React Component Structure:**
```javascript
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const PropertyCard = ({ property, onFavorite, className }) => {
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    // Component logic
  }, []);

  const handleFavoriteClick = () => {
    setIsFavorited(!isFavorited);
    onFavorite(property.id);
  };

  return (
    <div className={`property-card ${className}`}>
      {/* Component JSX */}
    </div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.object.isRequired,
  onFavorite: PropTypes.func.isRequired,
  className: PropTypes.string
};

PropertyCard.defaultProps = {
  className: ''
};

export default PropertyCard;
```

### CSS/Styling Standards

**Use Bootstrap Classes:**
```css
/* Prefer Bootstrap utility classes */
.property-card {
  @apply bg-white rounded-lg shadow-md p-4 mb-4;
}

/* Custom styles when needed */
.property-image {
  aspect-ratio: 16/9;
  object-fit: cover;
}
```

**Responsive Design:**
```css
/* Mobile-first approach */
.property-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .property-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .property-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Backend Standards

**Express.js Controllers:**
```javascript
class PropertyController {
  static async getProperties(req, res) {
    try {
      const { page = 1, limit = 12 } = req.query;
      
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        return res.status(400).json({ 
          success: false, 
          message: error.message 
        });
      }

      res.json({
        success: true,
        data: {
          properties: data,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: data.length
          }
        }
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }
}
```

**Error Handling:**
```javascript
// Use try-catch blocks
// Return consistent error responses
// Log errors for debugging
// Don't expose sensitive information
```

### File Organization

```
src/
├── components/
│   ├── common/          # Reusable components
│   ├── forms/           # Form components
│   ├── layout/          # Layout components
│   └── property/        # Property-specific components
├── pages/               # Page components
├── services/            # API services
├── utils/               # Utility functions
├── hooks/               # Custom hooks
├── contexts/            # React contexts
└── assets/              # Static assets
```

## Testing

### Frontend Testing

**Component Tests:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import PropertyCard from '../PropertyCard';

describe('PropertyCard', () => {
  const mockProperty = {
    id: '1',
    title: 'Test Property',
    price: 250000,
    location: 'Test Location'
  };

  test('renders property information', () => {
    render(<PropertyCard property={mockProperty} onFavorite={jest.fn()} />);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('$250,000')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  test('calls onFavorite when favorite button is clicked', () => {
    const mockOnFavorite = jest.fn();
    render(<PropertyCard property={mockProperty} onFavorite={mockOnFavorite} />);
    
    fireEvent.click(screen.getByRole('button', { name: /favorite/i }));
    expect(mockOnFavorite).toHaveBeenCalledWith('1');
  });
});
```

**Running Tests:**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Backend Testing

**API Tests:**
```javascript
const request = require('supertest');
const app = require('../index');

describe('Properties API', () => {
  test('GET /api/properties should return properties list', async () => {
    const response = await request(app)
      .get('/api/properties')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data.properties)).toBe(true);
  });

  test('POST /api/properties should create new property', async () => {
    const newProperty = {
      title: 'Test Property',
      price: 250000,
      property_type: 'Apartment'
    };

    const response = await request(app)
      .post('/api/properties')
      .send(newProperty)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.title).toBe('Test Property');
  });
});
```

## Documentation

### Code Documentation

**JSDoc Comments:**
```javascript
/**
 * Fetches properties from the API with filtering options
 * @param {Object} filters - Filter criteria
 * @param {string} filters.city - City filter
 * @param {number} filters.minPrice - Minimum price
 * @param {number} filters.maxPrice - Maximum price
 * @returns {Promise<Object>} Properties data with pagination
 */
const fetchProperties = async (filters = {}) => {
  // Implementation
};
```

**README Updates:**
- Update README.md when adding new features
- Include setup instructions for new dependencies
- Add examples for new API endpoints

### API Documentation

- Update API.md when adding new endpoints
- Include request/response examples
- Document authentication requirements
- Add error codes and messages

## Issue Reporting

### Bug Reports

Use the bug report template:

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. iOS]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Add any other context about the problem here.
```

### Feature Requests

Use the feature request template:

```markdown
**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

## Community

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: For security issues (security@yourdomain.com)

### Getting Help

1. **Search existing issues** before creating new ones
2. **Use descriptive titles** for issues and PRs
3. **Provide context** and steps to reproduce
4. **Be patient and respectful** in all interactions

### Recognition

Contributors will be recognized in:
- CHANGELOG.md for significant contributions
- README.md contributors section
- Release notes for major features

## Release Process

### Version Numbering

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

- [ ] Update version in package.json
- [ ] Update CHANGELOG.md
- [ ] Create release branch
- [ ] Run full test suite
- [ ] Update documentation
- [ ] Create GitHub release
- [ ] Deploy to production

Thank you for contributing to Real Estate React! 🏠✨
```

```markdown:docs/CHANGELOG.md
# Changelog

All notable changes to the Real Estate React application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Dark mode support
- Advanced search filters
- Property comparison feature
- Email notifications for saved searches
- Multi-language support (Arabic, French)

### Changed
- Improved mobile responsiveness
- Enhanced property image gallery
- Updated UI components to Bootstrap 5.3

### Fixed
- Property search pagination issues
- Image upload validation
- Chat message ordering

## [1.2.0] - 2024-01-15

### Added
- Real-time chat system between users and property owners
- Phone number verification via SMS
- Property favorites functionality
- User dashboard with analytics
- Advanced property filtering (price range, bedrooms, bathrooms)
- Property view tracking and analytics
- Contact inquiry system
- User preferences and saved searches
- Property image gallery with lightbox
- Responsive design for mobile devices
- Social media integration
- Google Maps integration for property locations
- Property sharing functionality
- User profile management with avatar upload

### Changed
- Migrated from Firebase to Supabase for backend services
- Improved property listing performance with pagination
- Enhanced search functionality with real-time suggestions
- Updated authentication system with better security
- Redesigned property detail page layout
- Improved file upload system with better validation
- Enhanced error handling and user feedback

### Fixed
- Property image upload size validation
- Search filter persistence across page navigation
- Mobile navigation menu issues
- Property card layout on different screen sizes
- Authentication token refresh mechanism
- Form validation error messages
- Image loading optimization